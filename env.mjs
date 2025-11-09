import { z } from "zod";

const Env = z.object({
  OPENAI_API_KEY: z.string().min(20, "OPENAI_API_KEY is required"),
  OPENAI_MODEL: z.string().default("gpt-4o-mini")
});

export const env = Env.parse({
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL ?? "gpt-4o-mini"
});
