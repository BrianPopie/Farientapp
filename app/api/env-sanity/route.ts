import { NextResponse } from "next/server";

export const runtime = "nodejs";

const KEYS = [
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
] as const;

export async function GET() {
  const envFlags = Object.fromEntries(KEYS.map((key) => [key, Boolean(process.env[key])]));
  return NextResponse.json(envFlags);
}
