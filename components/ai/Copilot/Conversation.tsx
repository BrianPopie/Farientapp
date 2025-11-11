"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AssistantPanel } from "./AssistantPanel";
import type { AssistantPanelModel, CopilotMessage } from "./types";
import { stripMarkdownNoise } from "@/lib/text/sanitize";

type ConversationProps = {
  messages: CopilotMessage[];
  pending?: boolean;
  assistantModels: Record<string, AssistantPanelModel | undefined>;
};

export function Conversation({ messages, pending, assistantModels }: ConversationProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex min-h-0 flex-col gap-4 overflow-y-auto px-5 py-6">
      {messages.length === 0 ? (
        <div className="mx-auto max-w-prose rounded-2xl border border-dashed border-border bg-white/70 px-5 py-4 text-center text-sm text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300">
          Capture the five builder inputs, then ask Farient to benchmark, prep comp committee materials, or explain pay
          mix tradeoffs. Responses stay grounded in your selections.
        </div>
      ) : null}

      {messages.map((message) => {
        if (message.role === "assistant") {
          const panel = assistantModels[message.id];
          const content = panel ? (
            <AssistantPanel {...panel} />
          ) : (
            <p className="ai-prose text-sm text-slate-700 dark:text-slate-200">
              {stripMarkdownNoise(message.content)}
            </p>
          );

          return (
            <motion.div
              key={message.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="max-w-3xl rounded-3xl border border-[rgba(120,150,255,0.18)] bg-[rgba(90,110,255,0.06)] p-1 shadow-[0_0_30px_rgba(100,120,255,0.15)]"
            >
              {content}
            </motion.div>
          );
        }

        return (
          <div
            key={message.id}
            className="ml-auto max-w-2xl rounded-3xl border border-border bg-white px-4 py-3 text-sm text-slate-900 shadow-soft dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-white/60">You</p>
            <p className="mt-1 whitespace-pre-wrap leading-6 text-slate-700 dark:text-white">
              {stripMarkdownNoise(message.content)}
            </p>
          </div>
        );
      })}

      {pending ? <TypingIndicator /> : null}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-xs text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/70">
      <span>Farient drafting</span>
      <span className="flex gap-1">
        {[0, 1, 2].map((idx) => (
          <span
            key={idx}
            className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white/60"
            style={{ animationDelay: `${idx * 0.15}s` }}
          />
        ))}
      </span>
    </div>
  );
}
