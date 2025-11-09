"use client";

import { RadarRisk } from "@/components/RadarRisk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import policyDeltas from "@/data/policies.json";
import { PolicyDeltaCard } from "@/components/PolicyDeltaCard";
import { CitationChip } from "@/components/CitationChip";
import citations from "@/data/citations.json";
import { DataBadge } from "@/components/DataBadge";
import type { Citation, RiskProfile, PolicyDelta } from "@/lib/types";

const riskAxes: RiskProfile[] = [
  { axis: "Leverage", value: 68 },
  { axis: "Time-vesting", value: 45 },
  { axis: "One-time awards", value: 80 },
  { axis: "Metric quality", value: 60 },
  { axis: "Goal rigor", value: 55 },
  { axis: "Pay-performance alignment", value: 70 }
];

const riskRows = [
  {
    practice: "Retention grant before SOP",
    impact: "High",
    evidence: "cit_bor_retention",
    remediator: "Tie vesting to TSR or rescind prior to vote"
  },
  {
    practice: "CEO pay vs TSR misaligned",
    impact: "Medium",
    evidence: "cit_aur_p4p",
    remediator: "Communicate AI KPI uplift in disclosure"
  },
  {
    practice: "Metric definitions stale",
    impact: "Low",
    evidence: "cit_bor_policy",
    remediator: "Adopt ISS 2026 ESG scoring"
  }
];

export default function PolicyPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Capability 04</p>
        <h1 className="text-3xl font-semibold">Policy & governance intelligence</h1>
        <p className="text-muted-foreground">
          Visualize Say-on-Pay risk through ISS and Glass Lewis lenses and compare policy deltas between years.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-2 min-w-0">
        <Card>
          <CardHeader>
            <CardTitle>Risk radar</CardTitle>
          </CardHeader>
          <CardContent className="min-w-0 min-h-0">
            <RadarRisk data={riskAxes} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Policy deltas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(policyDeltas as PolicyDelta[]).map((delta) => (
              <PolicyDeltaCard key={delta.id} delta={delta} />
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Risk register with evidence</h2>
          <DataBadge tone="warning">Linked to citations</DataBadge>
        </div>
        <div className="mt-4 space-y-4">
          {riskRows.map((row) => {
            const citation = citations.find((c) => c.id === row.evidence) as Citation | undefined;
            if (!citation) return null;
            return (
              <div key={row.practice} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold">{row.practice}</p>
                    <p className="text-xs text-muted-foreground">{row.remediator}</p>
                  </div>
                  <span className="text-xs text-rose-300">{row.impact} impact</span>
                </div>
                <div className="mt-3">
                  <CitationChip citation={citation} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
