"use client";

import { cn } from "@/lib/utils";

const toneMap: Record<string, string> = {
  success: "bg-emerald-500/15 text-emerald-200",
  warning: "bg-amber-500/15 text-amber-200",
  danger: "bg-rose-500/15 text-rose-200",
  info: "bg-sky-500/15 text-sky-200",
  neutral: "bg-white/10 text-foreground"
};

export type DataBadgeProps = {
  tone?: keyof typeof toneMap;
  children: React.ReactNode;
  className?: string;
};

export function DataBadge({ tone = "neutral", children, className }: DataBadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", toneMap[tone], className)}>
      {children}
    </span>
  );
}
