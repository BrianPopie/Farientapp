import { NextRequest } from "next/server";
import { openai, defaultModel } from "@/lib/ai/openai";

export const runtime = "edge";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages : [];
  const systemPrompt: string | undefined =
    typeof body?.systemPrompt === "string" && body.systemPrompt.length > 0 ? body.systemPrompt : undefined;

  if (!messages.length) {
    return new Response("Missing chat messages", { status: 400 });
  }

  const completion = await openai.chat.completions.create({
    model: defaultModel,
    messages: [
      ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
      ...messages
    ],
    temperature: 0.4,
    stream: true
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const delta = chunk.choices?.[0]?.delta?.content ?? "";
          if (delta) {
            controller.enqueue(encoder.encode(delta));
          }
        }
      } catch (error) {
        controller.enqueue(encoder.encode(`\n[Error] ${error instanceof Error ? error.message : String(error)}`));
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache"
    }
  });
}
