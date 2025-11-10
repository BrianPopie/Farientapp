"use client";

import * as React from "react";
import { CloudUpload, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import { DataBadge } from "./DataBadge";
import { wait } from "@/lib/utils";

type UploadState = "idle" | "queued" | "parsing" | "complete";

export function UploadDropzone() {
  const [state, setState] = React.useState<UploadState>("idle");
  const [fileName, setFileName] = React.useState<string>();

  const statuses: Record<UploadState, { label: string; tone: React.ComponentProps<typeof DataBadge>["tone"] }> = {
    idle: { label: "Drop DEF 14A or Form 4", tone: "neutral" },
    queued: { label: "Queued", tone: "info" },
    parsing: { label: "Parsing tables", tone: "warning" },
    complete: { label: "Extracted", tone: "success" }
  };

  const simulateUpload = async () => {
    setFileName("dummy-proxy.pdf");
    setState("queued");
    await wait(600);
    setState("parsing");
    await wait(1400);
    setState("complete");
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-surface px-6 py-10 text-center shadow-sm">
      <CloudUpload className="h-10 w-10 text-accent" aria-hidden="true" />
      <p className="mt-3 text-base font-semibold text-text">Upload Proxy or 10-K</p>
      <p className="text-sm text-text-muted">Simulated ingestion using placeholder PDF</p>
      {fileName && (
        <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
          {state === "parsing" ? <Loader2 className="h-4 w-4 animate-spin text-accent" /> : <ShieldCheck className="h-4 w-4 text-success" />}
          {fileName}
        </div>
      )}
      <DataBadge tone={statuses[state].tone} className="mt-4">
        {statuses[state].label}
      </DataBadge>
      <Button onClick={simulateUpload} className="mt-5" type="button">
        Select dummy-proxy.pdf
      </Button>
    </div>
  );
}
