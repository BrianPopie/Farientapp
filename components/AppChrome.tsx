"use client";

import dynamic from "next/dynamic";
import { Suspense, type ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AUTH_EVENT, fakeAuth } from "@/lib/fakeAuth";
import { CitationDrawer } from "@/components/CitationDrawer";
import { DevConsoleSilencer } from "@/components/DevConsoleSilencer";
import { FocusModeProvider } from "@/hooks/useFocusMode";

const SidebarPanel = dynamic(() => import("@/components/Sidebar").then((mod) => ({ default: mod.Sidebar })), {
  ssr: false,
  loading: () => (
    <aside className="hidden min-h-screen w-[240px] flex-col items-center justify-center border-r border-border bg-[rgba(var(--bg),0.9)] p-4 text-xs text-text-muted lg:flex">
      Loading navigation…
    </aside>
  )
});

const NavBar = dynamic(() => import("@/components/Nav").then((mod) => ({ default: mod.Nav })), {
  ssr: false,
  loading: () => (
    <div className="sticky top-0 z-40 flex h-16 items-center border-b border-border bg-[rgba(var(--bg),0.85)] px-4 text-xs text-text-muted">
      Preparing workspace…
    </div>
  )
});

interface AppChromeProps {
  children: ReactNode;
}

export function AppChrome({ children }: AppChromeProps) {
  const [authed, setAuthed] = useState<boolean>(() => fakeAuth.isAuthed());
  const router = useRouter();

  useEffect(() => {
    const update = () => setAuthed(fakeAuth.isAuthed());
    window.addEventListener(AUTH_EVENT, update);
    window.addEventListener("focus", update);
    return () => {
      window.removeEventListener(AUTH_EVENT, update);
      window.removeEventListener("focus", update);
    };
  }, []);

  const focusValue = useMemo(
    () => ({
      focusMode: true,
      setFocusMode: () => {},
      toggleFocusMode: () => {}
    }),
    []
  );

  const handleSignOut = () => {
    fakeAuth.signOut();
    router.push("/login");
  };

  const renderLoading = (message = "Loading workspace…") => (
    <div className="flex min-h-screen w-full items-center justify-center bg-bg text-text">
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  );

  return (
    <>
      <DevConsoleSilencer />
      {!authed ? (
        renderLoading("Validating session…")
      ) : (
        <FocusModeProvider value={focusValue}>
          <>
            <div className="w-full">
              <div className="grid min-h-screen grid-cols-[240px_minmax(0,1fr)] bg-bg">
                <Suspense fallback={null}>
                  <SidebarPanel authed={authed} onSignOut={handleSignOut} />
                </Suspense>
                <div className="flex flex-col">
                  <Suspense fallback={null}>
                    <NavBar />
                  </Suspense>
                  <div className="flex-1">{children}</div>
                </div>
              </div>
            </div>
            {process.env.NODE_ENV === "development" ? null : <CitationDrawer />}
          </>
        </FocusModeProvider>
      )}
    </>
  );
}
