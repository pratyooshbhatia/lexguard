import { LexGuardError } from "@/lib/utils/errors";
import { getModel } from "@/lib/gemini/client";

/**
 * OCR via Gemini Vision. Cheaper to integrate than Tesseract for the
 * hackathon and produces cleaner text on real-world phone screenshots of
 * contracts and terms-of-service pages.
 */
export async function extractFromImage(
  buffer: ArrayBuffer,
  mimeType: string
): Promise<{ text: string }> {
  try {
    const model = getModel();
    const base64 = Buffer.from(buffer).toString("base64");
    const result = await model.generateContent([
      { inlineData: { mimeType, data: base64 } },
      {
        text: "Transcribe ALL legible text from this image verbatim. Preserve line breaks. If no text is visible, respond with the single word: EMPTY."
      }
    ]);
    const text = result.response.text();
    if (!text.trim() || text.trim() === "EMPTY") {
      throw new LexGuardError(
        "EXTRACTION_FAILED",
        "We couldn't find any readable text in that image."
      );
    }
    return { text };
  } catch (err) {
    if (err instanceof LexGuardError) throw err;
    throw new LexGuardError("EXTRACTION_FAILED", "We couldn't read this image.", err);
  }
}
