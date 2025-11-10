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
  tick: { fontSize: 13, fill: "hsl(var(--text-muted))" },
  axisLine: { stroke: "hsla(var(--text-muted) / 0.35)", strokeOpacity: 0.35 },
  tickLine: { stroke: "hsla(var(--text-muted) / 0.25)", strokeOpacity: 0.25 }
};

export const gridStyles = {
  stroke: "hsla(var(--text-muted) / 0.22)",
  strokeOpacity: 0.15,
  strokeDasharray: "3 3"
};

export function getSeriesColor(index: number) {
  return PALETTE[index % PALETTE.length];
}

export function getTooltipTheme() {
  return {
    background: "hsla(var(--surface) / 0.95)",
    border: "1px solid hsla(var(--border) / 0.8)",
    color: "hsl(var(--text))"
  };
}
