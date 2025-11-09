import "server-only";
import OpenAI from "openai";
import { env } from "@/env.mjs";

export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY
});

export const defaultModel = env.OPENAI_MODEL;
