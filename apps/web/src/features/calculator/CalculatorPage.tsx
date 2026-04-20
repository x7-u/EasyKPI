import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { kpis, getKPI } from "@easykpi/shared/catalog";
import { getFormula, calculate, formatResult, calculateSeries } from "@easykpi/shared/formulas";
import { goalSeek } from "@easykpi/shared/forecasting";
import type { KPI, SeriesPoint } from "@easykpi/shared/types";
import { KPIChart } from "../../charts/KPIChart";
import { ExportExcelButton } from "../../components/ExportExcelButton";

type Mode = "single" | "series" | "goal-seek";

export function CalculatorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const kpi = id ? getKPI(id) : undefined;

  if (!kpi) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Calculator</h1>
        <p className="text-slate-400">Pick a KPI to calculate:</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.slice(0, 24).map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => navigate(`/calculator/${k.id}`)}
              className="rounded-md border border-slate-800 bg-slate-900/40 p-3 text-left text-sm hover:border-sky-500/50"
            >
              <span className="text-xs text-slate-500">{k.category}</span>
              <p className="font-medium">{k.name}</p>
            </button>
          ))}
        </div>
        <Link to="/catalog" className="text-sky-400 hover:underline">Full catalog →</Link>
      </div>
    );
  }

  return <CalculatorFor kpi={kpi} />;
}

