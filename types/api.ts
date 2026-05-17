import type { AnalysisError, AnalysisResult } from "./analysis";

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: AnalysisError };

export type AnalyzeResponse = ApiResult<AnalysisResult>;
export type ExtractResponse = ApiResult<{ text: string; pageCount?: number }>;
export type HealthResponse = { ok: true; version: string; uptime: number };
