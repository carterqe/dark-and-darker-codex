import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import { rateLimit } from "@/lib/rate-limit";

const USERNAME_RE = /^[a-zA-Z0-9_]+$/;

function checkCsrfOrigin(request: NextRequest): NextResponse | null {
  const origin = request.headers.get("origin");
  if (!origin) return null; // same-origin requests may omit Origin

  const host = request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const expected = `${proto}://${host}`;

  if (origin !== expected) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function POST(request: NextRequest) {
  // CSRF origin check
  const csrfError = checkCsrfOrigin(request);
  if (csrfError) return csrfError;

  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { ok } = rateLimit(ip, { limit: 5, windowMs: 60_000 });
  if (!ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { username, access_token } = body as {
    username: unknown;
    access_token?: string;
  };

  // Input validation: must be string, 3-20 chars, alphanumeric + underscores
  if (
    typeof username !== "string" ||
    username.trim().length < 3 ||
    username.trim().length > 20 ||
    !USERNAME_RE.test(username.trim())
  ) {
    return NextResponse.json(
      { error: "Username must be 3-20 characters, letters/numbers/underscores only" },
      { status: 400 }
    );
  }

  const sanitizedUsername = username.trim();

  // Verify the user's identity using their access token
  let userId: string | null = null;

  if (access_token) {
    // Token passed directly from signUp response (cookies may not be set yet)
    const admin = createAdminClient();
    const { data } = await admin.auth.getUser(access_token);
    userId = data.user?.id ?? null;
  }

  if (!userId) {
    // Fallback: try cookie-based session
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    userId = data.user?.id ?? null;
  }

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Insert (not upsert) — let the DB UNIQUE constraint be the authoritative check
  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .insert({ id: userId, username: sanitizedUsername });

  if (error) {
    // Postgres unique constraint violation
    if (error.code === "23505") {
      if (error.message?.includes("username")) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 409 }
        );
      }
      // PK conflict — profile already exists for this user ID
      return NextResponse.json(
        { error: "Profile already exists" },
        { status: 409 }
      );
    }
    // Generic error — do not leak internal details
    console.error("Profile creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
