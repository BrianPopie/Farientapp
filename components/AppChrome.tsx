"use client";

import { Suspense, type ReactNode, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { fakeAuth } from "@/lib/fakeAuth";
import { Sidebar } from "@/components/Sidebar";
import { Nav } from "@/components/Nav";
import { CitationDrawer } from "@/components/CitationDrawer";
import { DevConsoleSilencer } from "@/components/DevConsoleSilencer";
import { FocusModeProvider } from "@/hooks/useFocusMode";

interface AppChromeProps {
  children: ReactNode;
}

export function AppChrome({ children }: AppChromeProps) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const loginRoute = pathname === "/login";

  useEffect(() => {
    const ok = fakeAuth.isAuthed();
    setAuthed(ok);
    if (!ok && !loginRoute) {
      router.replace("/login");
    }
  }, [loginRoute, pathname, router]);

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
    setAuthed(false);
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
      {loginRoute ? (
        children
      ) : authed === null ? (
        renderLoading()
      ) : !authed ? (
        renderLoading("Redirecting to login…")
      ) : (
        <FocusModeProvider value={focusValue}>
          <>
            <div className="w-full">
              <div className="grid min-h-screen grid-cols-[240px_minmax(0,1fr)] bg-bg">
                <Suspense fallback={null}>
                  <Sidebar authed={authed} onSignOut={handleSignOut} />
                </Suspense>
                <div className="flex flex-col">
                  <Nav />
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
