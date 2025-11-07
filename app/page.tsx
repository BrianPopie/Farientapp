"use client";

import Link from "next/link";
import { ArrowRight, Database, FileStack, Gauge, ShieldCheck, Workflow, Presentation, Cog } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { TrendChart } from "@/components/TrendChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendPoint, Capability } from "@/lib/types";
import { DataBadge } from "@/components/DataBadge";

const heroTrend: TrendPoint[] = [
  { year: 2020, tsrPct: -3, compUSD: 8400000 },
  { year: 2021, tsrPct: 28, compUSD: 9800000 },
  { year: 2022, tsrPct: 12, compUSD: 10500000 },
  { year: 2023, tsrPct: 4, compUSD: 11200000 },
  { year: 2024, tsrPct: 18, compUSD: 13200000 }
];

const capabilityCards: Capability[] = [
  {
    id: "ingestion",
    name: "Data Ingestion & Structuring",
    icon: "FileStack",
    description: "Auto-fetch SEC & IR filings, normalize tables, and stamp citations per cell.",
    href: "/filings",
    metricLabel: "filings/day",
    metricValue: "240+"
  },
  {
    id: "lakehouse",
    name: "Semantic Lakehouse",
    icon: "Database",
    description: "Hybrid Postgres + pgvector with schema versioning per policy year.",
    href: "/lakehouse",
    metricLabel: "citations",
    metricValue: "3.1k"
  },
  {
    id: "analytics",
    name: "Benchmarking & Analytics",
    icon: "Gauge",
    description: "P4P, pay mix, and peer transparency in a single click.",
    href: "/analytics",
    metricLabel: "peer sets",
    metricValue: "86"
  },
  {
    id: "policy",
    name: "Policy Intelligence",
    icon: "ShieldCheck",
    description: "Map ISS / GL logic to live practices with risk deltas.",
    href: "/policy",
    metricLabel: "risk rules",
    metricValue: "120+"
  },
  {
    id: "agents",
    name: "Agentic Workflow",
    icon: "Workflow",
    description: "Gatherer→QA pipeline with duration + log capture.",
    href: "/agents",
    metricLabel: "avg cycle",
    metricValue: "4m 50s"
  },
  {
    id: "reports",
    name: "Automated Reporting",
    icon: "Presentation",
    description: "Slides + docs with click-through citations.",
    href: "/reports",
    metricLabel: "1-pagers",
    metricValue: "<3m"
  },
  {
    id: "admin",
    name: "Enterprise Integrations",
    icon: "Cog",
    description: "SSO, templates, and system health instrumentation.",
    href: "/admin",
    metricLabel: "connectors",
    metricValue: "12"
  }
];

const iconMap = {
  FileStack,
  Database,
  Gauge,
  ShieldCheck,
  Workflow,
  Presentation,
  Cog
};

export default function OverviewPage() {
  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] min-w-0">
        <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-white/10 to-transparent p-8">
          <DataBadge tone="info">Executive Compensation Intelligence</DataBadge>
          <h1 className="mt-4 text-4xl font-semibold leading-tight lg:text-5xl">
            10x faster comp & governance research with traceable AI.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground lg:max-w-2xl">
            Farient transforms DEF 14As, 10-K/Qs, and policy packs into structured insights so analysts can defend every metric in front
            of the board.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="gap-2">
              <Link href="/filings">
                Launch ingestion
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/reports">Preview board pack</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Filings normalized</p>
              <p className="text-2xl font-semibold">+1.2M rows</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average extraction accuracy</p>
              <p className="text-2xl font-semibold">98.4%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Analyst NPS</p>
              <p className="text-2xl font-semibold">+54</p>
            </div>
          </div>
        </div>
        <Card className="border-white/5 bg-white/5">
          <CardHeader>
            <CardTitle>TSR vs CEO Total Comp</CardTitle>
          </CardHeader>
          <CardContent className="min-w-0 min-h-0">
            <TrendChart data={heroTrend} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Cycle time" value="4m 12s" delta={{ label: "-63% vs manual", positive: true }} />
        <StatCard title="Traceable metrics" value="312" description="Active citations" icon={<Database className="h-5 w-5" />} />
        <StatCard title="Filings queued" value="28" description="Across 10 issuers" icon={<FileStack className="h-5 w-5" />} />
        <StatCard title="Board templates" value="7" description="Docs + slides" icon={<Presentation className="h-5 w-5" />} />
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Seven capabilities</h2>
          <p className="text-sm text-muted-foreground">Each card links to a routed mock</p>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {capabilityCards.map((capability) => {
            const Icon = iconMap[capability.icon as keyof typeof iconMap];
            return (
              <Link
                key={capability.id}
                href={capability.href}
                className="group rounded-3xl border border-white/5 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-primary shadow-inner">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{capability.metricLabel}</p>
                    <p className="text-xl font-semibold text-white">{capability.metricValue}</p>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{capability.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{capability.description}</p>
                <div className="mt-4 inline-flex items-center text-sm text-primary">
                  Explore
                  <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
