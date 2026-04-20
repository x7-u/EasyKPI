import { Link } from "react-router-dom";
import { getKPI } from "@easykpi/shared/catalog";
import { getFormula } from "@easykpi/shared/formulas";
import { useCompareStore } from "../../stores/useCompareStore";
import { KPIChart } from "../../charts/KPIChart";
import { mockSeries } from "../../charts/mockSeries";
import { ExportExcelButton } from "../../components/ExportExcelButton";

export function ComparePage() {
  const { items, remove, clear } = useCompareStore();
  const kpis = items.map((id) => getKPI(id)).filter((k): k is NonNullable<typeof k> => !!k);

  if (kpis.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center text-slate-400">
        <p className="text-lg">Nothing to compare yet.</p>
        <p className="mt-2 text-sm">
          Add up to 3 KPIs from the{" "}
          <Link to="/catalog" className="text-sky-400 hover:underline">
            catalog
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Compare <span className="text-sm font-normal text-slate-400">({kpis.length}/3)</span>
        </h1>
        <button
          type="button"
          onClick={clear}
          className="rounded bg-slate-800 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-700"
        >
          Clear all
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {kpis.map((kpi) => {
          const data = mockSeries(kpi, 12);
          const f = getFormula(kpi.id);
          return (
            <div key={kpi.id} className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-400">{kpi.category}</p>
                  <h2 className="text-lg font-semibold">
                    <Link to={`/kpis/${kpi.id}`} className="hover:text-sky-300">
                      {kpi.name}
                    </Link>
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => remove(kpi.id)}
                  className="text-slate-500 hover:text-red-400"
                  aria-label="Remove"
                >
                  ×
                </button>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-slate-400">{kpi.description}</p>
              <div className="mt-3">
                <KPIChart kpi={kpi} data={data} height={180} />
              </div>
              {f && (
                <code className="mt-2 block whitespace-pre-wrap rounded bg-slate-950/80 p-2 text-[10px] text-sky-200">
                  {f.formula}
                </code>
              )}
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-400">{kpi.chartType}</span>
                <ExportExcelButton
                  kpi={kpi}
                  data={data}
                  label="Excel"
                  className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
