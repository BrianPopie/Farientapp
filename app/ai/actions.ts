"use server";

import type { Inputs, Output } from "@/lib/farient/types";
import { compute } from "@/lib/farient/engine";
import { openai, defaultModel } from "@/lib/ai/openai";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type ChatRequest = {
  system: string;
  messages: ChatMessage[];
};

export async function generateBands(inputs: Required<Inputs>): Promise<Output> {
  return compute(inputs);
}

export async function runRoleAwareChat({ system, messages }: ChatRequest): Promise<string> {
  if (!messages?.length) {
    throw new Error("Include at least one user message.");
  }

  const completion = await openai.chat.completions.create({
    model: defaultModel,
    temperature: 0.4,
    messages: [{ role: "system" as const, content: system }, ...messages]
  });

  return completion.choices?.[0]?.message?.content ?? "No response generated.";
}
