export const APP_NAME = "LexGuard";
export const APP_TAGLINE = "Understand contracts before you sign.";
export const APP_DESCRIPTION =
  "LexGuard reads contracts, terms of service, and policies — and explains the risky bits in plain English.";

export const MAX_UPLOAD_BYTES = Number(
  process.env.LEXGUARD_MAX_UPLOAD_BYTES ?? 10 * 1024 * 1024
);

export const SUPPORTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/webp",
  "text/plain"
] as const;

export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

// Soft cap on extracted text length passed to the model. Anything longer is
// truncated with an explicit notice in the prompt to keep latency predictable.
export const MAX_ANALYSIS_CHARS = 60_000;
