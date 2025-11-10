import type { ReactNode } from "react";
import { Suspense } from "react";
import { ProtectedRouteBoundary } from "@/components/ProtectedRouteBoundary";
import { AppChrome } from "@/components/AppChrome";

export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRouteBoundary>
      <Suspense fallback={null}>
        <AppChrome>
          <main className="flex justify-center px-8 py-10">
            <div className="dashboard-grid w-full max-w-[1500px] space-y-10">{children}</div>
          </main>
        </AppChrome>
      </Suspense>
    </ProtectedRouteBoundary>
  );
}
