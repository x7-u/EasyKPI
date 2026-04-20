import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GridLayout, { WidthProvider, type Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { kpis, getKPI } from "@easykpi/shared/catalog";
import { getBenchmark } from "@easykpi/shared/benchmarks";
import { getFormula, formatResult } from "@easykpi/shared/formulas";
import type { ChartOverlays, KPI, SeriesPoint } from "@easykpi/shared/types";
import { useDashboardStore } from "../../stores/useDashboardStore";
import { useTargetStore } from "../../stores/useTargetStore";
import { KPIChart } from "../../charts/KPIChart";
import { mockSeries } from "../../charts/mockSeries";
import { exportDashboardToExcel } from "../../export/excel";

const ResponsiveGrid = WidthProvider(GridLayout);

export function DashboardPage() {
  const {
    dashboards,
    activeId,
    create,
    remove,
    rename,
    setActive,
    addTile,
    removeTile,
    setLayout,
  } = useDashboardStore();

  useEffect(() => {
    if (!activeId && Object.keys(dashboards).length === 0) {
      create("My first dashboard");
    } else if (!activeId) {
      setActive(Object.keys(dashboards)[0]!);
    }
  }, [activeId, dashboards, create, setActive]);

  const active = activeId ? dashboards[activeId] : undefined;
  const [showPicker, setShowPicker] = useState(false);
  const [pickerQuery, setPickerQuery] = useState("");
  const targets = useTargetStore((s) => s.targets);

  const pickerResults = useMemo(() => {
    if (!pickerQuery.trim()) return kpis.slice(0, 24);
    const q = pickerQuery.toLowerCase();
    return kpis.filter((k) => k.name.toLowerCase().includes(q)).slice(0, 24);
  }, [pickerQuery]);

  if (!active) return null;

  const handleLayoutChange = (next: Layout[]) => {
    setLayout(
      active.id,
      next.map((l) => ({ id: l.i, x: l.x, y: l.y, w: l.w, h: l.h })),
    );
  };

  const tilesWithData = active.tiles
    .map((t) => {
      const kpi = getKPI(t.kpiId);
      if (!kpi) return null;
      const data: SeriesPoint[] = mockSeries(kpi, 12);
      const benchmark = getBenchmark(kpi.id);
      const target = targets[kpi.id];
      const overlays: ChartOverlays = {
        bands: benchmark ? { p25: benchmark.p25, p50: benchmark.p50, p75: benchmark.p75 } : undefined,
        target: target ? { value: target.value } : undefined,
      };
      return { tile: t, kpi, data, overlays };
    })
    .filter((x): x is { tile: (typeof active.tiles)[number]; kpi: KPI; data: SeriesPoint[]; overlays: ChartOverlays } => !!x);

  const handleDashboardExport = () => {
    exportDashboardToExcel({
      dashboardName: active.name,
      workspace: "local",
      tiles: tilesWithData.map((t) => ({ kpi: t.kpi, data: t.data, overlays: t.overlays })),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <input
              value={active.name}
              onChange={(e) => rename(active.id, e.target.value)}
              className="rounded bg-transparent text-2xl font-semibold tracking-tight focus:bg-slate-900/60 focus:px-2"
            />
          </div>
          <p className="text-xs text-slate-400">
            {active.tiles.length}/12 tiles &middot; drag to rearrange, resize from the corner
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={active.id}
            onChange={(e) => setActive(e.target.value)}
            className="rounded border border-slate-700 bg-slate-900/60 px-2 py-1 text-sm text-slate-200"
          >
            {Object.values(dashboards).map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              const name = prompt("Dashboard name?", "New dashboard");
              if (name) create(name);
            }}
            className="rounded bg-slate-800 px-3 py-1.5 text-sm hover:bg-slate-700"
          >
            + New
          </button>
          <button
            type="button"
            onClick={() => setShowPicker((s) => !s)}
            className="rounded bg-sky-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-400"
          >
            + Add tile
          </button>
          <button
            type="button"
            onClick={handleDashboardExport}
            className="rounded border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-300 hover:bg-emerald-500/20"
          >
            Export to Excel
          </button>
          {Object.keys(dashboards).length > 1 && (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Delete "${active.name}"?`)) remove(active.id);
              }}
              className="rounded bg-slate-800 px-3 py-1.5 text-sm text-red-300 hover:bg-slate-700"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {showPicker && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <input
            type="search"
            value={pickerQuery}
            onChange={(e) => setPickerQuery(e.target.value)}
            placeholder="Search KPIs to add…"
            className="mb-3 w-full rounded border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm"
          />
          <div className="grid max-h-64 grid-cols-1 gap-1.5 overflow-auto sm:grid-cols-2 lg:grid-cols-3">
            {pickerResults.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => {
                  addTile(active.id, {
                    kpiId: k.id,
                    layout: { x: (active.tiles.length * 4) % 12, y: Infinity, w: 4, h: 4 },
                  });
                  setShowPicker(false);
                  setPickerQuery("");
                }}
                className="flex items-start justify-between rounded border border-slate-800 bg-slate-900/40 p-2 text-left text-xs hover:border-sky-500/50"
              >
                <div>
                  <p className="text-[10px] uppercase text-slate-500">{k.category}</p>
                  <p className="font-medium text-slate-200">{k.name}</p>
                </div>
                <span className="text-sky-400">+</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {tilesWithData.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center text-slate-400">
          Empty dashboard. Click <strong className="text-slate-200">+ Add tile</strong> to pick
          a KPI, or visit the{" "}
          <Link to="/catalog" className="text-sky-400 hover:underline">catalog</Link>.
        </div>
      ) : (
        <ResponsiveGrid
          className="layout"
          cols={12}
          rowHeight={50}
          margin={[12, 12]}
          draggableHandle=".drag-handle"
          layout={tilesWithData.map((t) => ({
            i: t.tile.id,
            x: t.tile.layout.x,
            y: t.tile.layout.y,
            w: t.tile.layout.w,
            h: t.tile.layout.h,
            minW: 3,
            minH: 3,
          }))}
          onLayoutChange={handleLayoutChange}
        >
          {tilesWithData.map(({ tile, kpi, data, overlays }) => {
            const f = getFormula(kpi.id);
            const latest = data.at(-1)?.value ?? null;
            return (
              <div key={tile.id} className="flex flex-col rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <div className="drag-handle flex cursor-move items-start justify-between">
                  <div>
                    <p className="text-[10px] uppercase text-slate-500">{kpi.category}</p>
                    <Link to={`/kpis/${kpi.id}`} className="text-sm font-semibold hover:text-sky-300">
                      {kpi.name}
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTile(active.id, tile.id)}
                    className="text-slate-500 hover:text-red-400"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  {latest === null ? "—" : formatResult(kpi.id, latest)}
                  {f && <span className="ml-2 text-slate-500">{f.unit}</span>}
                </div>
                <div className="mt-2 min-h-0 flex-1">
                  <KPIChart kpi={kpi} data={data} overlays={overlays} height="100%" />
                </div>
              </div>
            );
          })}
        </ResponsiveGrid>
      )}
    </div>
  );
}
