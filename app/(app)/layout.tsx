import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import ProtectedRouteBoundary from "@/components/ProtectedRouteBoundary";
import { Sidebar } from "@/components/Sidebar";

export const runtime = "nodejs";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ProtectedRouteBoundary>
        <div className="flex min-h-screen bg-bg text-text">
          <Sidebar />
          <main className="flex flex-1 flex-col bg-bg">{children}</main>
        </div>
      </ProtectedRouteBoundary>
    </ThemeProvider>
  );
}
