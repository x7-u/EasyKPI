import { create } from "zustand";
import { persist } from "zustand/middleware";
import { idbStorage } from "./idbStorage";

interface CompareState {
  items: string[]; // KPI IDs, FIFO, max 3
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set) => ({
      items: [],
      toggle: (id) =>
        set((s) => {
          if (s.items.includes(id)) return { items: s.items.filter((x) => x !== id) };
          const next = [...s.items, id];
          if (next.length > 3) next.shift();
          return { items: next };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((x) => x !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: "easykpi-compare", storage: idbStorage<CompareState>() },
  ),
);
