import { useTargetStore } from "../../stores/useTargetStore";
import { useDatasetStore } from "../../stores/useDatasetStore";
import { useCompareStore } from "../../stores/useCompareStore";
import { useCatalogStore } from "../../stores/useCatalogStore";
import { useDashboardStore } from "../../stores/useDashboardStore";

export function SettingsPage() {
  const clearCatalog = useCatalogStore((s) => s.clearFilters);
  const clearCompare = useCompareStore((s) => s.clear);

  const handleWipe = async () => {
    if (!confirm("Clear ALL local EasyKPI data (targets, datasets, dashboards, compare list, filters)?")) return;
    useTargetStore.setState({ targets: {} });
    useDatasetStore.setState({ datasets: {}, mappings: {} });
    useDashboardStore.setState({ dashboards: {}, activeId: null });
    clearCatalog();
    clearCompare();
    indexedDB.deleteDatabase("keyval-store");
    location.reload();
  };

  const targets = useTargetStore((s) => Object.keys(s.targets).length);
  const datasets = useDatasetStore((s) => Object.keys(s.datasets).length);
  const dashboards = useDashboardStore((s) => Object.keys(s.dashboards).length);
  const compare = useCompareStore((s) => s.items.length);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-slate-400">
          Local state — everything stored in your browser's IndexedDB.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Targets", value: targets },
          { label: "Datasets", value: datasets },
          { label: "Dashboards", value: dashboards },
          { label: "Compare items", value: compare },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-xs uppercase text-slate-500">{s.label}</p>
            <p className="text-2xl font-semibold">{s.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-sm font-semibold">Danger zone</h2>
        <p className="mt-1 text-xs text-slate-400">
          Wipe all local state and reload. Your hosted workspace (once you sign in) is not
          affected — this only clears what's cached on this browser.
        </p>
        <button
          type="button"
          onClick={handleWipe}
          className="mt-3 rounded border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-300 hover:bg-red-500/20"
        >
          Clear all local data
        </button>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400">
        <h2 className="mb-1 text-sm font-semibold text-slate-200">About this build</h2>
        <p>
          EasyKPI Analyst Workbench &middot; Phase 0 foundations + Phase 1 visuals + Phase 2 ingest
          + Phase 3 analytics (forecasting, goal-seek, benchmarks, targets) + Phase 6 Excel export
          (client-side). The companion api/forecast/auth features live in apps/api and apps/forecast
          and ship in later phases.
        </p>
      </section>
    </div>
  );
}