function CalculatorFor({ kpi }: { kpi: KPI }) {
  const formula = getFormula(kpi.id);
  const [mode, setMode] = useState<Mode>("single");
  const [values, setValues] = useState<Record<string, string>>({});
  const [seriesText, setSeriesText] = useState<string>("");
  const [goalTarget, setGoalTarget] = useState<string>("");
  const [goalInputId, setGoalInputId] = useState<string>(formula?.inputs[0]?.id ?? "");

  const singleResult = useMemo(() => {
    if (!formula) return null;
    return calculate(kpi.id, values);
  }, [kpi.id, values, formula]);

  const seriesPoints: SeriesPoint[] = useMemo(() => {
    if (!formula || !seriesText.trim()) return [];
    const lines = seriesText.trim().split(/\n+/);
    const cols = lines[0]?.split(/[,\t]/).map((s) => s.trim()) ?? [];
    const inputIds = formula.inputs.map((i) => i.id);
    const hasPeriod = cols[0]?.toLowerCase() === "period";
    const out: SeriesPoint[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cells = lines[i]!.split(/[,\t]/).map((s) => s.trim());
      if (cells.every((c) => c === "")) continue;
      const period = hasPeriod ? cells[0]! : `P${i}`;
      const row: Record<string, number> = {};
      const offset = hasPeriod ? 1 : 0;
      inputIds.forEach((id, idx) => {
        const raw = cells[idx + offset];
        row[id] = raw === undefined ? NaN : Number(raw);
      });
      const v = calculateSeries(kpi.id, [row])[0];
      if (v !== null && v !== undefined) out.push({ period, value: v });
    }
    return out;
  }, [formula, seriesText, kpi.id]);

  const goalSeekResult = useMemo(() => {
    if (!formula) return null;
    const tgt = Number(goalTarget);
    if (!isFinite(tgt)) return null;
    const base: Record<string, number> = {};
    for (const inp of formula.inputs) {
      const raw = values[inp.id];
      base[inp.id] = raw === undefined ? NaN : Number(raw);
    }
    return goalSeek(
      (v) => formula.calculate(v),
      base,
      goalInputId,
      tgt,
      { min: -1e6, max: 1e6 },
    );
  }, [formula, goalTarget, goalInputId, values]);

  const seriesTemplate = useMemo(() => {
    if (!formula) return "";
    return ["period," + formula.inputs.map((i) => i.id).join(","), "2024-01,...", "2024-02,..."].join("\n");
  }, [formula]);

  if (!formula) {
    return (
      <div className="text-slate-400">
        No formula registered for {kpi.name}.{" "}
        <Link to="/catalog" className="text-sky-400 hover:underline">Back</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link to="/catalog" className="hover:text-sky-400">Catalog</Link>
        <span>/</span>
        <Link to={`/kpis/${kpi.id}`} className="hover:text-sky-400">{kpi.name}</Link>
        <span>/</span>
        <span className="text-slate-200">Calculator</span>
      </div>

      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{kpi.name}</h1>
        <code className="mt-2 block rounded bg-slate-950/80 p-3 text-xs text-sky-200">
          {formula.formula}
        </code>
      </header>

      <div className="inline-flex rounded-md border border-slate-800 bg-slate-900/60 p-1 text-xs">
        {(["single", "series", "goal-seek"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded px-3 py-1.5 capitalize transition ${
              mode === m ? "bg-sky-500 text-white" : "text-slate-400 hover:text-slate-100"
            }`}
          >
            {m.replace("-", " ")}
          </button>
        ))}
      </div>

      {mode === "single" && (
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            {formula.inputs.map((inp) => (
              <label key={inp.id} className="block text-sm">
                <span className="text-slate-300">{inp.label}</span>
                <input
                  type="number"
                  step="any"
                  value={values[inp.id] ?? ""}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [inp.id]: e.target.value }))
                  }
                  className="mt-1 w-full rounded border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-100"
                />
              </label>
            ))}
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Result
            </h3>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-white">
              {singleResult === null ? "—" : formatResult(kpi.id, singleResult)}
            </p>
            <p className="mt-1 text-xs text-slate-500">Unit: {formula.unit || "—"}</p>
          </div>
        </section>
      )}

      {mode === "series" && (
        <section className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="block text-sm">
              <span className="text-slate-300">
                Paste CSV (period + {formula.inputs.length} columns, one row per period)
              </span>
              <textarea
                value={seriesText}
                onChange={(e) => setSeriesText(e.target.value)}
                placeholder={seriesTemplate}
                rows={12}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950/60 px-3 py-2 font-mono text-xs text-slate-100"
              />
            </label>
            <p className="mt-2 text-xs text-slate-500">
              Tip: first column must be <code>period</code>, remaining columns match input ids:{" "}
              {formula.inputs.map((i) => i.id).join(", ")}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Series result ({seriesPoints.length} periods)
              </h3>
              {seriesPoints.length > 0 && (
                <ExportExcelButton kpi={kpi} data={seriesPoints} label="Export" />
              )}
            </div>
            {seriesPoints.length > 0 ? (
              <KPIChart kpi={kpi} data={seriesPoints} height={260} />
            ) : (
              <p className="text-sm text-slate-500">Paste data to see a chart.</p>
            )}
          </div>
        </section>
      )}

      {mode === "goal-seek" && (
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <p className="text-sm text-slate-400">
              Fill in all but one input; pick the unknown, set your target for the output, and
              solve.
            </p>
            {formula.inputs.map((inp) => (
              <label key={inp.id} className="block text-sm">
                <span className="text-slate-300">{inp.label}</span>
                <input
                  type="number"
                  step="any"
                  value={values[inp.id] ?? ""}
                  disabled={goalInputId === inp.id}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [inp.id]: e.target.value }))
                  }
                  className="mt-1 w-full rounded border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-100 disabled:opacity-50"
                />
              </label>
            ))}
          </div>
          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <label className="block text-sm">
              <span className="text-slate-300">Solve for</span>
              <select
                value={goalInputId}
                onChange={(e) => setGoalInputId(e.target.value)}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-100"
              >
                {formula.inputs.map((i) => (
                  <option key={i.id} value={i.id}>{i.label}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-slate-300">Target result</span>
              <input
                type="number"
                step="any"
                value={goalTarget}
                onChange={(e) => setGoalTarget(e.target.value)}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-100"
              />
            </label>
            <div className="rounded bg-slate-950/60 p-3 text-sm">
              <span className="text-slate-400">Solution: </span>
              <span className="text-lg font-semibold text-emerald-300">
                {goalSeekResult === null || goalSeekResult === undefined
                  ? "—"
                  : goalSeekResult.toFixed(formula.precision)}
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
