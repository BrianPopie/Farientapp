import { SlideCard } from "./SlideCard";
import { CitationChip } from "./CitationChip";
import citations from "@/data/citations.json";
import type { Citation } from "@/lib/types";

const slides = [
  {
    title: "Board One-Pager",
    subtitle: "Executive Summary",
    highlights: ["10x faster comp review workflow", "Link every metric to filings", "Say-on-Pay risk drops below 5%"]
  },
  {
    title: "Peer Benchmark Grid",
    subtitle: "Comp vs TSR",
    highlights: ["Aurelius CEO at 55th comp percentile", "TSR trend closes vs SaaS peers", "Retention awards singled out"]
  },
  {
    title: "Policy Diagnostics",
    subtitle: "ISS / GL Lens",
    highlights: ["Flagged one-time awards", "Glass Lewis expects ESG scorecards", "Next check: template 2026"]
  },
  {
    title: "Appendix Tables",
    subtitle: "Traceable Data",
    highlights: ["Summary comp table normalized", "Grant plan tie-outs", "Citations embed page + line"]
  }
];

export function ReportPreview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {slides.map((slide) => (
          <SlideCard key={slide.title} {...slide} />
        ))}
      </div>
      <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
        <p className="text-[0.75rem] uppercase tracking-wide text-text-muted">Recent citations</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(citations as Citation[]).slice(0, 3).map((citation) => (
            <CitationChip key={citation.id} citation={citation} />
          ))}
        </div>
      </div>
    </div>
  );
}
