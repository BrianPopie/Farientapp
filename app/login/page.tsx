"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { fakeAuth } from "@/lib/fakeAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const REDIRECT_PATH = "/";
const emailRegex = /^\S+@\S+\.\S+$/;
const pinRegex = /^\d{6}$/;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!emailRegex.test(email)) {
      setErr("Enter a valid email");
      return;
    }
    if (!pinRegex.test(password)) {
      setErr("Password must be 6 digits");
      return;
    }
    setLoading(true);
    try {
      await fakeAuth.signIn(email, password);
      router.push(REDIRECT_PATH);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErr(error.message);
      } else {
        setErr("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card/90 text-card-foreground shadow-2xl shadow-primary/20 backdrop-blur-md">
        <div className="px-6 pt-6 text-center">
          <div className="text-sm text-muted-foreground">Your logo</div>
          <h1 className="mt-1 text-xl font-semibold">Login</h1>
        </div>
        <form onSubmit={onSubmit} className="grid gap-4 px-6 py-5 text-foreground">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="6-digit password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {err && <div className="text-xs text-danger">{err}</div>}
          <Button type="submit" disabled={loading} className="mt-1 bg-primary text-primary-foreground hover:bg-primary/90">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <div className="pb-6 text-center text-xs text-muted-foreground">
            or continue with <span className="opacity-60">(mock buttons)</span>
          </div>
        </form>
      </div>
    </main>
  );
}
