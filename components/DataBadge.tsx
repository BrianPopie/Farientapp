"use client";

import { cn } from "@/lib/utils";

const toneMap: Record<string, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-accent",
  neutral: "text-text-muted"
};

export type DataBadgeProps = {
  tone?: keyof typeof toneMap;
  children: React.ReactNode;
  className?: string;
};

export function DataBadge({ tone = "neutral", children, className }: DataBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-text-muted",
        toneMap[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
