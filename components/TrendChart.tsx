"use client";

import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import { TrendPoint } from "@/lib/types";
import { formatUSD } from "@/lib/utils";
import { MeasuredChart } from "@/components/MeasuredChart";
import { axisStyles, gridStyles, strokeWidth, getSeriesColor, getTooltipTheme } from "@/components/ui/chart-theme";

type TrendChartProps = {
  data: TrendPoint[];
  isVisible?: boolean;
  heightClass?: string;
  className?: string;
};

type TooltipDatum = {
  value: number;
  dataKey?: string;
  name?: string;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipDatum[];
  label?: string;
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  const tsrPoint = payload.find((point) => point.dataKey === "tsrPct");
  const compPoint = payload.find((point) => point.dataKey === "compUSD");
  const theme = getTooltipTheme();

  return (
    <div
      className="rounded-2xl border px-4 py-3 text-sm shadow-lg"
      style={{ background: theme.background, borderColor: theme.border, color: theme.color }}
    >
      <p className="text-[0.75rem] uppercase tracking-wide text-text-muted">{label}</p>
      {tsrPoint && (
        <p className="mt-1 text-text">
          TSR: <span className="font-semibold">{Number(tsrPoint.value)}%</span>
        </p>
      )}
      {compPoint && (
        <p className="text-text">
          CEO Pay: <span className="font-semibold">{formatUSD(Number(compPoint.value))}</span>
        </p>
      )}
    </div>
  );
};

type LegendEntry = {
  value?: string | number;
  color?: string;
};

type LegendContentProps = {
  payload?: LegendEntry[];
};

const LegendContent = ({ payload = [] }: LegendContentProps) => {
  if (!payload.length) return null;

  return (
    <ul className="mt-3 flex flex-wrap gap-3" role="list">
      {payload.map((entry, index) => (
        <li key={`${entry?.value ?? index}`}>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-semibold text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--bg))]"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry?.color ?? getSeriesColor(0) }}
              aria-hidden="true"
            />
            {entry?.value ?? `Series ${index + 1}`}
          </button>
        </li>
      ))}
    </ul>
  );
};

export function TrendChart({ data, isVisible = true, heightClass = "h-[320px]", className }: TrendChartProps) {
  const chartData = useMemo(() => data ?? [], [data]);
  const emptyState = chartData.length === 0;

  return (
    <MeasuredChart isVisible={isVisible} heightClass={heightClass} className={className}>
      {({ width, height }) =>
        emptyState ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-border bg-surface">
            <p className="chart-empty">No data available</p>
          </div>
        ) : (
          <ResponsiveContainer width={width} height={height}>
            <LineChart data={chartData} aria-label="Trend chart showing TSR versus CEO compensation">
              <CartesianGrid {...gridStyles} />
              <XAxis dataKey="year" tick={axisStyles.tick} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={axisStyles.tick} axisLine={false} tickLine={false} unit="%" />
              <YAxis
                orientation="right"
                yAxisId="right"
                tick={axisStyles.tick}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value / 1_000_000}M`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "hsla(var(--text-muted) / 0.2)" }} />
              <Legend content={<LegendContent />} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="tsrPct"
                name="TSR %"
                stroke={getSeriesColor(0)}
                strokeWidth={strokeWidth}
                activeDot={{ r: 5 }}
                dot={{ r: 4, strokeWidth: 1.5, stroke: "hsl(var(--bg))" }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="compUSD"
                name="CEO Pay"
                stroke={getSeriesColor(1)}
                strokeWidth={strokeWidth}
                activeDot={{ r: 5 }}
                dot={{ r: 4, strokeWidth: 1.5, stroke: "hsl(var(--bg))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )
      }
    </MeasuredChart>
  );
}
