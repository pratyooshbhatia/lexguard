import { UploadPanel } from "@/components/upload/UploadPanel";

export const metadata = { title: "Analyze a document" };

export default function AnalyzePage() {
  return (
    <main id="main" className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
      <h1 className="font-display text-3xl font-semibold">Analyze a document</h1>
      <p className="mt-2 text-ink-muted">
        Upload a PDF, Word file, screenshot, or paste text. Your document never
        leaves the request — we don't store it.
      </p>
      <div className="mt-8">
        <UploadPanel />
      </div>
    </main>
  );
}
