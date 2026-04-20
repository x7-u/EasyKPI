import { useMemo, useState } from "react";
import type { Dataset } from "@easykpi/shared/types";
import { kpis } from "@easykpi/shared/catalog";
import { getFormula, calculateSeries } from "@easykpi/shared/formulas";
import { useDatasetStore } from "../../stores/useDatasetStore";
import { KPIChart } from "../../charts/KPIChart";
import { ExportExcelButton } from "../../components/ExportExcelButton";

export function ColumnMapper({ dataset }: { dataset: Dataset }) {
  const [kpiId, setKpiId] = useState<string>(kpis[0]!.id);
  const setMapping = useDatasetStore((s) => s.setMapping);
  const existingMapping = useDatasetStore((s) => s.getMapping(dataset.id, kpiId));
  const [mapping, setLocal] = useState<Record<string, string>>(existingMapping?.mappings ?? {});

  const kpi = kpis.find((k) => k.id === kpiId);
  const formula = kpi ? getFormula(kpi.id) : undefined;

  const periodCol = mapping["__period__"] ?? dataset.columns[0] ?? "";

  const computed = useMemo(() => {
    if (!kpi || !formula) return [];
    const rows = dataset.rows.map((r) => {
      const inputRow: Record<string, number> = {};
      for (const input of formula.inputs) {
        const col = mapping[input.id];
        if (!col) return null;
        const v = r[col];
        inputRow[input.id] = typeof v === "number" ? v : Number(v ?? NaN);
      }
      return { period: String(r[periodCol] ?? ""), inputs: inputRow };
    });
    const validRows = rows.filter((r): r is NonNullable<typeof r> => !!r);
    const values = calculateSeries(
      kpi.id,
      validRows.map((r) => r.inputs),
    );
    return validRows
      .map((r, i) => ({ period: r.period, value: values[i] }))
      .filter((p): p is { period: string; value: number } => p.value !== null && p.value !== undefined && isFinite(p.value as number));
  }, [kpi, formula, dataset.rows, mapping, periodCol]);

  if (!kpi || !formula) return null;

  const save = () => {
    setMapping({ datasetId: dataset.id, kpiId: kpi.id, mappings: mapping });
  };

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">
        Map {dataset.name} to a KPI
      </h2>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <label className="block text-sm">
            <span className="text-slate-300">KPI</span>
            <select
              value={kpiId}
              onChange={(e) => {
                setKpiId(e.target.value);
                setLocal({});
              }}
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950/60 px-2 py-1"
            >
              {kpis.map((k) => (
                <option key={k.id} value={k.id}>{k.category} · {k.name}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-slate-300">Period column</span>
            <select
              value={periodCol}
              onChange={(e) => setLocal((m) => ({ ...m, __period__: e.target.value }))}
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950/60 px-2 py-1"
            >
              {dataset.columns.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          <h3 className="pt-1 text-xs uppercase text-slate-500">Formula inputs</h3>
          {formula.inputs.map((inp) => (
            <label key={inp.id} className="block text-sm">
              <span className="text-slate-300">{inp.label}</span>
              <select
                value={mapping[inp.id] ?? ""}
                onChange={(e) => setLocal((m) => ({ ...m, [inp.id]: e.target.value }))}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950/60 px-2 py-1"
              >
                <option value="">— not mapped —</option>
                {dataset.columns.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          ))}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={save}
              className="rounded bg-sky-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-400"
            >
              Save mapping
            </button>
            {computed.length > 0 && <ExportExcelButton kpi={kpi} data={computed} />}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
          <h3 className="mb-2 text-xs uppercase text-slate-500">Preview ({computed.length} rows)</h3>
          {computed.length > 0 ? (
            <KPIChart kpi={kpi} data={computed} height={260} />
          ) : (
            <p className="text-sm text-slate-500">
              Pick the period column and all formula inputs to see the live chart.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
