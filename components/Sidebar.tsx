"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FileStack, Presentation, Cog, Home, MessageSquare } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Overview", icon: Home },
  { href: "/filings", label: "Ingestion", icon: FileStack },
  { href: "/chatbot", label: "AI Chatbot", icon: MessageSquare },
  { href: "/reports", label: "Reports", icon: Presentation },
  { href: "/admin", label: "Admin", icon: Cog }
];

interface SidebarProps {
  authed: boolean;
  onSignOut?: () => void;
}

export function Sidebar({ authed, onSignOut }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden min-h-screen w-[240px] flex-col border-r border-border bg-background/90 p-4 text-foreground shadow-[0_25px_80px_rgba(0,0,0,0.65)] backdrop-blur-sm lg:flex z-20">
      <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 px-3 py-2">
        <Image src="/brand.svg" width={32} height={32} alt="Farient" className="rounded-lg" />
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Workspace</p>
          <p className="text-sm font-semibold text-foreground">Farient Deal Intelligence</p>
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
                "w-full rounded-full px-3 py-2 text-sm font-medium transition data-[active=true]:bg-card data-[active=true]:text-foreground data-[active=true]:shadow-inner hover:bg-muted/70 hover:text-foreground",
                active ? "text-foreground" : "text-muted-foreground"
              )}
              data-active={active || undefined}
            >
              <span className="inline-flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {authed && (
        <div className="mt-6 rounded-xl border border-border/70 bg-card/60 p-3 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Session</p>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">demo@farient.ai</p>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary hover:bg-primary/20"
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
