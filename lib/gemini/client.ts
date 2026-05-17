import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";
import { GEMINI_MODEL } from "@/lib/constants";
import { LexGuardError } from "@/lib/utils/errors";

let cachedClient: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new LexGuardError(
      "UNKNOWN",
      "GEMINI_API_KEY is not configured. Add it to .env.local."
    );
  }
  if (!cachedClient) cachedClient = new GoogleGenerativeAI(apiKey);
  return cachedClient;
}

export function getModel(): GenerativeModel {
  return getClient().getGenerativeModel({
    model: GEMINI_MODEL,
    // Structured output is configured per-call in `analyze.ts` because we want
    // a JSON schema response. Safety settings stay at defaults — Gemini's
    // built-in filters are appropriate for legal text.
    generationConfig: {
      temperature: 0.2,
      topP: 0.9,
      maxOutputTokens: 4096
    }
  });
}
