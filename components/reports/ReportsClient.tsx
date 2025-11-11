"use client";

import * as React from "react";
import { ReportPreview } from "@/components/ReportPreview";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import AiChatBox from "@/components/AiChatBox";
import { PageHeading, BodyText, Kicker } from "@/components/ui/typography";
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

type TemplatePreset = {
  insight: InsightPayload;
  payMixRole: string;
  brandColor: string;
  message: string;
};

const TEMPLATE_PRESETS: Record<string, TemplatePreset> = {
  "Board ready v3": {
    brandColor: "#3b82f6",
    payMixRole: "CFO",
    message: "Board-ready mock insight loaded.",
    insight: buildInsightPayload(`• Insight: Adjust CFO pay mix to reflect top-quartile SaaS peers while keeping TSR leverage.
• Why it matters: Investors expect a clearer connection between TSR and cash bonus outcomes ahead of proxy season.
• Next step: Share two pay mix options with the comp committee at the mid-May prep.
Guidance:
vehicles: 45% salary / 30% annual bonus / 25% PSUs
metrics: TSR vs SaaS peers + ARR growth
vesting: 3-year ratable with 1-year cliff
rationale: Sustains retention while adding upside for durable growth.`)
  },
  "Investor lens": {
    brandColor: "#6366f1",
    payMixRole: "Division President",
    message: "Investor lens narrative applied.",
    insight: buildInsightPayload(`• Insight: Highlight operating leverage gains and shift COO incentives toward earnings quality.
• Why it matters: Activist investors are tracking EBITDA margin; incentive redesign signals accountability.
• Next step: Publish a one-page briefing for the investor relations roadshow.
Guidance:
vehicles: 40% salary / 20% cash bonus / 40% RSUs
metrics: EBITDA margin + TSR overlay
vesting: 4-year graded
rationale: Balances stability for ops leader with shareholder alignment.`)
  },
  "Audit deep dive": {
    brandColor: "#14b8a6",
    payMixRole: "Ready-now CFO",
    message: "Audit deep dive template staged.",
    insight: buildInsightPayload(`• Insight: Document remediation incentives for Chief Audit to close material weakness on schedule.
• Why it matters: Proxy advisors watch for clawback readiness; clear incentives reduce perceived risk.
• Next step: Attach summary to the audit committee appendix.
Guidance:
vehicles: 55% salary / 15% bonus / 30% time-based RSU
metrics: Control remediation milestones + compliance score
vesting: 2-year cliff
rationale: Keeps focus on remediation while keeping equity modest.`)
  }
};

type ReportsClientProps = {
  subtitle: string;
};

export function ReportsClient({ subtitle }: ReportsClientProps) {
  const [template, setTemplate] = React.useState("Board ready v3");
  const [brandColor, setBrandColor] = React.useState("#3b82f6");
  const [lastAiAnswer, setLastAiAnswer] = React.useState<string | null>(null);
  const [roleInsight, setRoleInsight] = React.useState<InsightPayload | null>(null);
  const [payMixRole, setPayMixRole] = React.useState(benchRoles[0] ?? "CFO");
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
  const statusTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushStatus = React.useCallback((message: string) => {
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    setStatusMessage(message);
    statusTimerRef.current = setTimeout(() => setStatusMessage(null), 3500);
  }, []);

  React.useEffect(
    () => () => {
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    },
    []
  );

  const handleTemplateChange = (value: string) => {
    setTemplate(value);
    const preset = TEMPLATE_PRESETS[value];
    if (preset) {
      setBrandColor(preset.brandColor);
      setPayMixRole(preset.payMixRole);
      setRoleInsight(preset.insight);
      pushStatus(preset.message);
    }
  };

  const handleAddToOnePager = () => {
    if (lastAiAnswer) {
      setRoleInsight(buildInsightPayload(lastAiAnswer));
      pushStatus("Latest AI insight pinned to the one-pager.");
      return;
    }
    const preset = TEMPLATE_PRESETS[template];
    if (preset) {
      setRoleInsight(preset.insight);
      setPayMixRole(preset.payMixRole);
      pushStatus(preset.message);
    }
  };

  const handleExport = (target: "slides" | "docs") => {
    pushStatus(`Mock export queued for Google ${target === "slides" ? "Slides" : "Docs"}.`);
  };

  const canUsePreset = Boolean(TEMPLATE_PRESETS[template]);
  const canAddToOnePager = Boolean(lastAiAnswer || canUsePreset);

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

  return (
    <div className="space-y-8 text-foreground">
      <div className="flex flex-col gap-3">
        <Kicker>Capability 06</Kicker>
        <PageHeading>Board-ready report generation</PageHeading>
        <BodyText muted>{subtitle}</BodyText>
      </div>

      {statusMessage ? (
        <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{statusMessage}</div>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-elev-0">
            <div>
              <p className="text-[0.75rem] uppercase tracking-wide text-muted-foreground">One-pager preview</p>
              <p className="text-sm text-muted-foreground">Inject the latest AI answer into the non-CEO role card.</p>
            </div>
            <Button variant="secondary" className="rounded-full focus-ring" disabled={!canAddToOnePager} onClick={handleAddToOnePager}>
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
            brandColor={brandColor}
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Template controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Template</p>
              <Select value={template} onValueChange={handleTemplateChange}>
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
              <p className="text-xs uppercase text-muted-foreground">Brand color</p>
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
              <Button className="w-full focus-ring" onClick={() => handleExport("slides")}>
                Export to Google Slides (mock)
              </Button>
              <Button variant="outline" className="w-full focus-ring" onClick={() => handleExport("docs")}>
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
            Draft talking points, summaries, or appendix notes with Farient&apos;s AI assistant. Use the button above to drop the most recent answer
            into the role card.
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
