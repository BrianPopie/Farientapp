import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BoardStat } from "@/components/metrics/BoardStat";
import { KpiCard } from "@/components/metrics/KpiCard";
import { TsrMini } from "@/components/charts/TsrMini";
import { AlertTriangle, Bell, FileText, Layers } from "lucide-react";
import { PageHeading, BodyText, Kicker } from "@/components/ui/typography";
import { md } from "@/lib/docsSync";

export const revalidate = 120;

const overviewSubtitle = md(
  "overview-subtitle",
  "Farient transforms DEF 14As, 10-K/Qs, and policy packs into structured insights so analysts can defend every metric in front of the board."
);

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
      <GlassCard className="md:col-span-7 min-h-[320px] p-8">
        <div className="flex h-full flex-col gap-6">
          <div className="space-y-3">
            <Kicker>Executive compensation intelligence</Kicker>
            <PageHeading>Deal Intelligence Dashboard</PageHeading>
            <BodyText muted className="max-w-3xl">
              {overviewSubtitle}
            </BodyText>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/filings" prefetch={false} className="inline-flex">
              <Button className="gap-2 focus-ring">
                Launch ingestion →
              </Button>
            </Link>
            <Link href="/reports" prefetch={false} className="inline-flex">
              <Button variant="secondary" className="focus-ring bg-card/70 hover:bg-card">
                Preview board pack
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <BoardStat label="Filings ingested" value="+1.2M rows" valueClassName="text-sky-500 dark:text-sky-300" />
            <BoardStat label="Extraction accuracy" value="98.4%" valueClassName="text-emerald-500 dark:text-emerald-300" />
            <BoardStat label="Analyst hits" value="+54" valueClassName="text-indigo-500 dark:text-indigo-300" />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="md:col-span-5 min-h-[320px] overflow-hidden p-0">
        <div className="flex items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-medium text-foreground">TSR vs CEO Total Comp</p>
            <p className="text-xs text-muted-foreground">Last updated 3h ago</p>
          </div>
          <div className="space-x-2">
            <Badge
              variant="outline"
              className="border-none bg-[#ffd369]/25 text-[#b98a1d] dark:bg-[#ffd369]/15 dark:text-[#ffd369]"
            >
              TSR %
            </Badge>
            <Badge
              variant="outline"
              className="border-none bg-[#5d5fe5]/25 text-[#3032a3] dark:bg-[#5d5fe5]/15 dark:text-[#5d5fe5]"
            >
              CEO pay
            </Badge>
          </div>
        </div>
        <TsrMini className="px-2 pb-4" />
      </GlassCard>

      <KpiCard
        label="Cycle time"
        value="4m 12s"
        delta="+63% faster vs manual"
        intent="good"
        className="md:col-span-3"
      />
      <KpiCard
        label="Trackable metrics"
        value="312"
        icon={<Layers className="h-4 w-4 text-sky-500" />}
        className="md:col-span-3 opacity-90"
      />
      <KpiCard
        label="Filings queued"
        value="28"
        icon={<FileText className="h-4 w-4 text-emerald-500" />}
        className="md:col-span-3 opacity-100"
      />
      <KpiCard
        label="Alerts"
        value="7"
        delta="Requires sign-off"
        intent="warn"
        icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
        className="md:col-span-3 opacity-80"
      />

      <GlassCard className="md:col-span-4 min-h-[260px] p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Bell className="h-4 w-4 text-sky-400" />
          Filings pipeline
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          28 issuers queued with SLA &lt; 30 mins. Next up: Aurelius Corp (DEF 14A) and Northwind Energy (8-K).
        </p>
      </GlassCard>

      <GlassCard className="md:col-span-4 min-h-[260px] p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Alert feed
        </div>
        <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
          <li>3 policy deltas require reviewer sign-off.</li>
          <li>ESG clause updated for Glass Lewis readiness.</li>
          <li>New clawback language flagged in Proxy draft.</li>
        </ul>
      </GlassCard>

      <GlassCard className="md:col-span-4 min-h-[260px] p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FileText className="h-4 w-4 text-emerald-400" />
          Board prep
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Docs + slides synced for 7 templates. Export the latest board-ready pack with embedded citations.
        </p>
      </GlassCard>
    </div>
  );
}
