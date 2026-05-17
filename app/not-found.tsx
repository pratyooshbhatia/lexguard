import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-3xl font-semibold">Page not found</h1>
      <p className="mt-2 text-ink-muted">The page you're looking for doesn't exist.</p>
      <Button asChild className="mt-6">
        <Link href="/">Back to home</Link>
      </Button>
    </main>
  );
}
