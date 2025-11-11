import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { CitationDrawer } from "@/components/CitationDrawer";
import { DevConsoleSilencer } from "@/components/DevConsoleSilencer";
import ClientRuntimeListener from "@/app/(instrumentation)/client-runtime-listener";

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

export function AppChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <DevConsoleSilencer />
      <ClientRuntimeListener />
      <div className="w-full">
        <div className="grid min-h-screen grid-cols-[240px_minmax(0,1fr)] bg-bg">
          <SidebarPanel />
          <div className="flex flex-col">
            <NavBar />
            <div className="flex-1 bg-bg">{children}</div>
          </div>
        </div>
      </div>
      {process.env.NODE_ENV === "development" ? null : <CitationDrawer />}
    </>
  );
}
