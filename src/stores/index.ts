import { create } from "zustand";
import { createDockSlice, type DockSlice } from "./slices/dock";
import { createSystemSlice, type SystemSlice } from "./slices/system";
import { createUserSlice, type UserSlice } from "./slices/user";

export const useStore = create<DockSlice & SystemSlice & UserSlice>((...a) => ({
  ...createDockSlice(...a),
  ...createSystemSlice(...a),
  ...createUserSlice(...a)
}));

// Follow OS color-scheme changes at runtime
if (typeof window !== "undefined") {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", (e) => useStore.getState().setDark(e.matches));
}
