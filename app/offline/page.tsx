export const metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <main id="main" className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-2xl font-semibold">You're offline</h1>
      <p className="mt-2 text-sm text-ink-muted">
        LexGuard needs an internet connection to analyze documents. Reconnect and try again.
      </p>
    </main>
  );
}
