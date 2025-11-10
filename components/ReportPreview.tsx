"use client";

import { SlideCard } from "./SlideCard";
import { CitationChip } from "./CitationChip";
import { GuidanceCallout } from "./GuidanceCallout";
import { PayMixBar } from "./PayMixBar";
import citations from "@/data/citations.json";
import type { Citation } from "@/lib/types";
import type { InsightPayload } from "@/lib/insights";
import { mapInsightSegments } from "@/lib/insights";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const slides = [
  {
    title: "Board One-Pager",
    subtitle: "Executive Summary",
    highlights: ["10x faster comp review workflow", "Link every metric to filings", "Say-on-Pay risk drops below 5%"]
  },
  {
    title: "Peer Benchmark Grid",
    subtitle: "Comp vs TSR",
    highlights: ["Aurelius CEO at 55th comp percentile", "TSR trend closes vs SaaS peers", "Retention awards singled out"]
  },
  {
    title: "Policy Diagnostics",
    subtitle: "ISS / GL Lens",
    highlights: ["Flagged one-time awards", "Glass Lewis expects ESG scorecards", "Next check: template 2026"]
  },
  {
    title: "Appendix Tables",
    subtitle: "Traceable Data",
    highlights: ["Summary comp table normalized", "Grant plan tie-outs", "Citations embed page + line"]
  }
];

const ROLE_SEGMENTS = ["C-Suite minus CEO", "P&L Leaders", "Critical Tech", "Successors"];

export type PayMixSnapshot = {
  label: string;
  subtitle?: string;
  mix: {
    salaryPct: number;
    bonusPct: number;
    equityPct: number;
  };
};

type PayMixProps = {
  roleOptions: string[];
  selectedRole: string;
  onRoleChange: (role: string) => void;
  actual?: PayMixSnapshot | null;
  bench?: PayMixSnapshot | null;
};

type ReportPreviewProps = {
  roleInsight?: InsightPayload | null;
  payMix?: PayMixProps;
};

export function ReportPreview({ roleInsight, payMix }: ReportPreviewProps) {
  const insightSegments = roleInsight ? mapInsightSegments(roleInsight.body) : null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {slides.map((slide) => (
          <SlideCard key={slide.title} {...slide} />
        ))}
      </div>

      <div className="rounded-3xl border border-accent/40 bg-surface p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.75rem] uppercase tracking-wide text-text-muted">Committee-ready role insight</p>
            <p className="text-sm text-text-muted">C-Suite minus CEO / P&L / Critical Tech / Successors</p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-text">
            {ROLE_SEGMENTS.map((segment) => (
              <span key={segment} className="rounded-full border border-border/60 px-3 py-1">
                {segment}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-dashed border-border/80 bg-bg/50 p-4 text-sm leading-6 text-text">
          {roleInsight ? (
            <div className="space-y-3">
              <section>
                <p className="text-[11px] uppercase tracking-wide text-text-muted">Recommendation</p>
                <p>{insightSegments?.recommendation || roleInsight.body}</p>
              </section>
              <section>
                <p className="text-[11px] uppercase tracking-wide text-text-muted">Rationale</p>
                <p>{insightSegments?.rationale || "Need source"}</p>
              </section>
              <section>
                <p className="text-[11px] uppercase tracking-wide text-text-muted">Alignment</p>
                <p>{insightSegments?.alignment || "Need source"}</p>
              </section>
              {roleInsight.citations.length > 0 ? (
                <div className="flex flex-wrap gap-2 text-xs">
                  {roleInsight.citations.map((citation) => (
                    <span key={citation} className="rounded-full border border-border/60 bg-surface/60 px-3 py-1">
                      [{citation}]
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            "No AI insight added yet. Use the Add to One-Pager button to place the most recent chatbot response here."
          )}
        </div>
      </div>

      {roleInsight?.guidance ? (
        <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-[0.75rem] uppercase tracking-wide text-text-muted">Equity guidance (mirrored from AI)</p>
          <div className="mt-3">
            <GuidanceCallout guidance={roleInsight.guidance} />
          </div>
        </div>
      ) : null}

      {payMix ? (
        <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[0.75rem] uppercase tracking-wide text-text-muted">Pay Mix Bench</p>
              <p className="text-sm text-text-muted">Compare normalized SCT vs mock norms for non-CEO roles.</p>
            </div>
            <Select value={payMix.selectedRole} onValueChange={payMix.onRoleChange}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {payMix.roleOptions.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {payMix.actual ? (
              <PayMixBar
                label={`${payMix.actual.label} actual`}
                subtitle={payMix.actual.subtitle}
                mix={payMix.actual.mix}
              />
            ) : (
              <EmptyMix label="Actual mix pending ingestion" />
            )}
            {payMix.bench ? (
              <PayMixBar
                label={`${payMix.bench.label} norms`}
                subtitle={payMix.bench.subtitle}
                mix={payMix.bench.mix}
              />
            ) : (
              <EmptyMix label="Need benchmark norms" />
            )}
          </div>
        </div>
      ) : null}

      <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
        <p className="text-[0.75rem] uppercase tracking-wide text-text-muted">Recent citations</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(citations as Citation[]).slice(0, 3).map((citation) => (
            <CitationChip key={citation.id} citation={citation} />
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyMix({ label }: { label: string }) {
  return (
    <div className="flex h-full min-h-[96px] flex-col justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 p-4 text-sm text-text-muted">
      {label}
    </div>
  );
}
