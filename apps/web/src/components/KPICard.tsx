import { Link } from "react-router-dom";
import type { KPI } from "@easykpi/shared/types";
import { useCompareStore } from "../stores/useCompareStore";
import { mockSeries } from "../charts/mockSeries";
import { TrafficLight } from "./TrafficLight";

const CATEGORY_COLORS: Record<string, string> = {
  Financial: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Sales: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  Marketing: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  Customer: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  Operational: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "HR & People": "bg-teal-500/15 text-teal-300 border-teal-500/30",
  "Technology / IT": "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  "E-commerce / Digital": "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
};

export function KPICard({ kpi }: { kpi: KPI }) {
  const inCompare = useCompareStore((s) => s.items.includes(kpi.id));
  const toggleCompare = useCompareStore((s) => s.toggle);
  const latestValue = mockSeries(kpi, 12).at(-1)?.value ?? null;
  const catColor = CATEGORY_COLORS[kpi.category] ?? "bg-slate-500/15 text-slate-300";

  return (
    <div className="group relative flex flex-col rounded-lg border border-slate-800 bg-slate-900/60 p-4 transition hover:border-sky-500/50 hover:bg-slate-900">
      <div className="flex items-start justify-between gap-2">
        <span className={`rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${catColor}`}>
          {kpi.category}
        </span>
        <span className="text-[10px] text-slate-500">#{kpi.id}</span>
      </div>
      <Link to={`/kpis/${kpi.id}`} className="mt-2 block">
        <h3 className="text-sm font-semibold text-white hover:text-sky-300">{kpi.name}</h3>
      </Link>
      <p className="mt-1 line-clamp-2 text-xs text-slate-400">{kpi.description}</p>
      <div className="mt-3 flex items-center gap-3 text-xs">
        <TrafficLight kpi={kpi} actual={latestValue} />
        <span className="text-slate-500">·</span>
        <span className="text-slate-400">{kpi.chartType}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-1">
        {kpi.generalTags.slice(0, 3).map((t) => (
          <span key={t} className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => toggleCompare(kpi.id)}
          className={`rounded px-2 py-1 text-xs font-medium transition ${
            inCompare
              ? "bg-sky-500 text-white"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          {inCompare ? "In compare" : "+ Compare"}
        </button>
        <Link
          to={`/calculator/${kpi.id}`}
          className="rounded bg-slate-800 px-2 py-1 text-xs font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
        >
          Calculate
        </Link>
      </div>
    </div>
  );
}
