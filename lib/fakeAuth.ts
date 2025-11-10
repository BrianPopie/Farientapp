"use client";

const COOKIE_NAME = "farient_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
export type Session = { email: string; createdAt: number };

const encode = (value: Session) => encodeURIComponent(JSON.stringify(value));
const decode = (value: string | undefined | null): Session | null => {
  if (!value) return null;
  try {
    return JSON.parse(decodeURIComponent(value)) as Session;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[fakeAuth] Unable to parse cookie payload", error);
    }
    return null;
  }
};

function readCookie(): Session | null {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";").map((entry) => entry.trim());
  const token = cookies.find((entry) => entry.startsWith(`${COOKIE_NAME}=`));
  if (!token) return null;
  const [, rawValue] = token.split("=");
  return decode(rawValue);
}

function writeCookie(value: Session | null) {
  if (typeof document === "undefined") return;
  const base = `${COOKIE_NAME}=`;
  if (!value) {
    document.cookie = `${base}; Path=/; Max-Age=0; SameSite=Lax`;
    return;
  }
  const expires = new Date(Date.now() + COOKIE_MAX_AGE * 1000).toUTCString();
  document.cookie = `${base}${encode(value)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; Expires=${expires}; SameSite=Lax${
    process.env.NODE_ENV === "production" ? "; Secure" : ""
  }`;
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
    writeCookie({ email, createdAt: Date.now() });
  },
  signOut() {
    writeCookie(null);
  }
};
