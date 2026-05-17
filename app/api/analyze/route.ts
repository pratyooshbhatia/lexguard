import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeDocument } from "@/lib/gemini/analyze";
import { extractText } from "@/lib/extractors";
import { MAX_UPLOAD_BYTES } from "@/lib/constants";
import { LexGuardError, toAnalysisError } from "@/lib/utils/errors";
import type { AnalyzeResponse } from "@/types/api";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const pasteSchema = z.object({ text: z.string().min(20).max(200_000) });

export async function POST(req: Request): Promise<NextResponse<AnalyzeResponse>> {
  try {
    const contentType = req.headers.get("content-type") ?? "";

    let extracted: { text: string };

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");

      if (!(file instanceof File)) {
        throw new LexGuardError("UNSUPPORTED_FORMAT", "No file was attached.");
      }
      if (file.size === 0) {
        throw new LexGuardError("UNSUPPORTED_FORMAT", "The uploaded file is empty.");
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        throw new LexGuardError(
          "PAYLOAD_TOO_LARGE",
          `Files must be under ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)}MB.`
        );
      }

      const buffer = await file.arrayBuffer();
      // validateFile inside extractText checks MIME allowlist + magic bytes.
      // We pass file.type (browser-supplied) — magic-byte check catches spoofing.
      extracted = await extractText(buffer, file.type);
    } else {
      // Guard against malformed JSON bodies before passing to zod.
      let body: unknown;
      try {
        body = await req.json();
      } catch {
        throw new LexGuardError("UNSUPPORTED_FORMAT", "Invalid request body.");
      }

      const parsed = pasteSchema.safeParse(body);
      if (!parsed.success) {
        throw new LexGuardError(
          "UNSUPPORTED_FORMAT",
          "Paste at least 20 characters of contract text."
        );
      }
      extracted = { text: parsed.data.text };
    }

    const result = await analyzeDocument(extracted.text);
    return NextResponse.json({ ok: true, data: result });
  } catch (err) {
    const error = toAnalysisError(err);
    const status =
      error.code === "PAYLOAD_TOO_LARGE"
        ? 413
        : error.code === "UNSUPPORTED_FORMAT"
          ? 415
          : error.code === "EXTRACTION_FAILED"
            ? 422
            : 500;
    return NextResponse.json({ ok: false, error }, { status });
  }
}
