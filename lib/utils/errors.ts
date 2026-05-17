import type { AnalysisError } from "@/types/analysis";

export class LexGuardError extends Error {
  readonly code: AnalysisError["code"];
  readonly details?: unknown;

  constructor(code: AnalysisError["code"], message: string, details?: unknown) {
    super(message);
    this.name = "LexGuardError";
    this.code = code;
    this.details = details;
  }

  toClientJSON(): AnalysisError {
    // Only forward code + our own message. Never forward `details` (may contain
    // SDK internals, file-system paths, or raw error objects from Gemini).
    return { code: this.code, message: this.message };
  }
}

// Safe messages for codes we don't handle as LexGuardError.
const SAFE_MESSAGES: Record<AnalysisError["code"], string> = {
  EXTRACTION_FAILED: "We couldn't extract text from that file.",
  UNSUPPORTED_FORMAT: "That file type isn't supported.",
  PAYLOAD_TOO_LARGE: "The file is too large.",
  MODEL_REFUSED: "The AI declined to analyze this document.",
  MODEL_TIMEOUT: "The analysis took too long. Please try again.",
  INVALID_OUTPUT: "The AI returned an unexpected response. Please try again.",
  UNKNOWN: "Something went wrong. Please try again."
};

export function toAnalysisError(err: unknown): AnalysisError {
  if (err instanceof LexGuardError) return err.toClientJSON();
  // For unexpected errors (SDK failures, runtime errors) return a safe generic
  // message. Never forward err.message — it can contain internal paths, env
  // variable names, or SDK error payloads.
  return { code: "UNKNOWN", message: SAFE_MESSAGES.UNKNOWN };
}

export { SAFE_MESSAGES };
