"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { streamChat } from "@/lib/ai/client";

type ChatMessage = { role: "user" | "assistant"; content: string };

export function useAiChat(systemPrompt?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const send = useCallback(
    async (rawContent: string) => {
      const content = rawContent.trim();
      if (!content) return;

      const history = [...messagesRef.current, { role: "user" as const, content }];
      setMessages(history);
      setStreaming(true);

      try {
        await streamChat(
          history,
          (token) => {
            setMessages((prev) => {
              if (!token) return prev;

              const next = [...prev];
              const last = next[next.length - 1];

              if (!last || last.role !== "assistant") {
                next.push({ role: "assistant", content: token });
              } else {
                next[next.length - 1] = { ...last, content: last.content + token };
              }

              return next;
            });
          },
          systemPrompt
        );
      } finally {
        setStreaming(false);
      }
    },
    [systemPrompt]
  );

  return { messages, send, streaming };
}
