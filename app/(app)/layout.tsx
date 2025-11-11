import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import ProtectedRouteBoundary from "@/components/ProtectedRouteBoundary";
import { Sidebar } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";
import { FocusVignette } from "@/components/ui/FocusVignette";

export const runtime = "nodejs";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ProtectedRouteBoundary>
        <div className="flex min-h-screen bg-background text-foreground">
          <Sidebar />
          <div className="flex flex-1 flex-col">
            <Topbar />
            <main className="relative flex-1 overflow-y-auto bg-background">
              <FocusVignette />
              <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 py-8">{children}</div>
            </main>
          </div>
        </div>
      </ProtectedRouteBoundary>
    </ThemeProvider>
  );
}
