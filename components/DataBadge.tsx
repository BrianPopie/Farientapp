"use client";

import { cn } from "@/lib/utils";

const toneMap: Record<string, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-primary",
  neutral: "text-muted-foreground"
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
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide bg-muted text-muted-foreground ring-1 ring-border",
        toneMap[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
