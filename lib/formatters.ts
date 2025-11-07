import { Citation } from "./types";

export const filingLabels: Record<string, string> = {
  "DEF14A": "DEF 14A",
  "10-K": "10-K",
  "10-Q": "10-Q",
  "8-K": "8-K"
};

export const statusColorMap: Record<string, string> = {
  success: "bg-emerald-500/15 text-emerald-300",
  running: "bg-amber-500/15 text-amber-300",
  queued: "bg-slate-500/15 text-slate-300",
  error: "bg-rose-500/15 text-rose-200",
  default: "bg-slate-500/15 text-slate-200"
};

export const citationLabel = (citation: Citation) =>
  `${citation.filing} · p.${citation.page} · ln ${citation.lineStart}-${citation.lineEnd}`;
