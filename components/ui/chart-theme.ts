"use client";

export const PALETTE = [
  "#0072B2",
  "#E69F00",
  "#009E73",
  "#CC79A7",
  "#D55E00",
  "#56B4E9",
  "#F0E442",
  "#000000"
] as const;

export const strokeWidth = 2.5;

export const axisStyles = {
  tick: { fontSize: 13, fill: "rgb(var(--text-muted))" },
  axisLine: { stroke: "rgba(var(--text-muted),0.35)", strokeOpacity: 0.35 },
  tickLine: { stroke: "rgba(var(--text-muted),0.25)", strokeOpacity: 0.25 }
};

export const gridStyles = {
  stroke: "rgba(var(--text-muted),0.22)",
  strokeOpacity: 0.15,
  strokeDasharray: "3 3"
};

export function getSeriesColor(index: number) {
  return PALETTE[index % PALETTE.length];
}

export function getTooltipTheme() {
  return {
    background: "rgba(var(--surface),0.95)",
    border: "1px solid rgba(var(--border),0.8)",
    color: "rgb(var(--text))"
  };
}

