"use client";

import Image from "next/image";
import { Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/SearchInput";
import { cn } from "@/lib/utils";

export function Nav() {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border backdrop-blur-md transition-[padding]",
        "bg-background/70 px-3 py-2"
      )}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Image src="/brand.svg" alt="Farient" width={32} height={32} className="rounded-lg" />
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Deal Intelligence</p>
            <p className="text-base font-semibold text-foreground">Farient Dashboard</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
          <div className="w-full max-w-xl">
            <SearchInput />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
              type="button"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <ThemeToggle />
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
              BT
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
