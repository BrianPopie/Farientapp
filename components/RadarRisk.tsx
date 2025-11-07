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
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="axis" tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <Radar dataKey="value" stroke="#4cddff" fill="#4cddff" fillOpacity={0.25} dot={{ r: 3, fill: "#4cddff" }} />
        </RadarChart>
      )}
    </MeasuredChart>
  );
}
