"use client";

import { useEffect } from "react";

/**
 * Registers /sw.js on first paint. Guarded for dev mode + browsers that don't
 * support service workers. Idempotent — safe to mount once at the root.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        /* fail silently — PWA install is a progressive enhancement */
      });
    };

    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
