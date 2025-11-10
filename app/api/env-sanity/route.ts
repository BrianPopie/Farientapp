import { NextResponse } from "next/server";

const REQUIRED_ENVS = [
  "OPENAI_API_KEY",
  "OPENAI_MODEL",
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
] as const;

type EnvFlag = {
  key: (typeof REQUIRED_ENVS)[number];
  defined: boolean;
};

export async function GET() {
  const envs: EnvFlag[] = REQUIRED_ENVS.map((key) => ({
    key,
    defined: Boolean(process.env[key])
  }));

  return NextResponse.json({
    ok: envs.every((entry) => entry.defined),
    envs
  });
}
