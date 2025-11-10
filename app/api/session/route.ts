import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
  serializeSession,
  type SessionPayload,
  parseSession
} from "@/lib/auth/session";

function toResponse(body: unknown, init?: number) {
  return NextResponse.json(body, init ? { status: init } : undefined);
}

function setSessionCookie(res: NextResponse, session: SessionPayload | null) {
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: session ? serializeSession(session) : "",
    maxAge: session ? SESSION_MAX_AGE : 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false
  });
}

export async function POST(req: NextRequest) {
  const payload = await req.json().catch(() => null);
  const email = typeof payload?.email === "string" ? payload.email : null;
  if (!email) {
    return toResponse({ ok: false, error: "Email is required" }, 400);
  }
  const createdAt =
    typeof payload?.createdAt === "number" && Number.isFinite(payload.createdAt) ? payload.createdAt : Date.now();
  const session: SessionPayload = { email, createdAt };
  const res = toResponse({ ok: true, session });
  setSessionCookie(res, session);
  return res;
}

export async function DELETE() {
  const res = toResponse({ ok: true });
  setSessionCookie(res, null);
  return res;
}

export async function GET(req: NextRequest) {
  const cookieSession = parseSession(req.cookies.get(SESSION_COOKIE_NAME)?.value ?? null);
  return toResponse({
    ok: Boolean(cookieSession),
    session: cookieSession
  });
}
