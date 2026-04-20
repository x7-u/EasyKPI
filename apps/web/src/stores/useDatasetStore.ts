import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Dataset, ColumnMapping } from "@easykpi/shared/types";
import { idbStorage } from "./idbStorage";

interface DatasetState {
  datasets: Record<string, Dataset>;
  mappings: Record<string, ColumnMapping>; // keyed by `${datasetId}:${kpiId}`
  addDataset: (d: Dataset) => void;
  removeDataset: (id: string) => void;
  setMapping: (m: ColumnMapping) => void;
  getMapping: (datasetId: string, kpiId: string) => ColumnMapping | undefined;
}

export const useDatasetStore = create<DatasetState>()(
  persist(
    (set, get) => ({
      datasets: {},
      mappings: {},
      addDataset: (d) => set((s) => ({ datasets: { ...s.datasets, [d.id]: d } })),
      removeDataset: (id) =>
        set((s) => {
          const { [id]: _, ...rest } = s.datasets;
          return { datasets: rest };
        }),
      setMapping: (m) =>
        set((s) => ({
          mappings: { ...s.mappings, [`${m.datasetId}:${m.kpiId}`]: m },
        })),
      getMapping: (datasetId, kpiId) => get().mappings[`${datasetId}:${kpiId}`],
    }),
    { name: "easykpi-datasets", storage: idbStorage<DatasetState>() },
  ),
);
