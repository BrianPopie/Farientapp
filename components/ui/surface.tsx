"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  level?: 0 | 1 | 2 | 3;
};

export function Surface({ level = 1, className, ...props }: SurfaceProps) {
  const elevClass =
    level === 0 ? "shadow-elev-0" : level === 1 ? "shadow-elev-1" : level === 2 ? "shadow-elev-2" : "shadow-elev-3";
  return (
    <div
      className={cn("rounded-xl border border-border bg-card text-card-foreground", elevClass, className)}
      {...props}
    />
  );
}
