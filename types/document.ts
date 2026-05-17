export type SupportedMimeType =
  | "application/pdf"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "image/png"
  | "image/jpeg"
  | "image/webp"
  | "text/plain";

export type DocumentSource = "upload" | "paste" | "share_target";

export interface ExtractedDocument {
  text: string;
  source: DocumentSource;
  filename?: string;
  mimeType?: SupportedMimeType | string;
  pageCount?: number;
}

export interface UploadProgress {
  stage: "idle" | "extracting" | "analyzing" | "finalizing" | "done" | "error";
  percent: number; // 0-100, used for the progress bar
  message?: string;
}
