import { md } from "@/lib/docsSync";
import { FilingWorkspace } from "@/components/filings/FilingWorkspace";

export default function FilingsPage() {
  const subtitle = md(
    "filings-subtitle",
    "Simulated ingestion showing queue status, table previews, and citation provenance. Replace mocks with the real queue events when wiring to EDGAR or vendor APIs."
  );

  return <FilingWorkspace subtitle={subtitle} />;
}
