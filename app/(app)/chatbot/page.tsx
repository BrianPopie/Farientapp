"use client";

import AiChatBox from "@/components/AiChatBox";
import { DataBadge } from "@/components/DataBadge";

const prompt = `You are Farient's ingestion-focused AI copilot. Help analysts reason about the filings pipeline, queue metrics, normalization states, and provenance/citation workflows. Reference the mock data (28 issuers queued, 98.4% accuracy, OCR fallback on 1 filing) when relevant. Keep answers concise (<120 words) and suggest concrete next actions.`;

export default function ChatbotPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <DataBadge tone="info">AI Copilot</DataBadge>
        <h1 className="text-3xl font-semibold">Ingestion chat assistant</h1>
        <p className="text-muted-foreground">
          Ask the copilot about ingestion status, normalization issues, or next steps for filings. The assistant references the same mock
          pipeline data powering the ingestion dashboard.
        </p>
      </div>
      <AiChatBox systemPrompt={prompt} />
    </div>
  );
}
