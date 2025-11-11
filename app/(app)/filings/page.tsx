"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { FileCard } from "@/components/FileCard";
import { Stepper } from "@/components/Stepper";
import { DataTable } from "@/components/Table";
import { CitationChip } from "@/components/CitationChip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import citations from "@/data/citations.json";
import { Badge } from "@/components/ui/badge";
import type { Citation, UploadedFiling } from "@/lib/types";
import { AiInsightPanel } from "@/components/AiInsightPanel";
import { PageHeading, BodyText } from "@/components/ui/typography";

const UploadDropzone = dynamic(() => import("@/components/UploadDropzone").then((mod) => mod.UploadDropzone), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border/60 bg-muted/50 text-xs text-text-muted">
      Preparing uploader…
    </div>
  )
});

type FileCardData = React.ComponentProps<typeof FileCard>;
type FileCardListItem = FileCardData & { viewKey: string };

const files: FileCardData[] = [
  {
    title: "Aurelius Corp Proxy",
    source: "EDGAR" as const,
    filing: "DEF 14A" as const,
    year: 2024,
    status: "indexed" as const,
    citationCount: 38
  },
  {
    title: "Borealis Form 8-K",
    source: "EDGAR" as const,
    filing: "8-K" as const,
    year: 2024,
    status: "extracted" as const,
    citationCount: 12
  },
  {
    title: "Aurelius Form 4 batch",
    source: "IR" as const,
    filing: "Form 4" as const,
    year: 2025,
    status: "parsing" as const,
    citationCount: 0
  }
];

const stepperData = [
  { id: "gather", label: "Gather", status: "complete" as const, duration: "45s" },
  { id: "tables", label: "Extract tables", status: "complete" as const, duration: "1m 32s" },
  { id: "narrative", label: "Extract narrative", status: "current" as const, duration: "48s" },
  { id: "validate", label: "Validate", status: "upcoming" as const },
  { id: "index", label: "Index", status: "upcoming" as const }
];

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const summaryCompTable = [
  { exec: "Maya Torres (CEO)", salary: 1_100_000, bonus: 1_900_000, equity: 10_200_000 },
  { exec: "Evan Burke (CFO)", salary: 650_000, bonus: 840_000, equity: 3_200_000 },
  { exec: "Priya Shah (CHRO)", salary: 520_000, bonus: 610_000, equity: 2_000_000 }
];

const formatMixPill = (row: (typeof summaryCompTable)[number]) => {
  const total = row.salary + row.bonus + row.equity || 1;
  const salaryPct = Math.round((row.salary / total) * 100);
  const bonusPct = Math.round((row.bonus / total) * 100);
  const equityPct = Math.max(0, 100 - salaryPct - bonusPct);
  return `${salaryPct}% / ${bonusPct}% / ${equityPct}%`;
};

const grantsTable = [
  { grant: "PSU - AI Momentum", type: "PSU", value: "$6,800,000", metric: "TSR vs SaaS peers" },
  { grant: "Option refresh", type: "StockOption", value: "$2,200,000", metric: "Revenue CAGR 18%" },
  { grant: "ESG retention", type: "RSU", value: "$1,400,000", metric: "Scope 3 milestones" }
];

const pvpTable = [
  { year: 2022, ceoPay: "$10.5M", compPeerPct: "48th", tsr: "+12%" },
  { year: 2023, ceoPay: "$11.2M", compPeerPct: "52nd", tsr: "+4%" },
  { year: 2024, ceoPay: "$13.2M", compPeerPct: "55th", tsr: "+18%" }
];

const entityNormalization = {
  tickers: [
    { label: "AUR", status: "resolved" },
    { label: "BOR", status: "resolved" },
    { label: "BRX", status: "ambiguous" }
  ],
  executives: [
    { label: "M. Torres", status: "resolved" },
    { label: "Jonas Kline", status: "resolved" },
    { label: "E. Burke Jr.", status: "needs review" }
  ],
  grants: [
    { label: "AI Momentum PSU", status: "resolved" },
    { label: "Retention RSU (8-K)", status: "needs review" }
  ]
};

const ingestionSystemPrompt = `You are a filings ingestion copilot for Farient. Provide succinct updates about the mock pipeline, including
the Gather->Index stepper, entity normalization statuses, and the confidence/queue metrics (accuracy 98.4%, OCR fallback on 1 filing, 28 issuers queued).
When asked, mention citations or filings by name and recommend the next best action for analysts. Keep responses under 120 words.`;

