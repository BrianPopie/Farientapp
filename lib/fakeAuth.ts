"use client";

const KEY = "farient_mock_session";
export type Session = { email: string; createdAt: number };

function readSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[fakeAuth] Unable to read session from localStorage", error);
    }
    return null;
  }
}

function writeSession(value: Session | null) {
  if (typeof window === "undefined") return;
  try {
    if (value) {
      window.localStorage.setItem(KEY, JSON.stringify(value));
    } else {
      window.localStorage.removeItem(KEY);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[fakeAuth] Unable to write session to localStorage", error);
    }
    throw new Error("Storage is unavailable in this browser");
  }
}

export const fakeAuth = {
  isAuthed(): boolean {
    return Boolean(readSession());
  },
  get(): Session | null {
    return readSession();
  },
  async signIn(email: string, password: string) {
    const ok = /^\S+@\S+\.\S+$/.test(email) && /^\d{6}$/.test(password);
    await new Promise((r) => setTimeout(r, 300));
    if (!ok) throw new Error("Use any email + a 6-digit password");
    writeSession({ email, createdAt: Date.now() });
  },
  signOut() {
    try {
      writeSession(null);
    } catch {
      // storage unavailable, nothing else to do
    }
  }
};
