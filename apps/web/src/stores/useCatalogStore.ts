import { create } from "zustand";
import { persist } from "zustand/middleware";
import { idbStorage } from "./idbStorage";

export type CatalogMode = "tags" | "search";

interface CatalogState {
  mode: CatalogMode;
  searchQuery: string;
  selectedCategories: string[];
  selectedTags: string[];
  showTagsPanel: boolean;
  showAll: boolean;
  setMode: (mode: CatalogMode) => void;
  setSearchQuery: (q: string) => void;
  toggleCategory: (c: string) => void;
  toggleTag: (t: string) => void;
  setShowTagsPanel: (v: boolean) => void;
  setShowAll: (v: boolean) => void;
  clearFilters: () => void;
}

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set) => ({
      mode: "tags",
      searchQuery: "",
      selectedCategories: [],
      selectedTags: [],
      showTagsPanel: true,
      showAll: false,
      setMode: (mode) => set({ mode }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      toggleCategory: (c) =>
        set((s) => ({
          showAll: false,
          selectedCategories: s.selectedCategories.includes(c)
            ? s.selectedCategories.filter((x) => x !== c)
            : [...s.selectedCategories, c],
        })),
      toggleTag: (t) =>
        set((s) => ({
          showAll: false,
          selectedTags: s.selectedTags.includes(t)
            ? s.selectedTags.filter((x) => x !== t)
            : [...s.selectedTags, t],
        })),
      setShowTagsPanel: (showTagsPanel) => set({ showTagsPanel }),
      setShowAll: (showAll) =>
        set({
          showAll,
          ...(showAll ? { selectedCategories: [], selectedTags: [] } : {}),
        }),
      clearFilters: () => set({ selectedCategories: [], selectedTags: [], searchQuery: "" }),
    }),
    {
      name: "easykpi-catalog",
      storage: idbStorage<CatalogState>(),
    },
  ),
);