export default function FilingsPage() {
  const [uploads, setUploads] = React.useState<UploadedFiling[]>([]);

  const handleUploaded = (file: UploadedFiling) => {
    setUploads((prev) => [file, ...prev]);
  };

  const combinedFiles = React.useMemo<FileCardListItem[]>(
    () => {
      const uploadCards = uploads.map<FileCardListItem>((upload) => ({
        viewKey: `upload-${upload.id}`,
        title: upload.name,
        source: "Upload" as const,
        filing: "PDF" as const,
        year: new Date(upload.uploadedAt).getFullYear(),
        status: "queued" as const,
        citationCount: 0
      }));

      const seededCards = files.map<FileCardListItem>((file) => ({
        ...file,
        viewKey: `seed-${file.title}-${file.year}`
      }));

      return [...uploadCards, ...seededCards].slice(0, 6);
    },
    [uploads]
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <p className="text-[0.75rem] uppercase tracking-wide text-text-muted">Capability 01</p>
        <PageHeading>Filing ingestion & parsing engine</PageHeading>
        <BodyText muted>
          Simulated ingestion showing queue status, table previews, and citation provenance. Replace mocks with the real queue events when
          wiring to EDGAR or vendor APIs.
        </BodyText>
      </div>

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <UploadDropzone onUploaded={handleUploaded} />
        <div className="grid gap-4 sm:grid-cols-2">
          {uploads.length === 0 ? (
            <p className="text-xs text-text-muted">Drop a PDF dummy file to see it appear here instantly.</p>
          ) : null}
          {combinedFiles.map(({ viewKey, ...file }) => (
            <FileCard key={viewKey} {...file} />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-surface p-6">
        <p className="text-sm font-semibold">Pipeline status</p>
        <Stepper steps={stepperData} />
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-text-muted">
          <span>Last refresh: 2 minutes ago</span>
          <span>Confidence: 98.4%</span>
          <span>OCR fallback engaged for 1 filing</span>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Summary Compensation Table</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={[
                { key: "exec", header: "Executive" },
                {
                  key: "salary",
                  header: "Salary",
                  align: "right",
                  render: (row) => currency.format((row as (typeof summaryCompTable)[number]).salary)
                },
                {
                  key: "bonus",
                  header: "Bonus",
                  align: "right",
                  render: (row) => currency.format((row as (typeof summaryCompTable)[number]).bonus)
                },
                {
                  key: "equity",
                  header: "Equity",
                  align: "right",
                  render: (row) => currency.format((row as (typeof summaryCompTable)[number]).equity)
                },
                {
                  key: "mix",
                  header: "Mix",
                  render: (row) => (
                    <span className="rounded-full border border-border/60 bg-surface/60 px-3 py-1 text-xs text-text">
                      {formatMixPill(row as (typeof summaryCompTable)[number])}
                    </span>
                  )
                }
              ]}
              data={summaryCompTable}
              density="compact"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Grants of Plan-Based Awards</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={[
                { key: "grant", header: "Grant" },
                { key: "type", header: "Type" },
                { key: "value", header: "Grant Value", align: "right" },
                { key: "metric", header: "Metric" }
              ]}
              data={grantsTable}
              density="compact"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pay vs Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={[
                { key: "year", header: "Year" },
                { key: "ceoPay", header: "CEO Pay", align: "right" },
                { key: "compPeerPct", header: "Peer Percentile", align: "right" },
                { key: "tsr", header: "TSR", align: "right" }
              ]}
              data={pvpTable}
              density="compact"
            />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Entity normalization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs uppercase text-text-muted">Tickers & CIKs</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {entityNormalization.tickers.map((entry) => (
                  <Badge key={entry.label} variant={entry.status === "resolved" ? "success" : "warning"}>
                    {entry.label} · {entry.status}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase text-text-muted">Exec names</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {entityNormalization.executives.map((entry) => (
                  <Badge key={entry.label} variant={entry.status === "resolved" ? "success" : "warning"}>
                    {entry.label}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase text-text-muted">Grant labels</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {entityNormalization.grants.map((entry) => (
                  <Badge key={entry.label} variant={entry.status === "resolved" ? "success" : "warning"}>
                    {entry.label}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Provenance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            <p className="text-sm text-text-muted">
              Every table cell is stamped with `page:line`. Click a citation to open the right drawer preview - align with your document
              viewer or storage bucket later.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(citations as Citation[]).map((citation) => (
                <CitationChip key={citation.id} citation={citation} />
              ))}
            </div>
          </CardContent>
        </Card>
        <AiInsightPanel
          className="lg:col-span-1"
          title="Ingestion copilot"
          description="Ask Farient AI about filings, pipeline status, or citation provenance."
          systemPrompt={ingestionSystemPrompt}
          placeholder="e.g., Where are the current ingestion bottlenecks?"
          suggestions={[
            "Summarize the ingestion pipeline and confidence levels.",
            "Which normalization items require analyst review?"
          ]}
        />
      </section>
    </div>
  );
}
