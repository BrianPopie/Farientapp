"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendChart } from "@/components/TrendChart";
import { StatCard } from "@/components/StatCard";
import { DataBadge } from "@/components/DataBadge";
import type { TrendPoint } from "@/lib/types";

const revenueTrend: TrendPoint[] = [
  { year: 2020, tsrPct: 4, compUSD: 7400000 },
  { year: 2021, tsrPct: 18, compUSD: 8600000 },
  { year: 2022, tsrPct: 11, compUSD: 9400000 },
  { year: 2023, tsrPct: 22, compUSD: 10100000 },
  { year: 2024, tsrPct: 24, compUSD: 12000000 }
];

const metricCards = [
  { title: "Benchmarks synced", value: "128", description: "Active peer sets", delta: "+6 this week" },
  { title: "Scenario runs", value: "42", description: "Multi-plan payouts", delta: "+18% vs avg" },
  { title: "Alerts closed", value: "31", description: "Cross-lake QA events", delta: "3 open" },
  { title: "Slides exported", value: "58", description: "Board-ready decks", delta: "+12 since Mon" }
];

const highlightRows = [
  { label: "Top uplift driver", value: "Revenue CAGR vs TSR mix" },
  { label: "Anomaly flagged", value: "Lakehouse load latency up 11%" },
  { label: "Pending approvals", value: "4 benchmarking adjustments" },
  { label: "AI summary", value: "Exec comp remains aligned with TSR" }
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <DataBadge tone="info">Analytics</DataBadge>
        <h1 className="text-2xl font-semibold text-foreground">Compensation analytics control room</h1>
        <p className="text-sm text-muted-foreground">
          Monitor benchmark adoption, surface anomalies, and prep board-ready outputs — all signals refresh every 15 minutes.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric) => (
          <StatCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            description={metric.description}
            delta={{ label: metric.delta, positive: true }}
          />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Revenue vs TSR overlay</CardTitle>
            <CardDescription>Dual-axis trend aligns revenue CAGR with TSR delta for tracked issuers.</CardDescription>
          </CardHeader>
          <CardContent className="min-w-0">
            <TrendChart data={revenueTrend} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Highlights</CardTitle>
            <CardDescription>Latest QA + benchmarking notes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {highlightRows.map((row) => (
              <div key={row.label} className="rounded-xl border border-border/80 bg-muted/40 p-3">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{row.label}</p>
                <p className="text-sm font-medium text-foreground">{row.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Workflow insights</CardTitle>
          <CardDescription>Recent analytics actions across the workspace.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {[
            { title: "Peer refresh", detail: "Updated S&P mid-cap peers with FY23 filings.", time: "12 min ago" },
            { title: "Policy delta", detail: "Detected GL variance on severance multipliers.", time: "28 min ago" },
            { title: "Scenario export", detail: "Delivered 3-option payout sensitivity deck.", time: "1 hr ago" },
            { title: "Alert resolved", detail: "Lakehouse vector drift normalized.", time: "2 hr ago" }
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border/70 bg-card/80 p-4">
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.detail}</p>
              <p className="text-xs text-muted-foreground/80">{item.time}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

