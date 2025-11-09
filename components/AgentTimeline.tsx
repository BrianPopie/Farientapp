"use client";

import { motion } from "framer-motion";
import type { AgentRun } from "@/lib/types";
import { cn } from "@/lib/utils";

type AgentTimelineProps = {
  run: AgentRun;
};

const statusColor: Record<AgentRun["status"], string> = {
  success: "bg-emerald-500/30 border-emerald-400/60",
  running: "bg-amber-500/30 border-amber-400/60",
  queued: "bg-slate-500/30 border-slate-400/60",
  error: "bg-rose-500/30 border-rose-400/60"
};

export function AgentTimeline({ run }: AgentTimelineProps) {
  return (
    <div className="space-y-6">
      {run.steps.map((step, index) => {
        const completed = Boolean(step.finishedAt);
        return (
          <motion.div
            key={step.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-4"
          >
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-2xl border text-sm font-semibold",
                  completed ? statusColor["success"] : statusColor[run.status]
                )}
              >
                {index + 1}
              </span>
              {index < run.steps.length - 1 && <span className="h-10 w-px bg-muted/70" />}
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold">{step.name}</p>
                <span className="text-xs text-muted-foreground">
                  {new Date(step.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {step.logs.map((log, logIdx) => (
                  <li key={logIdx}>• {log}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
