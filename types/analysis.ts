/**
 * Canonical analysis types. The Gemini structured output schema in
 * `lib/gemini/schemas.ts` is the runtime source of truth — keep it aligned.
 */

export type DocumentCategory =
  | "terms_of_service"
  | "privacy_policy"
  | "rental_agreement"
  | "employment_contract"
  | "subscription"
  | "vendor_agreement"
  | "insurance_policy"
  | "nda"
  | "loan_agreement"
  | "other";

export type RiskSeverity = "low" | "medium" | "high" | "critical";

export type ClauseType =
  | "auto_renewal"
  | "termination"
  | "liability"
  | "indemnification"
  | "data_sharing"
  | "arbitration"
  | "non_compete"
  | "fee_change"
  | "ip_assignment"
  | "jurisdiction"
  | "warranty_disclaimer"
  | "penalty"
  | "other";

export interface RiskClause {
  id: string;
  clauseType: ClauseType;
  title: string;
  severity: RiskSeverity;
  quotedExcerpt: string;
  plainEnglish: string;
  whyItMatters: string;
  realWorldConsequences: string[];
  suggestedActions: string[];
  confidence: number; // 0-1 — how sure the model is
}

export interface AnalysisResult {
  id: string;
  createdAt: string; // ISO
  documentCategory: DocumentCategory;
  documentTitle: string;
  overallRiskScore: number; // 0-100, higher = riskier
  overallRiskBand: RiskSeverity;
  summary: string; // 1-2 sentences, plain English
  reasoning: string; // contextual AI reasoning — shown in "why this score"
  clauses: RiskClause[];
  metadata: {
    wordCount: number;
    characterCount: number;
    durationMs: number;
    modelVersion: string;
  };
}

export interface AnalysisError {
  code:
    | "EXTRACTION_FAILED"
    | "UNSUPPORTED_FORMAT"
    | "PAYLOAD_TOO_LARGE"
    | "MODEL_REFUSED"
    | "MODEL_TIMEOUT"
    | "INVALID_OUTPUT"
    | "UNKNOWN";
  message: string;
  details?: unknown;
}
