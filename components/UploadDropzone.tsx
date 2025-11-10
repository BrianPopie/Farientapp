"use client";

import * as React from "react";
import { CloudUpload, Loader2, ShieldCheck, FileWarning } from "lucide-react";
import { Button } from "./ui/button";
import { DataBadge } from "./DataBadge";
import { wait } from "@/lib/utils";
import type { UploadedFiling } from "@/lib/types";

type UploadState = "idle" | "queued" | "parsing" | "complete";

type UploadDropzoneProps = {
  onUploaded?: (file: UploadedFiling) => void;
};

export function UploadDropzone({ onUploaded }: UploadDropzoneProps) {
  const [state, setState] = React.useState<UploadState>("idle");
  const [fileName, setFileName] = React.useState<string>();
  const [error, setError] = React.useState<string | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const statuses: Record<UploadState, { label: string; tone: React.ComponentProps<typeof DataBadge>["tone"] }> = {
    idle: { label: "Drop DEF 14A or Form 4", tone: "neutral" },
    queued: { label: "Queued", tone: "info" },
    parsing: { label: "Parsing tables", tone: "warning" },
    complete: { label: "Extracted", tone: "success" }
  };

  const uploadPdf = async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file.");
      return;
    }

    setError(null);
    setFileName(file.name);
    setState("queued");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const message = (await res.json().catch(() => ({}))).error ?? "Upload failed";
        throw new Error(message);
      }

      const data = (await res.json()) as { file: UploadedFiling };
      setState("parsing");
      onUploaded?.(data.file);
      await wait(900);
      setState("complete");
    } catch (err) {
      setState("idle");
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    uploadPdf(files[0]);
  };

  return (
    <div
      className={[
        "flex flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-surface px-6 py-10 text-center shadow-sm transition",
        dragActive ? "border-accent bg-surface/80" : "border-border"
      ].join(" ")}
      onDragOver={(event) => {
        event.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragActive(false);
        handleFiles(event.dataTransfer.files);
      }}
    >
      <input
        type="file"
        ref={inputRef}
        accept="application/pdf"
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <CloudUpload className="h-10 w-10 text-accent" aria-hidden="true" />
      <p className="mt-3 text-base font-semibold text-text">Upload Proxy or 10-K</p>
      <p className="text-sm text-text-muted">PDFs are stored securely and shared with the ingestion agents.</p>
      {fileName && (
        <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
          {state === "parsing" ? <Loader2 className="h-4 w-4 animate-spin text-accent" /> : <ShieldCheck className="h-4 w-4 text-success" />}
          {fileName}
        </div>
      )}
      <DataBadge tone={statuses[state].tone} className="mt-4">
        {statuses[state].label}
      </DataBadge>
      <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row">
        <Button
          onClick={() => inputRef.current?.click()}
          className="mt-1"
          type="button"
          disabled={state === "parsing"}
        >
          Select PDF
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="text-sm text-text-muted hover:text-text"
          onClick={() => inputRef.current?.click()}
        >
          or Drop file here
        </Button>
      </div>
      {error && (
        <div className="mt-4 flex items-center gap-2 text-xs text-danger">
          <FileWarning className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
