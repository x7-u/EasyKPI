import { useMemo } from "react";
import { filterKPIs, ALL_CATEGORIES, ALL_TAGS } from "@easykpi/shared/catalog";
import { useCatalogStore } from "../../stores/useCatalogStore";
import { KPICard } from "../../components/KPICard";
import { SemanticSearch } from "../../components/SemanticSearch";

export function CatalogPage() {
  const {
    mode,
    searchQuery,
    selectedCategories,
    selectedTags,
    showAll,
    setMode,
    setSearchQuery,
    toggleCategory,
    toggleTag,
    setShowAll,
    clearFilters,
  } = useCatalogStore();

  const results = useMemo(() => {
    if (
      !showAll &&
      selectedCategories.length === 0 &&
      selectedTags.length === 0 &&
      searchQuery.trim() === ""
    ) {
      return [];
    }
    return filterKPIs({
      categories: selectedCategories.length ? selectedCategories : undefined,
      tags: selectedTags.length ? selectedTags : undefined,
      query: mode === "search" ? searchQuery : undefined,
    });
  }, [mode, searchQuery, selectedCategories, selectedTags, showAll]);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-900/20 p-6">
        <h1 className="text-2xl font-semibold tracking-tight">KPI Catalog</h1>
        <p className="mt-1 text-sm text-slate-400">
          95 KPIs across 8 business domains. Filter by category, focus area, or search.
        </p>

        <div className="mt-5 flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => setMode("tags")}
            className={`rounded-md px-3 py-1.5 transition ${
              mode === "tags" ? "bg-sky-500 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Browse by tags
          </button>
          <button
            type="button"
            onClick={() => setMode("search")}
            className={`rounded-md px-3 py-1.5 transition ${
              mode === "search" ? "bg-sky-500 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="ml-auto rounded-md bg-slate-800 px-3 py-1.5 text-slate-300 hover:bg-slate-700"
          >
            {showAll ? "Hide all" : "Show all"}
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-md bg-slate-800 px-3 py-1.5 text-slate-300 hover:bg-slate-700"
          >
            Clear
          </button>
        </div>

        {mode === "search" ? (
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Try: "churn", "revenue", "NPS"…'
            className="mt-4 w-full rounded-md border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
          />
        ) : (
          <div className="mt-5 space-y-4">
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Categories
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {ALL_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCategory(c)}
                    className={`rounded-md border px-2.5 py-1 text-xs transition ${
                      selectedCategories.includes(c)
                        ? "border-sky-500 bg-sky-500/20 text-sky-200"
                        : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Focus areas
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {ALL_TAGS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={`rounded-md border px-2.5 py-1 text-xs transition ${
                      selectedTags.includes(t)
                        ? "border-violet-500 bg-violet-500/20 text-violet-200"
                        : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <SemanticSearch />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Results <span className="text-sm font-normal text-slate-400">({results.length})</span>
          </h2>
        </div>
        {results.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center text-sm text-slate-400">
            Pick a category, a focus area, enter a search, or click <strong className="text-slate-200">Show all</strong>.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((kpi) => (
              <KPICard key={kpi.id} kpi={kpi} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
