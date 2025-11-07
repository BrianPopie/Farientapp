"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Database, FileStack, Gauge, ShieldAlert, Workflow, Presentation, Cog, Home } from "lucide-react";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Overview", icon: Home },
  { href: "/filings", label: "Ingestion", icon: FileStack },
  { href: "/lakehouse", label: "Lakehouse", icon: Database },
  { href: "/analytics", label: "Analytics", icon: Gauge },
  { href: "/policy", label: "Policy", icon: ShieldAlert },
  { href: "/agents", label: "Agents", icon: Workflow },
  { href: "/reports", label: "Reports", icon: Presentation },
  { href: "/admin", label: "Admin", icon: Cog }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-72 flex-col border-r border-white/5 bg-background/90 p-6 lg:flex">
      <div className="flex items-center gap-3">
        <Image src="/brand.svg" width={40} height={40} alt="Farient" />
        <div>
          <p className="text-xl font-semibold">Farient</p>
          <p className="text-sm text-muted-foreground">Exec Comp Intelligence</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 rounded-2xl px-4 py-3 text-base font-semibold transition hover:bg-white/5",
                active ? "bg-white/10 text-white" : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_15px_rgba(76,221,255,0.4)] transition",
                  active ? "text-primary shadow-[0_0_20px_rgba(76,221,255,0.7)]" : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
