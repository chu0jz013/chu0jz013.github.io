import type { StateCreator } from "zustand";

export interface SafariSlice {
  // one-shot request: the plain Safari window navigates here, then clears it
  safariURL: string | null;
  openInSafari: (url: string) => void;
  clearSafariURL: () => void;
}

export const createSafariSlice: StateCreator<SafariSlice> = (set) => ({
  safariURL: null,
  openInSafari: (url) => set(() => ({ safariURL: url })),
  clearSafariURL: () => set(() => ({ safariURL: null }))
});
