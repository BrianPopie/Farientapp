"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { TrendPoint } from "@/lib/types";
import { formatUSD } from "@/lib/utils";
import { MeasuredChart } from "@/components/MeasuredChart";

type TrendChartProps = {
  data: TrendPoint[];
  isVisible?: boolean;
  heightClass?: string;
  className?: string;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  const tsrPoint = payload[0];
  const compPoint = payload[1];
  return (
    <div className="rounded-2xl border border-white/10 bg-black/80 px-4 py-3 text-sm">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      {tsrPoint && (
        <p className="text-emerald-200">
          TSR: <span className="font-semibold">{Number(tsrPoint.value)}%</span>
        </p>
      )}
      {compPoint && (
        <p className="text-sky-200">
          CEO Pay: <span className="font-semibold">{formatUSD(Number(compPoint.value))}</span>
        </p>
      )}
    </div>
  );
};

export function TrendChart({ data, isVisible = true, heightClass = "h-[300px]", className }: TrendChartProps) {
  return (
    <MeasuredChart isVisible={isVisible} heightClass={heightClass} className={className}>
      {({ width, height }) => (
        <LineChart width={width} height={height} data={data}>
          <CartesianGrid stroke="rgba(148,163,184,0.2)" strokeDasharray="4 4" />
          <XAxis dataKey="year" tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
          <YAxis
            orientation="right"
            yAxisId="right"
            tick={{ fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value / 1_000_000}M`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="tsrPct" stroke="#34d399" strokeWidth={3} dot={{ r: 5 }} name="TSR %" />
          <Line yAxisId="right" type="monotone" dataKey="compUSD" stroke="#60a5fa" strokeWidth={3} dot={{ r: 5 }} name="CEO Pay" />
        </LineChart>
      )}
    </MeasuredChart>
  );
}
