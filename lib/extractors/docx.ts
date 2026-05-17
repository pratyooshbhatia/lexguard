import { LexGuardError } from "@/lib/utils/errors";

export async function extractFromDocx(buffer: ArrayBuffer): Promise<{ text: string }> {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
    return { text: result.value };
  } catch (err) {
    throw new LexGuardError("EXTRACTION_FAILED", "We couldn't read this .docx file.", err);
  }
}
