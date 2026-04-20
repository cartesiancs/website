import { create } from "zustand";

type ResolutionState = {
  width: number;
  height: number;
  setResolution: (width: number, height: number) => void;
};

export const useResolutionStore = create<ResolutionState>((set) => ({
  width: 1920,
  height: 1080,
  setResolution: (width, height) => set({ width, height }),
}));
