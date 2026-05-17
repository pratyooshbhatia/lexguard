import { redirect } from "next/navigation";
import { ShareTargetHandoff } from "@/components/upload/ShareTargetHandoff";

/**
 * Android share target landing page.
 *
 * The manifest declares `share_target` with method=POST and enctype=multipart,
 * but Next.js App Router can't directly receive a multipart POST into a page.
 * The pattern we use:
 *   1. manifest.share_target.action -> "/api/share"
 *   2. /api/share parses the shared payload, stashes it in a short-lived
 *      cookie (id only), and redirects to /share?id=...
 *   3. This page picks up the id client-side and hands off to the analyze flow.
 *
 * For text-only shares (the common Android case) we can also just read
 * `?text=` / `?url=` query params synchronously here.
 */
export default function SharePage({
  searchParams
}: {
  searchParams: { text?: string; title?: string; url?: string };
}) {
  const text = searchParams.text ?? searchParams.url ?? "";
  if (!text) redirect("/analyze");
  return <ShareTargetHandoff initialText={text} title={searchParams.title} />;
}
