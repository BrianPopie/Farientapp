"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type GlassCardProps = {
  className?: string;
  children: ReactNode;
};

export function GlassCard({ className, children }: GlassCardProps) {
  return (
    <Card
      className={cn(
        "rounded-2xl border border-white/10 bg-[rgb(var(--panel))] text-white shadow-[var(--soft-shadow)] backdrop-blur",
        "bg-[radial-gradient(120%_120%_at_50%_0%,rgba(255,255,255,.06),rgba(0,0,0,0))] transition-transform duration-200",
        "hover:-translate-y-0.5 hover:shadow-2xl",
        className
      )}
    >
      {children}
    </Card>
  );
}
