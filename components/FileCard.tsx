import { ArrowUpRight, Link2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DataBadge } from "./DataBadge";
import { Button } from "./ui/button";

type FileCardProps = {
  title: string;
  source: "EDGAR" | "IR" | "Upload";
  filing: "DEF 14A" | "10-K" | "10-Q" | "8-K" | "Form 4" | "PDF";
  year: number;
  status: "queued" | "parsing" | "extracted" | "indexed";
  citationCount: number;
};

const statusTone: Record<FileCardProps["status"], { label: string; tone: React.ComponentProps<typeof DataBadge>["tone"] }> = {
  queued: { label: "Queued", tone: "neutral" },
  parsing: { label: "Parsing", tone: "warning" },
  extracted: { label: "Extracted", tone: "info" },
  indexed: { label: "Indexed", tone: "success" }
};

export function FileCard({ title, source, filing, year, status, citationCount }: FileCardProps) {
  const tone = statusTone[status];

  return (
    <Card className="glass-panel border-border bg-surface/95">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[0.95rem] font-semibold text-text">{title}</p>
            <p className="text-xs text-text-muted">
              {source} · {filing} · {year}
            </p>
          </div>
          <Link2 className="h-4 w-4 text-text-muted" aria-hidden="true" />
        </div>
        <div className="flex items-center gap-3">
          <DataBadge tone={tone.tone}>{tone.label}</DataBadge>
          <span className="text-xs text-text-muted">{citationCount} citations</span>
        </div>
        <Button variant="ghost" className="justify-start gap-2 px-0 text-sm text-accent" type="button">
          View provenance
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
