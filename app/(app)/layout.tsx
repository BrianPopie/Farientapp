import type { ReactNode } from "react";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import ProtectedRouteBoundary from "@/components/ProtectedRouteBoundary";
import { AppChrome } from "@/components/AppChrome";
import { RenderProbe } from "@/components/RenderProbe";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ProtectedRouteBoundary>
        <AppChrome>
          <Suspense fallback={null}>
            <main className="flex justify-center px-8 py-10">
              <div className="dashboard-grid w-full max-w-[1500px] space-y-10">{children}</div>
            </main>
          </Suspense>
        </AppChrome>
      </ProtectedRouteBoundary>
      <RenderProbe label="app/(app)/layout" />
    </ThemeProvider>
  );
}
