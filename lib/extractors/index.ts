import { validateFile } from "@/lib/utils/fileSecurity";
import { extractFromDocx } from "./docx";
import { extractFromImage } from "./image";
import { extractFromPdf } from "./pdf";

export async function extractText(
  buffer: ArrayBuffer,
  claimedMime: string
): Promise<{ text: string; pageCount?: number }> {
  // Validate allowlist + magic bytes. Throws LexGuardError on failure.
  const mime = validateFile(buffer, claimedMime);

  switch (mime) {
    case "application/pdf":
      return extractFromPdf(buffer);
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return extractFromDocx(buffer);
    case "image/png":
    case "image/jpeg":
    case "image/webp":
      return extractFromImage(buffer, mime);
    case "text/plain":
      return { text: new TextDecoder().decode(buffer) };
  }
}
