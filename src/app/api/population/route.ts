import { NextResponse } from "next/server";

const API_BASE = "https://api.darkerdb.com/v1";

export async function GET() {
  const res = await fetch(`${API_BASE}/population`);
  const data = await res.json();

  return NextResponse.json(data);
}
