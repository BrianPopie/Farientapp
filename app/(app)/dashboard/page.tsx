"use client";

import Link from "next/link";
import { ArrowRight, Database, FileStack, Presentation } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { TrendChart } from "@/components/TrendChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendPoint } from "@/lib/types";
import { DataBadge } from "@/components/DataBadge";
import { PageHeading, BodyText, SectionHeading } from "@/components/ui/typography";

const heroTrend: TrendPoint[] = [
  { year: 2020, tsrPct: -3, compUSD: 8400000 },
  { year: 2021, tsrPct: 28, compUSD: 9800000 },
  { year: 2022, tsrPct: 12, compUSD: 10500000 },
  { year: 2023, tsrPct: 4, compUSD: 11200000 },
  { year: 2024, tsrPct: 18, compUSD: 13200000 }
];

const insightCards = [
  { title: "Filings pipeline", detail: "28 issuers queued with SLA < 30 mins." },
  { title: "Alert feed", detail: "3 policy deltas require reviewer sign-off." },
  { title: "Board prep", detail: "Docs + slides synced for 7 templates." }
];

export default function DashboardPage() {
  return (
    <>
      <section className="grid gap-8 xl:grid-cols-[2fr_1.2fr] text-text">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          <DataBadge tone="info">Executive Compensation Intelligence</DataBadge>
          <PageHeading className="mt-4 text-text">Deal Intelligence Dashboard</PageHeading>
          <BodyText muted className="mt-3 text-base xl:text-lg">
            Farient transforms DEF 14As, 10-K/Qs, and policy packs into structured insights so analysts can defend every metric in front
            of the board.
          </BodyText>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="gap-2 text-base">
              <Link href="/filings">
                Launch ingestion
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" asChild className="text-base text-text-muted hover:text-text">
              <Link href="/reports">Preview board pack</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {[
              { label: "Filings normalized", value: "+1.2M rows" },
              { label: "Extraction accuracy", value: "98.4%" },
              { label: "Analyst NPS", value: "+54" }
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                <p className="text-xs uppercase tracking-wide text-text-muted">{item.label}</p>
                <p className="text-2xl font-semibold text-text">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="rounded-2xl border border-border bg-surface shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-text">TSR vs CEO Total Comp</CardTitle>
          </CardHeader>
          <CardContent className="min-w-0 min-h-0">
            <TrendChart data={heroTrend} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 text-text">
        <StatCard title="Cycle time" value="4m 12s" description="Avg workflow" delta={{ label: "-63% vs manual", positive: true }} />
        <StatCard title="Traceable metrics" value="312" description="Active citations" icon={<Database className="h-5 w-5" />} />
        <StatCard title="Filings queued" value="28" description="Across 10 issuers" icon={<FileStack className="h-5 w-5" />} />
        <StatCard title="Board templates" value="7" description="Docs + slides" icon={<Presentation className="h-5 w-5" />} />
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 text-text">
        {insightCards.map((insight) => (
          <div key={insight.title} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <SectionHeading as="p" className="text-lg font-medium text-text">
              {insight.title}
            </SectionHeading>
            <BodyText muted className="mt-2 text-sm">
              {insight.detail}
            </BodyText>
          </div>
        ))}
      </section>
    </>
  );
}
