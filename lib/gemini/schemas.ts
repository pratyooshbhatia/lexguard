import { z } from "zod";

export const severitySchema = z.enum(["low", "medium", "high", "critical"]);

export const categorySchema = z.enum([
  "terms_of_service",
  "privacy_policy",
  "rental_agreement",
  "employment_contract",
  "subscription",
  "vendor_agreement",
  "insurance_policy",
  "nda",
  "loan_agreement",
  "other"
]);

export const clauseTypeSchema = z.enum([
  "auto_renewal",
  "termination",
  "liability",
  "indemnification",
  "data_sharing",
  "arbitration",
  "non_compete",
  "fee_change",
  "ip_assignment",
  "jurisdiction",
  "warranty_disclaimer",
  "penalty",
  "other"
]);

export const riskClauseSchema = z.object({
  clauseType: clauseTypeSchema,
  title: z.string().min(1).max(200),
  severity: severitySchema,
  quotedExcerpt: z.string().min(1).max(1000),
  plainEnglish: z.string().min(1).max(1000),
  whyItMatters: z.string().min(1).max(1000),
  realWorldConsequences: z.array(z.string()).min(1).max(6),
  suggestedActions: z.array(z.string()).min(1).max(6),
  confidence: z.number().min(0).max(1)
});

export const analysisOutputSchema = z.object({
  documentCategory: categorySchema,
  documentTitle: z.string().min(1).max(200),
  overallRiskScore: z.number().min(0).max(100).transform(Math.round),
  summary: z.string().min(1).max(600),
  reasoning: z.string().min(1).max(2000),
  clauses: z.array(riskClauseSchema).max(20)
});

export type AnalysisOutput = z.infer<typeof analysisOutputSchema>;
