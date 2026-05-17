import { LexGuardError } from "@/lib/utils/errors";
import { getModel } from "@/lib/gemini/client";

/**
 * Strategy: hand the PDF straight to Gemini's multimodal input rather than
 * adding a heavy server-side PDF parser. Gemini accepts PDFs as inline data
 * and handles OCR + layout well enough for hackathon-grade analysis.
 *
 * Trade-off: we pay one extra model call to convert PDF → plain text before
 * analysis. That keeps the analysis step itself simple (text-only) and
 * deterministic. If latency becomes the bottleneck, swap this to a single
 * combined multimodal analyze call.
 */
export async function extractFromPdf(
  buffer: ArrayBuffer
): Promise<{ text: string; pageCount?: number }> {
  try {
    const model = getModel();
    const base64 = Buffer.from(buffer).toString("base64");
    const result = await model.generateContent([
      {
        inlineData: { mimeType: "application/pdf", data: base64 }
      },
      {
        text: "Extract ALL text from this PDF verbatim. Preserve paragraph breaks. Do not summarize."
      }
    ]);
    const text = result.response.text();
    if (!text.trim()) {
      throw new LexGuardError("EXTRACTION_FAILED", "The PDF appears to be empty or unreadable.");
    }
    return { text };
  } catch (err) {
    if (err instanceof LexGuardError) throw err;
    throw new LexGuardError("EXTRACTION_FAILED", "We couldn't read this PDF.", err);
  }
}
