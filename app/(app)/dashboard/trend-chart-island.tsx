"use client";

import { TrendChart } from "@/components/TrendChart";
import type { TrendPoint } from "@/lib/types";

export function TrendChartIsland({ data }: { data: TrendPoint[] }) {
  return <TrendChart data={data} />;
}
