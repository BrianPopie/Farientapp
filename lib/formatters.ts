import { Citation } from "./types";

export const filingLabels: Record<string, string> = {
  DEF14A: "DEF 14A",
  "10-K": "10-K",
  "10-Q": "10-Q",
  "8-K": "8-K"
};

export const statusColorMap: Record<string, string> = {
  success: "bg-success/15 text-success",
  running: "bg-warning/20 text-warning",
  queued: "bg-muted/50 text-text-muted",
  error: "bg-danger/18 text-danger",
  default: "bg-muted/50 text-text-muted"
};

export const citationLabel = (citation: Citation) =>
  `${citation.filing} / p.${citation.page} / ln ${citation.lineStart}-${citation.lineEnd}`;
