"use client";

import dynamic from "next/dynamic";
import type { HTMLAttributes } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const Chart = dynamic(() => Promise.resolve(TsrMiniInner), {
  ssr: false,
  loading: () => <div className="h-48 w-full animate-pulse rounded-2xl bg-white/5" />
});

type Props = HTMLAttributes<HTMLDivElement>;

export function TsrMini(props: Props) {
  return <Chart {...props} />;
}

const data = [
  { year: "2019", tsr: 12, comp: 6 },
  { year: "2020", tsr: -5, comp: 4 },
  { year: "2021", tsr: 18, comp: 9 },
  { year: "2022", tsr: 9, comp: 10 },
  { year: "2023", tsr: 22, comp: 13 },
  { year: "2024", tsr: 26, comp: 14 }
];

function TsrMiniInner(props: Props) {
  return (
    <div {...props}>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 20, right: 20, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="tsr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgb(var(--chart-2))" stopOpacity={0.45} />
              <stop offset="95%" stopColor="rgb(var(--chart-2))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border) / 0.45)" />
          <XAxis dataKey="year" stroke="rgb(var(--muted-foreground) / 0.8)" />
          <YAxis stroke="rgb(var(--muted-foreground) / 0.8)" />
          <Tooltip
            contentStyle={{
              background: "rgba(8,10,18,0.85)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "0.75rem",
              color: "rgb(var(--card-foreground))"
            }}
          />
          <Area type="monotone" dataKey="tsr" stroke="rgb(var(--chart-2))" fillOpacity={1} fill="url(#tsr)" />
          <Line
            type="monotone"
            dataKey="comp"
            stroke="rgb(var(--chart-1))"
            strokeWidth={2}
            dot={{ r: 3, stroke: "rgb(var(--chart-1))", fill: "rgb(var(--chart-1))" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
