import { LexGuardError } from "./errors";

type AllowedMime =
  | "application/pdf"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "image/png"
  | "image/jpeg"
  | "image/webp"
  | "text/plain";

interface MagicEntry {
  mime: AllowedMime;
  offset: number;
  bytes: number[];
}

const MAGIC: MagicEntry[] = [
  { mime: "application/pdf", offset: 0, bytes: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  {
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    offset: 0,
    bytes: [0x50, 0x4b, 0x03, 0x04] // PK (ZIP/DOCX)
  },
  { mime: "image/png", offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47] }, // .PNG
  { mime: "image/jpeg", offset: 0, bytes: [0xff, 0xd8, 0xff] }, // JPEG SOI
  { mime: "image/webp", offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] } // RIFF (WebP)
];

// MIME types that have no reliable magic bytes (plain text) or are passed
// through by structural check elsewhere.
const NO_MAGIC_CHECK: AllowedMime[] = ["text/plain"];

const ALLOWED_MIMES = new Set<string>([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/webp",
  "text/plain"
]);

/**
 * Validates the file against the MIME allowlist, then verifies the first
 * bytes match what that MIME type actually looks like.
 *
 * Protects against clients spoofing `file.type` to bypass format restrictions.
 */
export function validateFile(buffer: ArrayBuffer, claimedMime: string): AllowedMime {
  // 1. Allowlist check on claimed MIME.
  if (!ALLOWED_MIMES.has(claimedMime)) {
    throw new LexGuardError(
      "UNSUPPORTED_FORMAT",
      "That file type isn't supported. Upload a PDF, Word document, image, or plain text file."
    );
  }

  const mime = claimedMime as AllowedMime;

  // 2. Magic-byte check — skip only for formats with no stable signature.
  if (NO_MAGIC_CHECK.includes(mime)) return mime;

  // Cap at actual buffer size — small files would throw a RangeError otherwise.
  const view = new Uint8Array(buffer, 0, Math.min(12, buffer.byteLength));

  const entry = MAGIC.find((m) => m.mime === mime);
  if (!entry) return mime; // no rule for this type — pass through

  const match = entry.bytes.every((b, i) => view[entry.offset + i] === b);
  if (!match) {
    throw new LexGuardError(
      "UNSUPPORTED_FORMAT",
      "The file content doesn't match the expected format. Try uploading the original file."
    );
  }

  // Extra check for WebP: RIFF magic is shared with WAV/AVI — verify WEBP tag at offset 8.
  if (mime === "image/webp") {
    const webpTag = [0x57, 0x45, 0x42, 0x50]; // WEBP
    const webpMatch = webpTag.every((b, i) => view[8 + i] === b);
    if (!webpMatch) {
      throw new LexGuardError(
        "UNSUPPORTED_FORMAT",
        "The file content doesn't match the expected format."
      );
    }
  }

  return mime;
}
