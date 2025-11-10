"use client";

import AiChatBox from "@/components/AiChatBox";
import { DataBadge } from "@/components/DataBadge";
import { PageHeading, BodyText } from "@/components/ui/typography";

const prompt = `You are Farient's ingestion-focused AI copilot. Help analysts reason about the filings pipeline, queue metrics, normalization states, and provenance/citation workflows. Reference the mock data (28 issuers queued, 98.4% accuracy, OCR fallback on 1 filing) when relevant. Keep answers concise (<120 words) and suggest concrete next actions.`;

export default function ChatbotPage() {
  return (
    <div className="space-y-6 text-text">
      <div className="flex flex-col gap-2">
        <DataBadge tone="info">AI Copilot</DataBadge>
        <PageHeading>Ingestion chat assistant</PageHeading>
        <BodyText muted>
          Ask the copilot about ingestion status, normalization issues, or next steps for filings. The assistant references the same mock
          pipeline data powering the ingestion dashboard.
        </BodyText>
      </div>
      <AiChatBox systemPrompt={prompt} />
    </div>
  );
}
