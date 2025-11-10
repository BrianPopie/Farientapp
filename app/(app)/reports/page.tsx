"use client";

import * as React from "react";
import { ReportPreview } from "@/components/ReportPreview";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import AiChatBox from "@/components/AiChatBox";
import { PageHeading, BodyText } from "@/components/ui/typography";
import benchData from "@/data/bench.json";
import payMixData from "@/data/paymix.json";
import type { BenchSpec } from "@/lib/types";
import type { InsightPayload } from "@/lib/insights";
import { buildInsightPayload } from "@/lib/insights";

type CompanyPayMix = {
  company: string;
  role: string;
  salaryPct: number;
  bonusPct: number;
  equityPct: number;
  source: string;
};

const benchSpecs = benchData as BenchSpec[];
const companyMixes = payMixData as CompanyPayMix[];
const benchRoles = benchSpecs.map((entry) => entry.role);

export default function ReportsPage() {
  const [template, setTemplate] = React.useState("Board ready v3");
  const [brandColor, setBrandColor] = React.useState("#3b82f6");
  const [lastAiAnswer, setLastAiAnswer] = React.useState<string | null>(null);
  const [roleInsight, setRoleInsight] = React.useState<InsightPayload | null>(null);
  const [payMixRole, setPayMixRole] = React.useState(benchRoles[0] ?? "CFO");

  const benchMatch = benchSpecs.find((entry) => entry.role === payMixRole);
  const benchSnapshot =
    benchMatch?.payMix &&
    ({
      label: payMixRole,
      subtitle: `${benchMatch.band} norms`,
      mix: {
        salaryPct: benchMatch.payMix.salaryPct,
        bonusPct: benchMatch.payMix.bonusPct,
        equityPct: benchMatch.payMix.equityPct
      }
    } as const);

  const companyMix = companyMixes.find((entry) => entry.role === payMixRole);
  const actualSnapshot = companyMix
    ? {
        label: companyMix.company,
        subtitle: companyMix.source,
        mix: {
          salaryPct: companyMix.salaryPct,
          bonusPct: companyMix.bonusPct,
          equityPct: companyMix.equityPct
        }
      }
    : null;

  const handleAddToOnePager = () => {
    if (!lastAiAnswer) return;
    setRoleInsight(buildInsightPayload(lastAiAnswer));
  };

  return (
    <div className="space-y-8 text-text">
      <div className="flex flex-col gap-2">
        <p className="text-[0.75rem] uppercase tracking-wide text-text-muted">Capability 06</p>
        <PageHeading>Board-ready report generation</PageHeading>
        <BodyText muted>
          Generate one-pagers, benchmark decks, and appendix tables with embedded citations. Buttons below are disabled until you connect
          Google Slides or Docs.
        </BodyText>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-surface/70 px-4 py-3">
            <div>
              <p className="text-[0.75rem] uppercase tracking-wide text-text-muted">One-pager preview</p>
              <p className="text-sm text-text-muted">Inject the latest AI answer into the non-CEO role card.</p>
            </div>
            <Button variant="secondary" className="rounded-full" disabled={!lastAiAnswer} onClick={handleAddToOnePager}>
              Add to One-Pager
            </Button>
          </div>
          <ReportPreview
            roleInsight={roleInsight}
            payMix={{
              roleOptions: benchRoles,
              selectedRole: payMixRole,
              onRoleChange: setPayMixRole,
              actual: actualSnapshot,
              bench: benchSnapshot ?? null
            }}
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Template controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-xs uppercase text-text-muted">Template</p>
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Board ready v3">Board ready v3</SelectItem>
                  <SelectItem value="Investor lens">Investor lens</SelectItem>
                  <SelectItem value="Audit deep dive">Audit deep dive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs uppercase text-text-muted">Brand color</p>
              <div className="mt-2 flex items-center gap-3">
                <Input
                  type="color"
                  value={brandColor}
                  onChange={(event) => setBrandColor(event.target.value)}
                  className="h-12 w-12 cursor-pointer rounded-2xl border border-border p-1"
                />
                <Input value={brandColor} onChange={(event) => setBrandColor(event.target.value)} />
              </div>
            </div>
            <div className="space-y-3">
              <Button className="w-full" disabled>
                Export to Google Slides (mock)
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Export to Google Docs (mock)
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Board copilot</CardTitle>
          <CardDescription>
            Draft talking points, summaries, or appendix notes with Farient&apos;s AI assistant. Use the button above to drop the most
            recent answer into the role card.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AiChatBox
            systemPrompt="You are Farient's board-report copilot. Help write concise executive compensation summaries, board chair talking points, and appendix notes grounded in the dashboard context (TSR vs comp, benchmarking deltas, policy risks). Keep answers under 150 words and suggest next steps when possible."
            onAssistantMessage={setLastAiAnswer}
          />
        </CardContent>
      </Card>
    </div>
  );
}
