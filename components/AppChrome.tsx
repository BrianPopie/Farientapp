"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
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
  const [authed, setAuthed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const loginRoute = pathname === "/login";

  useEffect(() => {
    setAuthed(fakeAuth.isAuthed());
  }, [pathname]);
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

  return (
    <>
      <DevConsoleSilencer />
      {loginRoute ? (
        children
      ) : (
        <FocusModeProvider value={focusValue}>
          <>
            <div className="w-full">
              <div className="grid min-h-screen grid-cols-[240px_minmax(0,1fr)] bg-bg">
                <Sidebar authed={authed} onSignOut={handleSignOut} />
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
