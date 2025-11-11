import { md } from "@/lib/docsSync";
import { ReportsClient } from "@/components/reports/ReportsClient";

export default function ReportsPage() {
  const subtitle = md(
    "reports-subtitle",
    "Generate one-pagers, benchmark decks, and appendix tables with embedded citations. Buttons below are disabled until you connect Google Slides or Docs."
  );

  return <ReportsClient subtitle={subtitle} />;
}
