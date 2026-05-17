import { NextResponse } from "next/server";
import { extractText } from "@/lib/extractors";
import { MAX_UPLOAD_BYTES } from "@/lib/constants";
import { LexGuardError, toAnalysisError } from "@/lib/utils/errors";
import type { ExtractResponse } from "@/types/api";

export const runtime = "nodejs";
export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<NextResponse<ExtractResponse>> {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      throw new LexGuardError("UNSUPPORTED_FORMAT", "No file was attached.");
    }
    if (file.size === 0) {
      throw new LexGuardError("UNSUPPORTED_FORMAT", "The uploaded file is empty.");
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new LexGuardError("PAYLOAD_TOO_LARGE", "File is too large.");
    }

    const buffer = await file.arrayBuffer();
    const out = await extractText(buffer, file.type);
    return NextResponse.json({ ok: true, data: out });
  } catch (err) {
    const error = toAnalysisError(err);
    const status = error.code === "PAYLOAD_TOO_LARGE" ? 413 : 400;
    return NextResponse.json({ ok: false, error }, { status });
  }
}
