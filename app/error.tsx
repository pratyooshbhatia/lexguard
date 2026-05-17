"use client";

import { Button } from "@/components/ui/Button";

export default function ErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main" className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-ink-muted">{error.message}</p>
      <Button onClick={reset} className="mt-6">
        Try again
      </Button>
    </main>
  );
}
