"use client";

import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-[rgb(var(--panel))] px-6 text-text backdrop-blur dark:border-white/10">
      <div className="flex items-center gap-3">
        <Image src="/brand.svg" alt="Farient icon" width={28} height={28} className="rounded-xl" priority />
        <div>
          <p className="text-sm font-semibold text-text dark:text-white">Farient Workspace</p>
          <p className="text-[11px] uppercase tracking-[0.35em] text-text/60 dark:text-white/50">Deal Intelligence</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-sm font-semibold text-text dark:border-white/10 dark:bg-white/5 dark:text-white">
          BT
        </div>
      </div>
    </header>
  );
}
