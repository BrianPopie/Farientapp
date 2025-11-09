"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
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

type ChartPalette = {
  axis: string;
  grid: string;
  chart1: string;
  chart2: string;
  tooltipBg: string;
  tooltipText: string;
};

const defaultPalette: ChartPalette = {
  axis: "rgb(148 163 184)",
  grid: "rgba(255,255,255,0.06)",
  chart1: "rgb(56,189,248)",
  chart2: "rgb(34,197,94)",
  tooltipBg: "rgb(16,33,70)",
  tooltipText: "rgb(230,240,255)"
};

const withAlpha = (color: string, alpha: number) => {
  if (color.startsWith("rgba")) return color;
  if (color.startsWith("rgb")) {
    return color.replace("rgb", "rgba").replace(")", `,${alpha})`);
  }
  return color;
};

const readColor = (token: string, alpha = 1, fallback = defaultPalette.axis) => {
  if (typeof window === "undefined") return alpha === 1 ? fallback : withAlpha(fallback, alpha);
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  if (!raw) return alpha === 1 ? fallback : withAlpha(fallback, alpha);
  return alpha === 1 ? `rgb(${raw})` : `rgba(${raw},${alpha})`;
};

const getPalette = (): ChartPalette => ({
  axis: readColor("--muted-foreground", 1, defaultPalette.axis),
  grid: defaultPalette.grid,
  chart1: readColor("--chart-1", 1, defaultPalette.chart1),
  chart2: readColor("--chart-2", 1, defaultPalette.chart2),
  tooltipBg: readColor("--card", 1, defaultPalette.tooltipBg),
  tooltipText: readColor("--card-foreground", 1, defaultPalette.tooltipText)
});

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  const tsrPoint = payload[0];
  const compPoint = payload[1];
  return (
    <div className="rounded-2xl border border-border bg-card/95 px-4 py-3 text-sm shadow-lg">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      {tsrPoint && (
        <p className="text-chart-2">
          TSR: <span className="font-semibold">{Number(tsrPoint.value)}%</span>
        </p>
      )}
      {compPoint && (
        <p className="text-chart-1">
          CEO Pay: <span className="font-semibold">{formatUSD(Number(compPoint.value))}</span>
        </p>
      )}
    </div>
  );
};

export function TrendChart({ data, isVisible = true, heightClass = "h-[300px]", className }: TrendChartProps) {
  const { resolvedTheme } = useTheme();
  const [palette, setPalette] = useState<ChartPalette>(() => getPalette());

  useEffect(() => {
    setPalette(getPalette());
  }, [resolvedTheme]);

  return (
    <MeasuredChart isVisible={isVisible} heightClass={heightClass} className={className}>
      {({ width, height }) => (
        <LineChart width={width} height={height} data={data}>
          <CartesianGrid stroke={palette.grid} strokeDasharray="4 4" />
          <XAxis dataKey="year" tick={{ fill: palette.axis }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" tick={{ fill: palette.axis }} axisLine={false} tickLine={false} unit="%" />
          <YAxis
            orientation="right"
            yAxisId="right"
            tick={{ fill: palette.axis }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value / 1_000_000}M`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="tsrPct" stroke={palette.chart2} strokeWidth={3} dot={{ r: 5 }} name="TSR %" />
          <Line yAxisId="right" type="monotone" dataKey="compUSD" stroke={palette.chart1} strokeWidth={3} dot={{ r: 5 }} name="CEO Pay" />
        </LineChart>
      )}
    </MeasuredChart>
  );
}
