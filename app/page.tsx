"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Database, FileStack, Presentation } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { TrendChart } from "@/components/TrendChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendPoint } from "@/lib/types";
import { DataBadge } from "@/components/DataBadge";
import { fakeAuth } from "@/lib/fakeAuth";

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


export default function OverviewPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const ok = fakeAuth.isAuthed();
    if (!ok) {
      router.replace("/login");
    }
    setAuthed(ok);
  }, [router]);

  if (!authed) {
    return null;
  }

  return (
    <main className="flex justify-center px-8 py-10">
      <div className="dashboard-grid w-full max-w-[1500px] space-y-10">
        <section className="grid gap-8 xl:grid-cols-[2fr_1.2fr]">
          <div className="rounded-2xl bg-card ring-1 ring-border p-8 card-glow shadow-xl">
            <DataBadge tone="info">Executive Compensation Intelligence</DataBadge>
            <h1 className="mt-4 text-2xl font-semibold leading-tight text-foreground xl:text-3xl">Deal Intelligence Dashboard</h1>
            <p className="mt-3 text-base text-muted-foreground xl:text-lg">
              Farient transforms DEF 14As, 10-K/Qs, and policy packs into structured insights so analysts can defend every metric in front
              of the board.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="gap-2 text-sm xl:text-base">
                <Link href="/filings">
                  Launch ingestion
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" asChild className="text-sm text-muted-foreground hover:text-foreground xl:text-base">
                <Link href="/reports">Preview board pack</Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {[
                { label: "Filings normalized", value: "+1.2M rows" },
                { label: "Extraction accuracy", value: "98.4%" },
                { label: "Analyst NPS", value: "+54" }
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border/70 bg-muted/40 p-4 text-center">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="rounded-2xl bg-card ring-1 ring-border card-glow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold xl:text-xl">TSR vs CEO Total Comp</CardTitle>
            </CardHeader>
            <CardContent className="min-w-0 min-h-0">
              <TrendChart data={heroTrend} />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Cycle time" value="4m 12s" description="Avg workflow" delta={{ label: "-63% vs manual", positive: true }} />
          <StatCard title="Traceable metrics" value="312" description="Active citations" icon={<Database className="h-5 w-5" />} />
          <StatCard title="Filings queued" value="28" description="Across 10 issuers" icon={<FileStack className="h-5 w-5" />} />
          <StatCard title="Board templates" value="7" description="Docs + slides" icon={<Presentation className="h-5 w-5" />} />
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {insightCards.map((insight) => (
            <div key={insight.title} className="rounded-2xl bg-card ring-1 ring-border p-6 card-glow">
              <p className="text-lg font-medium text-foreground">{insight.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{insight.detail}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
