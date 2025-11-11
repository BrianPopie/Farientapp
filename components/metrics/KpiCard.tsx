"use client";

import type { ReactNode } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

type Intent = "good" | "warn" | "base";

type KpiCardProps = {
  label: string;
  value: string;
  delta?: string;
  icon?: ReactNode;
  intent?: Intent;
  className?: string;
};

const intentMap: Record<Intent, string> = {
  good: "text-emerald-600 dark:text-emerald-300",
  warn: "text-amber-600 dark:text-amber-300",
  base: "text-text/70 dark:text-white/70"
};

export function KpiCard({ label, value, delta, icon, intent = "base", className }: KpiCardProps) {
  return (
    <GlassCard className={cn("min-h-[160px] p-5 text-sm", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-text/60 dark:text-white/50">{label}</p>
        {icon}
      </div>
      <div className="mt-2 text-2xl font-semibold text-text dark:text-white">{value}</div>
      {delta ? <p className={cn("mt-1 text-xs", intentMap[intent])}>{delta}</p> : null}
    </GlassCard>
  );
}
