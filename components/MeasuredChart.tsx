"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useSize } from "@/hooks/useSize";

type MeasuredChartProps = {
  heightClass?: string;
  isVisible?: boolean;
  className?: string;
  children: (size: { width: number; height: number }) => React.ReactNode;
};

export function MeasuredChart({
  heightClass = "h-[300px]",
  isVisible = true,
  className,
  children
}: MeasuredChartProps) {
  const { ref, width, height, ready } = useSize<HTMLDivElement>();
  const containerClass = cn("relative w-full min-w-0 min-h-0", heightClass, className);

  if (!isVisible) {
    return <div className={containerClass} />;
  }

  const canRender = ready && width > 0 && height > 0;


  return (
    <div ref={ref} className={containerClass}>
      {canRender ? (
        children({ width, height })
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-3xl border border-white/10 bg-white/5">
          <div className="h-1/2 w-3/4 animate-pulse rounded-3xl bg-white/10" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
