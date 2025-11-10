"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { fakeAuth } from "@/lib/fakeAuth";

type SessionState = "loading" | "authenticated" | "unauthenticated";

export function ProtectedRouteBoundary({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirectedRef = useRef(false);
  const [status, setStatus] = useState<SessionState>("loading");

  useEffect(() => {
    setStatus(fakeAuth.isAuthed() ? "authenticated" : "unauthenticated");
  }, [pathname]);

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/login" && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      router.replace("/login");
    }
    if (status === "authenticated") {
      hasRedirectedRef.current = false;
    }
  }, [status, pathname, router]);

  if (status === "loading") {
    return null;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}
