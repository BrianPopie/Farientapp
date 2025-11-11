"use client";

import Image from "next/image";

export function NavBar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-[rgb(var(--card))]/85 px-5 backdrop-blur">
      <div className="flex items-center gap-3">
        <Image src="/brand.svg" alt="Farient mark" width={28} height={28} className="rounded-xl" priority />
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Farient Workspace</p>
          <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Deal Intelligence</p>
        </div>
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-300">Role-aware Copilot · Compensation Builder</div>
    </header>
  );
}
