"use client";

import { TrendChart } from "@/components/TrendChart";
import type { TrendPoint } from "@/lib/types";

// Minimal client-only wrapper so Recharts never loads on the server.
export function TrendChartIsland({ data }: { data: TrendPoint[] }) {
  return <TrendChart data={data} />;
}
