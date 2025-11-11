"use client";

import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/70 bg-background/80 px-6 text-foreground backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Image src="/brand.svg" alt="Farient icon" width={28} height={28} className="rounded-xl" priority />
        <div>
          <p className="text-sm font-semibold text-foreground">Farient Workspace</p>
          <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">Deal Intelligence</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-sm font-semibold text-card-foreground">
          BT
        </div>
      </div>
    </header>
  );
}
