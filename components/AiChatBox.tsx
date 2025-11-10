"use client";

import { useState } from "react";
import { useAiChat } from "@/hooks/useAiChat";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type AiChatBoxProps = {
  systemPrompt?: string;
};

const DEFAULT_PROMPT = "You are Farient's executive-comp AI copilot.";

export default function AiChatBox({ systemPrompt = DEFAULT_PROMPT }: AiChatBoxProps) {
  const [input, setInput] = useState("");
  const { messages, send, streaming } = useAiChat(systemPrompt);

  return (
    <div className="grid gap-4">
      <div className="h-[300px] overflow-y-auto rounded-2xl border border-border bg-surface/80 p-3 text-sm">
        {messages.length === 0 && <p className="text-text-muted">Start the conversation...</p>}
        {messages.map((message, idx) => (
          <div key={`${message.role}-${idx}`} className="mb-2 leading-relaxed">
            <span className="font-semibold text-text">{message.role === "user" ? "You" : "AI"}: </span>
            {message.content}
          </div>
        ))}
      </div>
      <Textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Ask Farient AI anything..."
        rows={3}
      />
      <div className="flex justify-end">
        <Button
          type="button"
          disabled={!input.trim() || streaming}
          onClick={async () => {
            await send(input);
            setInput("");
          }}
        >
          {streaming ? "Thinking..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
