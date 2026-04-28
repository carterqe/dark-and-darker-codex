import type { NextRequest } from "next/server";

function normalizeHost(host: string): string {
  return host.toLowerCase().replace(/^www\./, "");
}

function safeHost(url: string): string | null {
  try {
    return normalizeHost(new URL(url).host);
  } catch {
    return null;
  }
}

/**
 * CSRF origin check: compares the request's Origin header to the configured
 * site host. Treats apex and www as equivalent, and accepts Vercel preview
 * URLs when running on Vercel.
 *
 * Returns true if the request is allowed.
 */
export function checkOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // same-origin or older browser — allow

  const originHost = safeHost(origin);
  if (!originHost) return false;

  const allowed = new Set<string>();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    const siteHost = safeHost(
      /^https?:\/\//i.test(siteUrl) ? siteUrl : `https://${siteUrl}`,
    );
    if (siteHost) allowed.add(siteHost);
  }

  // Vercel preview / production URL
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelHost) allowed.add(normalizeHost(vercelHost));
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) allowed.add(normalizeHost(vercelUrl));

  // Fall back to the request's own Host header
  const host = request.headers.get("host");
  if (host) allowed.add(normalizeHost(host));

  return allowed.has(originHost);
}
