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
              <stop offset="5%" stopColor="#ffd369" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#ffd369" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="year" stroke="rgba(255,255,255,0.4)" />
          <YAxis stroke="rgba(255,255,255,0.4)" />
          <Tooltip contentStyle={{ background: "rgba(12,14,20,0.8)", border: "1px solid rgba(255,255,255,0.1)" }} />
          <Area type="monotone" dataKey="tsr" stroke="#ffd369" fillOpacity={1} fill="url(#tsr)" />
          <Line type="monotone" dataKey="comp" stroke="#5d5fe5" strokeWidth={2} dot={{ r: 3 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
