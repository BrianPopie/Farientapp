"use client";

const KEY = "farient_mock_session";
export type Session = { email: string; createdAt: number };

export const fakeAuth = {
  isAuthed(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(KEY);
  },
  get(): Session | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  },
  async signIn(email: string, password: string) {
    const ok = /^\S+@\S+\.\S+$/.test(email) && /^\d{6}$/.test(password);
    await new Promise((r) => setTimeout(r, 300));
    if (!ok) throw new Error("Use any email + a 6-digit password");
    localStorage.setItem(KEY, JSON.stringify({ email, createdAt: Date.now() } satisfies Session));
  },
  signOut() {
    localStorage.removeItem(KEY);
  }
};