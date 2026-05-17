import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main id="main" className="mx-auto max-w-2xl px-4 py-16" aria-busy="true">
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-5/6" />
      <div className="mt-8 space-y-3">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    </main>
  );
}
