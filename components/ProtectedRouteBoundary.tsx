"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AUTH_EVENT, fakeAuth } from "@/lib/fakeAuth";

type Status = "loading" | "authenticated" | "unauthenticated";

export default function ProtectedRouteBoundary({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<Status>("loading");
  const redirected = useRef(false);

  useEffect(() => {
    const sync = () => setStatus(fakeAuth.isAuthed() ? "authenticated" : "unauthenticated");
    sync();
    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  useEffect(() => {
    if (!redirected.current && status === "unauthenticated" && pathname !== "/login") {
      redirected.current = true;
      router.replace("/login");
    } else if (status === "authenticated") {
      redirected.current = false;
    }
  }, [status, pathname, router]);

  if (status === "loading" || status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}
