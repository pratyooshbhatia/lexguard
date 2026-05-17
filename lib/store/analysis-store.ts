"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AnalysisError, AnalysisResult } from "@/types/analysis";
import type { UploadProgress } from "@/types/document";

interface AnalysisState {
  result: AnalysisResult | null;
  progress: UploadProgress;
  error: AnalysisError | null;
  history: AnalysisResult[]; // last 5 analyses, persisted locally
  hasOnboarded: boolean;

  setProgress: (p: Partial<UploadProgress>) => void;
  setResult: (r: AnalysisResult) => void;
  setError: (e: AnalysisError | null) => void;
  reset: () => void;
  completeOnboarding: () => void;
}

const INITIAL_PROGRESS: UploadProgress = { stage: "idle", percent: 0 };

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set, get) => ({
      result: null,
      progress: INITIAL_PROGRESS,
      error: null,
      history: [],
      hasOnboarded: false,

      setProgress: (p) => set({ progress: { ...get().progress, ...p } }),
      setResult: (r) =>
        set({
          result: r,
          error: null,
          progress: { stage: "done", percent: 100 },
          history: [r, ...get().history.filter((h) => h.id !== r.id)].slice(0, 5)
        }),
      setError: (e) =>
        set({
          error: e,
          progress: e ? { stage: "error", percent: 0, message: e.message } : INITIAL_PROGRESS
        }),
      reset: () => set({ result: null, error: null, progress: INITIAL_PROGRESS }),
      completeOnboarding: () => set({ hasOnboarded: true })
    }),
    {
      name: "lexguard-state",
      storage: createJSONStorage(() => localStorage),
      // Only persist non-sensitive UI prefs + history. Never persist `error` or in-flight `progress`.
      partialize: (s) => ({ hasOnboarded: s.hasOnboarded, history: s.history })
    }
  )
);
