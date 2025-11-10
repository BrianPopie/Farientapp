"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { fakeAuth } from "@/lib/fakeAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emailRegex = /^\S+@\S+\.\S+$/;
const pinRegex = /^\d{6}$/;

export function LoginForm() {
  const emailId = "login-email";
  const emailLabelId = "login-email-label";
  const passwordId = "login-password";
  const passwordLabelId = "login-password-label";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("[LoginForm] mounted – awaiting user input");
  }, []);

  useEffect(() => {
    if (!loading) return;
    const id = setTimeout(() => {
      console.log("[LoginForm] still processing login after 2s – possible freeze in production");
    }, 2000);
    return () => clearTimeout(id);
  }, [loading]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("[LoginForm] submit triggered", { emailMasked: email.replace(/(.).+(@.*)/, "$1***$2") });
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
      console.log("[LoginForm] authentication mock succeeded, redirecting to /dashboard");
      router.push("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("[LoginForm] authentication error", error);
        setErr(error.message);
      } else {
        console.error("[LoginForm] unknown authentication error", error);
        setErr("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4 text-white">
      <div className="grid gap-2">
        <Label id={emailLabelId} htmlFor={emailId} className="text-white/90">
          Email
        </Label>
        <Input
          id={emailId}
          type="email"
          autoComplete="email"
          aria-labelledby={emailLabelId}
          placeholder="you@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="border-white/30 bg-white/10 placeholder:text-white/60"
        />
      </div>
      <div className="grid gap-2">
        <Label id={passwordLabelId} htmlFor={passwordId} className="text-white/90">
          Password
        </Label>
        <Input
          id={passwordId}
          type="password"
          autoComplete="current-password"
          aria-labelledby={passwordLabelId}
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
  );
}
