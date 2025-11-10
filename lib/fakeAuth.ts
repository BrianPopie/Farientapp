"use client";

import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
  serializeSession,
  parseSession,
  type SessionPayload
} from "@/lib/auth/session";

export type Session = SessionPayload;

const encode = (value: Session) => serializeSession(value);
const decode = (value: string | undefined | null): Session | null => {
  const parsed = parseSession(value);
  if (!parsed && value && process.env.NODE_ENV !== "production") {
    console.warn("[fakeAuth] Unable to parse cookie payload");
  }
  return parsed;
};

function readCookie(): Session | null {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";").map((entry) => entry.trim());
  const token = cookies.find((entry) => entry.startsWith(`${SESSION_COOKIE_NAME}=`));
  if (!token) return null;
  const [, rawValue] = token.split("=");
  return decode(rawValue);
}

function writeCookie(value: Session | null) {
  if (typeof document === "undefined") return;
  const base = `${SESSION_COOKIE_NAME}=`;
  if (!value) {
    document.cookie = `${base}; Path=/; Max-Age=0; SameSite=Lax`;
    return;
  }
  const expires = new Date(Date.now() + SESSION_MAX_AGE * 1000).toUTCString();
  document.cookie = `${base}${encode(value)}; Path=/; Max-Age=${SESSION_MAX_AGE}; Expires=${expires}; SameSite=Lax${
    process.env.NODE_ENV === "production" ? "; Secure" : ""
  }`;
}

async function syncSession(action: "set" | "clear", session?: Session) {
  try {
    await fetch("/api/session", {
      method: action === "set" ? "POST" : "DELETE",
      headers: action === "set" ? { "Content-Type": "application/json" } : undefined,
      body: action === "set" ? JSON.stringify(session) : undefined,
      keepalive: action === "clear"
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[fakeAuth] Unable to sync session", error);
    }
  }
}

export const fakeAuth = {
  isAuthed(): boolean {
    return Boolean(readCookie());
  },
  get(): Session | null {
    return readCookie();
  },
  async signIn(email: string, password: string) {
    const ok = /^\S+@\S+\.\S+$/.test(email) && /^\d{6}$/.test(password);
    await new Promise((r) => setTimeout(r, 300));
    if (!ok) throw new Error("Use any email + a 6-digit password");
    const session = { email, createdAt: Date.now() };
    writeCookie(session);
    await syncSession("set", session);
  },
  signOut() {
    writeCookie(null);
    void syncSession("clear");
  }
};
