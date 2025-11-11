"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut, LayoutDashboard, Bot, FileStack, Presentation, Shield } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ai", label: "AI Copilot", icon: Bot },
  { href: "/filings", label: "Ingestion", icon: FileStack },
  { href: "/reports", label: "Reports", icon: Presentation },
  { href: "/admin", label: "Admin", icon: Shield }
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-white/10 bg-[rgb(var(--panel))] px-4 py-6 text-white backdrop-blur lg:flex">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
          <Image src="/brand.svg" width={28} height={28} alt="Farient logo" priority />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">Farient Deal</p>
          <p className="text-[0.55rem] font-medium uppercase tracking-[0.45em] text-white/60">Intelligence Platform</p>
        </div>
      </div>

      <nav className="mt-8 flex-1 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              prefetch={false}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-white/15 text-white shadow-inner"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-white/50">Session</p>
        <p className="mt-1 text-sm font-medium text-white">demo@farient.ai</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full justify-center gap-2 border-white/20 text-white hover:bg-white/10"
          onClick={() => router.push("/login")}
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
