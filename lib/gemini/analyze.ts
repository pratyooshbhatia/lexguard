import { randomUUID } from "node:crypto";
import { getModel } from "./client";
import { SYSTEM_PROMPT, buildAnalysisPrompt } from "./prompts";
import { analysisOutputSchema } from "./schemas";
import { MAX_ANALYSIS_CHARS, GEMINI_MODEL } from "@/lib/constants";
import { LexGuardError } from "@/lib/utils/errors";
import { severityToBand } from "@/lib/utils/format";
import type { AnalysisResult, RiskClause } from "@/types/analysis";

export async function analyzeDocument(rawText: string): Promise<AnalysisResult> {
  const started = Date.now();
  const text = rawText.trim();
  if (!text) {
    throw new LexGuardError("EXTRACTION_FAILED", "No text was extracted from the document.");
  }

  const truncated = text.length > MAX_ANALYSIS_CHARS;
  const payload = truncated ? text.slice(0, MAX_ANALYSIS_CHARS) : text;

  const model = getModel();
  let raw: string;

  try {
    const result = await model.generateContent({
      systemInstruction: { role: "system", parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: buildAnalysisPrompt(payload, truncated) }] }],
      generationConfig: { responseMimeType: "application/json" }
    });
    raw = result.response.text();
  } catch {
    // Gemini SDK errors (network, quota, safety block). Never forward the raw
    // error message — it may contain API key hints or internal SDK detail.
    throw new LexGuardError("MODEL_TIMEOUT", "The AI took too long or was unavailable. Please try again.");
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new LexGuardError("INVALID_OUTPUT", "The AI returned an unexpected response. Please try again.");
  }

  const parsed = analysisOutputSchema.safeParse(json);
  if (!parsed.success) {
    throw new LexGuardError(
      "INVALID_OUTPUT",
      "The AI returned an unexpected response. Please try again."
    );
  }

  const clauses: RiskClause[] = parsed.data.clauses.map((c) => ({ ...c, id: randomUUID() }));

  return {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    documentCategory: parsed.data.documentCategory,
    documentTitle: parsed.data.documentTitle,
    overallRiskScore: parsed.data.overallRiskScore,
    overallRiskBand: severityToBand(parsed.data.overallRiskScore),
    summary: parsed.data.summary,
    reasoning: parsed.data.reasoning,
    clauses,
    metadata: {
      wordCount: text.split(/\s+/).length,
      characterCount: text.length,
      durationMs: Date.now() - started,
      modelVersion: GEMINI_MODEL
    }
  };
}
