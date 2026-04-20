import { create } from "zustand";

interface PreloaderState {
  isLoading: boolean;
  hasLoaded: boolean;
  setIsLoading: (loading: boolean) => void;
  setHasLoaded: (loaded: boolean) => void;
  completeLoading: () => void;
}

export const usePreloaderStore = create<PreloaderState>((set) => ({
  isLoading: true,
  hasLoaded: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  setHasLoaded: (loaded) => set({ hasLoaded: loaded }),
  completeLoading: () => set({ isLoading: false, hasLoaded: true }),
}));
