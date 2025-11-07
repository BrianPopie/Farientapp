"use client";

import Image from "next/image";
import { Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/SearchInput";

export function Nav() {
  return (
    <header className="sticky top-0 z-30 flex flex-col gap-4 border-b border-white/5 bg-background/70 px-6 py-4 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <div className="flex items-center gap-2">
          <Image src="/brand.svg" alt="Farient" width={36} height={36} />
          <div>
            <p className="text-base font-semibold">Farient</p>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Executive Intelligence</p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-2xl border border-white/10" type="button">
            <Bell className="h-4 w-4" />
          </Button>
          <ThemeToggle />
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/80 to-secondary/70 text-sm font-semibold">
            BT
          </div>
        </div>
      </div>
    </header>
  );
}
