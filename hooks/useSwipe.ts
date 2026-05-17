"use client";

import { useRef, type PointerEvent } from "react";

const SWIPE_THRESHOLD_PX = 50;

export function useSwipe({
  onSwipeLeft,
  onSwipeRight
}: {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}) {
  const startX = useRef<number | null>(null);

  return {
    onPointerDown: (e: PointerEvent) => {
      startX.current = e.clientX;
    },
    onPointerUp: (e: PointerEvent) => {
      if (startX.current === null) return;
      const dx = e.clientX - startX.current;
      if (dx <= -SWIPE_THRESHOLD_PX) onSwipeLeft?.();
      else if (dx >= SWIPE_THRESHOLD_PX) onSwipeRight?.();
      startX.current = null;
    },
    onPointerCancel: () => {
      startX.current = null;
    }
  };
}
