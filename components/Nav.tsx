"use client";

import Image from "next/image";
import { Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ContrastToggle } from "@/components/ContrastToggle";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/SearchInput";
import { cn } from "@/lib/utils";

export function Nav() {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-[rgba(var(--bg),0.85)] backdrop-blur-xl transition-[padding]",
        "px-3 py-2"
      )}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Image src="/brand.svg" alt="Farient" width={32} height={32} className="rounded-lg" />
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.35em] text-text-muted">Farient Deal Intelligence</p>
            <p className="text-lg font-semibold text-text">Farient Dashboard</p>
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
              className="rounded-full border border-border bg-surface text-text-muted hover:text-text"
              type="button"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <ContrastToggle />
            <ThemeToggle />
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-semibold text-text">
              BT
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
