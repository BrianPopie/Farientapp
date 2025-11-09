"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis } from "recharts";
import type { RiskProfile } from "@/lib/types";
import { MeasuredChart } from "@/components/MeasuredChart";

type RadarRiskProps = {
  data: RiskProfile[];
  isVisible?: boolean;
  heightClass?: string;
  className?: string;
};

export function RadarRisk({ data, isVisible = true, heightClass = "h-[320px]", className }: RadarRiskProps) {
  return (
    <MeasuredChart isVisible={isVisible} heightClass={heightClass} className={className}>
      {({ width, height }) => (
        <RadarChart data={data} width={width} height={height} outerRadius="80%">
          <PolarGrid stroke="rgba(255,255,255,0.06)" />
          <PolarAngleAxis dataKey="axis" tick={{ fill: "rgb(var(--muted-foreground))", fontSize: 12 }} />
          <Radar
            dataKey="value"
            stroke="rgb(var(--chart-1))"
            fill="rgba(var(--chart-1),0.25)"
            dot={{ r: 3, fill: "rgb(var(--chart-1))" }}
          />
        </RadarChart>
      )}
    </MeasuredChart>
  );
}
