"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis } from "recharts";
import type { RiskProfile } from "@/lib/types";
import { MeasuredChart } from "@/components/MeasuredChart";
import { strokeWidth, getSeriesColor } from "@/components/ui/chart-theme";

type RadarRiskProps = {
  data: RiskProfile[];
  isVisible?: boolean;
  heightClass?: string;
  className?: string;
};

export function RadarRisk({ data, isVisible = true, heightClass = "h-[320px]", className }: RadarRiskProps) {
  const empty = !data?.length;

  return (
    <MeasuredChart isVisible={isVisible} heightClass={heightClass} className={className}>
      {({ width, height }) =>
        empty ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-border bg-surface">
            <p className="chart-empty">Risk data unavailable</p>
          </div>
        ) : (
          <RadarChart data={data} width={width} height={height} outerRadius="80%" aria-label="Risk profile radar chart">
            <PolarGrid stroke="hsla(var(--text-muted) / 0.2)" />
            <PolarAngleAxis dataKey="axis" tick={{ fill: "hsl(var(--text-muted))", fontSize: 12 }} />
            <Radar
              dataKey="value"
              stroke={getSeriesColor(2)}
              fill={`${getSeriesColor(2)}33`}
              fillOpacity={0.45}
              strokeWidth={strokeWidth}
            />
          </RadarChart>
        )
      }
    </MeasuredChart>
  );
}
