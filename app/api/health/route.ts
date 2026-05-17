import { NextResponse } from "next/server";
import type { HealthResponse } from "@/types/api";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const startedAt = Date.now();

export async function GET(): Promise<NextResponse<HealthResponse>> {
  return NextResponse.json({
    ok: true,
    version: process.env.npm_package_version ?? "0.1.0",
    uptime: Date.now() - startedAt
  });
}
