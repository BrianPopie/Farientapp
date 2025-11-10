import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NODE_ENV: process.env.NODE_ENV
    }
  });
}
