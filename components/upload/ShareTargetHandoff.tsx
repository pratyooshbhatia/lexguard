"use client";

import { UploadPanel } from "./UploadPanel";

/**
 * Mounts the upload panel pre-filled with text shared from another app.
 * Lives behind /share so the Android share-target manifest entry points here.
 */
export function ShareTargetHandoff({
  initialText,
  title
}: {
  initialText: string;
  title?: string;
}) {
  return (
    <main id="main" className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
      <h1 className="font-display text-2xl font-semibold">
        Shared {title ? `“${title}”` : "from another app"}
      </h1>
      <p className="mt-2 text-ink-muted">We've pre-filled the text. Review and analyze.</p>
      <div className="mt-8">
        <UploadPanel initialText={initialText} />
      </div>
    </main>
  );
}
