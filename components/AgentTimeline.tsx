"use client";

import { motion } from "framer-motion";
import type { AgentRun } from "@/lib/types";
import { cn } from "@/lib/utils";

type AgentTimelineProps = {
  run: AgentRun;
};

const statusColor: Record<AgentRun["status"], string> = {
  success: "bg-success/20 border-success/60",
  running: "bg-warning/20 border-warning/60",
  queued: "bg-muted/60 border-border",
  error: "bg-danger/20 border-danger/60"
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
                  "flex h-10 w-10 items-center justify-center rounded-2xl border text-sm font-semibold text-text",
                  completed ? statusColor.success : statusColor[run.status]
                )}
              >
                {index + 1}
              </span>
              {index < run.steps.length - 1 && <span className="h-10 w-px bg-muted" aria-hidden="true" />}
            </div>
            <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-text">{step.name}</p>
                <span className="text-xs text-text-muted">
                  {new Date(step.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <ul className="mt-2 space-y-1 text-sm text-text-muted">
                {step.logs.map((log, logIdx) => (
                  <li key={logIdx} className="flex items-start gap-2">
                    <span className="text-accent" aria-hidden="true">
                      •
                    </span>
                    {log}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
