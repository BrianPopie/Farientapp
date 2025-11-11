"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut, LayoutDashboard, Bot, FileStack, Presentation, Shield } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "text-sky-500" },
  { href: "/filings", label: "Ingestion", icon: FileStack, color: "text-emerald-500" },
  { href: "/ai", label: "AI Copilot", icon: Bot, color: "text-indigo-500" },
  { href: "/reports", label: "Reports", icon: Presentation, color: "text-amber-500" },
  { href: "/admin", label: "Admin", icon: Shield, color: "text-rose-500" }
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-border/70 bg-card px-4 py-6 text-foreground backdrop-blur-lg lg:flex">
      <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card shadow-elev-1 px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
          <Image src="/brand.svg" width={28} height={28} alt="Farient logo" priority />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            Farient Deal
          </p>
          <p className="text-[0.55rem] font-medium uppercase tracking-[0.45em] text-muted-foreground">
            Intelligence Platform
          </p>
        </div>
      </div>

      <nav className="mt-8 flex-1 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon, color }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              prefetch={false}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors focus-ring",
                active
                  ? "bg-primary/10 text-foreground shadow-inner ring-1 ring-border/40"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition",
                  active ? color : "text-muted-foreground"
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground shadow-elev-0">
        <p className="text-[0.65rem] uppercase tracking-[0.35em]">Session</p>
        <p className="mt-1 text-sm font-medium text-foreground">demo@farient.ai</p>
        <Button
          variant="outline"
          size="sm"
          className="focus-ring mt-3 w-full justify-center gap-2"
          onClick={() => router.push("/login")}
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
