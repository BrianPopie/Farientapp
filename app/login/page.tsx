"use client";

import { Suspense, type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { fakeAuth } from "@/lib/fakeAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import VideoBackground from "@/components/VideoBackground";
import Image from "next/image";

const REDIRECT_PATH = "/dashboard";
const emailRegex = /^\S+@\S+\.\S+$/;
const pinRegex = /^\d{6}$/;

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
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
    <main className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden">
      <VideoBackground className="absolute inset-0 h-full w-full" />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 px-6 py-8 text-white shadow-2xl shadow-black/50 backdrop-blur-md ring-1 ring-white/20">
        <div className="flex flex-col items-center gap-2 text-center">
          <Image src="/brand.svg" alt="Farient logo" width={48} height={48} className="rounded-xl" priority />
          <div className="text-xs uppercase tracking-[0.35em] text-white/60">Farient Deal Intelligence</div>
          <h1 className="text-xl font-semibold">Login</h1>
        </div>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4 text-white">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-white/90">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="border-white/30 bg-white/10 placeholder:text-white/60"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-white/90">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="6-digit password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="border-white/30 bg-white/10 placeholder:text-white/60"
            />
          </div>
          {err && <div className="text-xs text-red-200">{err}</div>}
          <Button
            type="submit"
            disabled={loading}
            className="mt-1 bg-white/20 text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:bg-white/30"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <div className="pb-2 text-center text-xs text-white/70">
            or continue with <span className="opacity-60">(mock buttons)</span>
          </div>
        </form>
      </div>
    </main>
  );
}
