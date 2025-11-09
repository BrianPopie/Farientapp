import type { ReactNode } from "react";

export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex justify-center px-8 py-10">
      <div className="dashboard-grid w-full max-w-[1500px] space-y-10">{children}</div>
    </main>
  );
}