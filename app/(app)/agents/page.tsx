"use client";

import { AgentTimeline } from "@/components/AgentTimeline";
import { AgentRunCard } from "@/components/AgentRunCard";
import { useMockRuns } from "@/store/useMockRuns";
import { Button } from "@/components/ui/button";
import { Play, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AgentsPage() {
  const runs = useMockRuns((state) => state.runs);
  const latestRun = runs[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Capability 05</p>
        <h1 className="text-3xl font-semibold">Agentic research workflow</h1>
        <p className="text-muted-foreground">
          Multi-agent orchestration with Gatherer, Extractor, Analyst, QA, and Report. Every step logs duration and outputs for
          reproducibility.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button className="gap-2" type="button">
            <Play className="h-4 w-4" />
            Trigger mock run
          </Button>
          <Button variant="ghost" className="gap-2" type="button">
            <RefreshCcw className="h-4 w-4" />
            Sync agents
          </Button>
        </div>
      </div>

      {latestRun && (
        <Card>
          <CardHeader>
            <CardTitle>Latest run · {latestRun.companyId.toUpperCase()}</CardTitle>
          </CardHeader>
          <CardContent>
            <AgentTimeline run={latestRun} />
          </CardContent>
        </Card>
      )}

      <section className="grid gap-4 lg:grid-cols-2">
        {runs.slice(0, 4).map((run) => (
          <AgentRunCard key={run.id} run={run} />
        ))}
      </section>
    </div>
  );
}
