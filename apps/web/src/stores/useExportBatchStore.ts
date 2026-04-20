import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChartOverlays, SeriesPoint } from "@easykpi/shared/types";
import { idbStorage } from "./idbStorage";

export interface ExportBatchItem {
  id: string;
  kpiId: string;
  kpiName: string;
  label: string; // user-facing title for the sheet (e.g. "Revenue Growth — FY24")
  data: SeriesPoint[];
  overlays?: ChartOverlays;
  addedAt: string;
}

interface ExportBatchState {
  items: ExportBatchItem[];
  add: (item: Omit<ExportBatchItem, "id" | "addedAt">) => void;
  remove: (id: string) => void;
  clear: () => void;
  rename: (id: string, label: string) => void;
}

function mkId() {
  return Math.random().toString(36).slice(2, 10);
}

export const useExportBatchStore = create<ExportBatchState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((s) => ({
          items: [
            ...s.items,
            { ...item, id: mkId(), addedAt: new Date().toISOString() },
          ],
        })),
      remove: (id) =>
        set((s) => ({ items: s.items.filter((x) => x.id !== id) })),
      clear: () => set({ items: [] }),
      rename: (id, label) =>
        set((s) => ({
          items: s.items.map((x) => (x.id === id ? { ...x, label } : x)),
        })),
    }),
    { name: "easykpi-export-batch", storage: idbStorage<ExportBatchState>() },
  ),
);
