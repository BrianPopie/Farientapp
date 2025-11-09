type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function streamChat(
  messages: ChatMessage[],
  onToken: (token: string) => void,
  systemPrompt?: string
) {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages,
      systemPrompt
    })
  });

  if (!res.ok || !res.body) {
    throw new Error("AI request failed");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onToken(decoder.decode(value, { stream: true }));
  }
}
