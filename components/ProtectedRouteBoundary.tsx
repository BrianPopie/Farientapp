"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AUTH_EVENT, fakeAuth } from "@/lib/fakeAuth";

type SessionState = "loading" | "authenticated" | "unauthenticated";

export function ProtectedRouteBoundary({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const redirected = useRef(false);
  const [status, setStatus] = useState<SessionState>("loading");
  const renders = useRef(0);

  renders.current += 1;
  console.log("ProtectedRouteBoundary renders:", renders.current, { pathname, status });

  useEffect(() => {
    console.log("ProtectedRouteBoundary effect fired", { pathname, status });
  }, [pathname, status]);

  useEffect(() => {
    const update = () => {
      const next = fakeAuth.isAuthed() ? "authenticated" : "unauthenticated";
      setStatus(next);
    };
    update();
    window.addEventListener(AUTH_EVENT, update);
    window.addEventListener("focus", update);
    return () => {
      window.removeEventListener(AUTH_EVENT, update);
      window.removeEventListener("focus", update);
    };
  }, []);

  useEffect(() => {
    if (!redirected.current && status === "unauthenticated" && pathname !== "/login") {
      redirected.current = true;
      router.replace("/login");
      return;
    }
    if (status === "authenticated") {
      redirected.current = false;
    }
  }, [pathname, router, status]);

  if (status === "loading") {
    return null;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}
