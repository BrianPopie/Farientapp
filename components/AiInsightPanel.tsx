"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { useAiChat } from "@/hooks/useAiChat";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AiInsightPanelProps = {
  title: string;
  description: string;
  systemPrompt: string;
  placeholder?: string;
  suggestions?: string[];
  className?: string;
};

export function AiInsightPanel({
  title,
  description,
  systemPrompt,
  placeholder,
  suggestions = [],
  className
}: AiInsightPanelProps) {
  const [input, setInput] = useState("");
  const { messages, send, streaming } = useAiChat(systemPrompt);
  const latestAssistant = [...messages].reverse().find((msg) => msg.role === "assistant")?.content;

  const ask = async (question?: string) => {
    const prompt = (question ?? input).trim();
    if (!prompt) return;
    setInput(question ? input : "");
    await send(prompt);
  };

  return (
    <Card className={cn("flex h-full flex-col bg-card/90", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="min-h-[130px] rounded-2xl border border-dashed border-border/60 bg-background/70 p-4 text-sm text-foreground">
          {streaming ? (
            <p className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating insight...
            </p>
          ) : latestAssistant ? (
            <p className="leading-relaxed">{latestAssistant}</p>
          ) : (
            <p className="text-muted-foreground">Ask a question below to generate an AI insight.</p>
          )}
        </div>
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={placeholder ?? 'Ask something specific, e.g. "Summarize policy deltas"'}
          rows={3}
        />
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => ask()} disabled={streaming || !input.trim()}>
            Send
          </Button>
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              type="button"
              variant="outline"
              size="sm"
              disabled={streaming}
              onClick={() => ask(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
