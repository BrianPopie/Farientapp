"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FileStack, Presentation, Home, MessageSquare } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/filings", label: "Ingestion", icon: FileStack },
  { href: "/chatbot", label: "AI Chatbot", icon: MessageSquare },
  { href: "/reports", label: "Reports", icon: Presentation }
];

interface SidebarProps {
  authed: boolean;
  onSignOut?: () => void;
}

export function Sidebar({ authed, onSignOut }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[240px] flex-col overflow-y-auto border-r border-border bg-[hsla(var(--bg)/0.9)] p-4 text-text shadow-[0_25px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:flex z-20">
      <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface/60 px-3 py-2">
        <Image src="/brand.svg" width={32} height={32} alt="Farient" className="rounded-lg" />
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.32em] text-text-muted">Workspace</p>
          <p className="text-sm font-semibold text-text">Farient Deal Intelligence</p>
        </div>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "w-full rounded-full px-3 py-2 text-sm font-medium transition data-[active=true]:bg-surface data-[active=true]:text-text data-[active=true]:shadow-inner hover:bg-muted/70 hover:text-text",
                active ? "text-text" : "text-text-muted"
              )}
              data-active={active || undefined}
            >
              <span className="inline-flex items-center gap-2">
                <Icon className="h-4 w-4 text-accent" />
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {authed && (
        <div className="mt-6 rounded-xl border border-border/70 bg-surface/70 p-3 text-xs text-text-muted">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-text">Session</p>
              <p className="text-[11px] uppercase tracking-wide text-text-muted">demo@farient.ai</p>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="rounded-full bg-accent/10 px-3 py-1 text-[11px] font-semibold text-accent hover:bg-accent/20"
              onClick={onSignOut}
            >
              Sign out
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
}
