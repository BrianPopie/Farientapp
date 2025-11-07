import { Card, CardContent } from "@/components/ui/card";
import type { AgentRun } from "@/lib/types";
import { DataBadge } from "./DataBadge";
import { Button } from "./ui/button";
import { Play } from "lucide-react";

const statusCopy: Record<AgentRun["status"], { label: string; tone: React.ComponentProps<typeof DataBadge>["tone"] }> = {
  success: { label: "Success", tone: "success" },
  running: { label: "Running", tone: "warning" },
  queued: { label: "Queued", tone: "neutral" },
  error: { label: "Needs attention", tone: "danger" }
};

type AgentRunCardProps = {
  run: AgentRun;
};

export function AgentRunCard({ run }: AgentRunCardProps) {
  const tone = statusCopy[run.status];
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-6 p-5">
        <div>
          <p className="text-sm font-semibold">{run.id}</p>
          <p className="text-xs text-muted-foreground">{new Date(run.runAt).toLocaleString()}</p>
          <div className="mt-3 flex items-center gap-3">
            <DataBadge tone={tone.tone}>{tone.label}</DataBadge>
            <span className="text-xs text-muted-foreground">{run.steps.length} stages</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-2xl" type="button">
          <Play className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
