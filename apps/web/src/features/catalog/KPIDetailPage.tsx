import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { getKPI } from "@easykpi/shared/catalog";
import { getFormula, formatResult } from "@easykpi/shared/formulas";
import { getBenchmark } from "@easykpi/shared/benchmarks";
import { forecast, detectAnomalies } from "@easykpi/shared/forecasting";
import type { ChartOverlays } from "@easykpi/shared/types";
import { KPIChart } from "../../charts/KPIChart";
import { DriverWaterfall } from "../../charts/DriverWaterfall";
import { mockSeries } from "../../charts/mockSeries";
import { ExportExcelButton } from "../../components/ExportExcelButton";
import { TrafficLight } from "../../components/TrafficLight";
import { AnomalyList } from "../../components/AnomalyList";
import { Narrative } from "../../components/Narrative";
import { getDriverDAG, decompose } from "@easykpi/shared/drivers";
import { useTargetStore } from "../../stores/useTargetStore";
import { TargetEditor } from "./TargetEditor";

export function KPIDetailPage() {
  const { id } = useParams();
  const kpi = id ? getKPI(id) : undefined;

  if (!kpi) {
    return (
      <div className="text-center text-slate-400">
        KPI not found.{" "}
        <Link to="/catalog" className="text-sky-400 hover:underline">
          Back to catalog
        </Link>
      </div>
    );
  }

  const formula = getFormula(kpi.id);
  const benchmark = getBenchmark(kpi.id);
  const target = useTargetStore((s) => s.targets[kpi.id]);

  const data = useMemo(() => mockSeries(kpi, 12), [kpi]);
  const fc = useMemo(() => forecast(data, 6, 0.8), [data]);
  const anomalies = useMemo(() => detectAnomalies(data, 2.5), [data]);

  const overlays: ChartOverlays = {
    bands: benchmark ? { p25: benchmark.p25, p50: benchmark.p50, p75: benchmark.p75 } : undefined,
    target: target ? { value: target.value, label: "Target" } : undefined,
    forecast: { points: fc.points, low: fc.low, high: fc.high },
    anomalies: anomalies.map((a) => ({ period: a.period, severity: a.severity })),
  };

  const latest = data.at(-1)?.value ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link to="/catalog" className="hover:text-sky-400">Catalog</Link>
        <span>/</span>
        <span>{kpi.category}</span>
        <span>/</span>
        <span className="text-slate-200">{kpi.name}</span>
      </div>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{kpi.name}</h1>
          <p className="mt-2 max-w-2xl text-slate-300">{kpi.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="rounded bg-slate-800 px-2 py-0.5">{kpi.category}</span>
            <span className="rounded bg-slate-800 px-2 py-0.5">{kpi.type}</span>
            <TrafficLight kpi={kpi} actual={latest} size="md" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/calculator/${kpi.id}`}
            className="rounded-md border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-sm font-medium text-sky-300 hover:bg-sky-500/20"
          >
            Open calculator
          </Link>
          <ExportExcelButton kpi={kpi} data={data} overlays={overlays} />
        </div>
      </header>

      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            Trend &middot; forecast &middot; benchmarks &middot; anomalies
          </h2>
          <span className="text-xs text-slate-500">{kpi.chartType}</span>
        </div>
        <KPIChart kpi={kpi} data={data} overlays={overlays} height={320} />
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">Formula</h3>
          <code className="block whitespace-pre-wrap rounded bg-slate-950/80 p-3 text-xs text-sky-200">
            {formula?.formula ?? "(no formula)"}
          </code>
          {formula && (
            <p className="mt-3 text-xs text-slate-400">
              Unit: <span className="text-slate-200">{formula.unit || "—"}</span> &middot; precision{" "}
              <span className="text-slate-200">{formula.precision}</span>
            </p>
          )}
          <p className="mt-3 text-xs text-slate-400">
            Latest: <span className="text-slate-100">{formatResult(kpi.id, latest)}</span>
          </p>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">
            Benchmarks
          </h3>
          {benchmark ? (
            <dl className="space-y-1 text-xs">
              <div className="flex justify-between"><dt className="text-slate-400">p25</dt><dd>{benchmark.p25}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-400">Median</dt><dd>{benchmark.p50}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-400">p75</dt><dd>{benchmark.p75}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-400">Source</dt><dd className="text-slate-500">{benchmark.source}</dd></div>
            </dl>
          ) : (
            <p className="text-xs text-slate-500">
              No seeded benchmark yet. Phase 3 will add a governance UI for custom benchmarks.
            </p>
          )}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">Target</h3>
          <TargetEditor kpi={kpi} actual={latest} />
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">
            Anomalies (z &gt; 2.5)
          </h3>
          <AnomalyList data={data} />
        </section>
        <Narrative kpi={kpi} data={data} />
      </div>

      {(() => {
        const dag = getDriverDAG(kpi.id);
        if (!dag) return null;
        const prior = Object.fromEntries(
          Object.values(dag.nodes)
            .filter((n) => n.kind === "input")
            .map((n, i) => [n.id, 100 + i * 10]),
        );
        const current = Object.fromEntries(
          Object.values(dag.nodes)
            .filter((n) => n.kind === "input")
            .map((n, i) => [n.id, 110 + i * 8]),
        );
        const contributions = decompose(dag, prior, current);
        return (
          <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">
              Driver decomposition
            </h3>
            <DriverWaterfall contributions={contributions} unit={formula?.unit} />
          </section>
        );
      })()}

      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">
          Key variables
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {kpi.variableTags.map((t) => (
            <span key={t} className="rounded bg-slate-800 px-2 py-0.5 text-xs">{t}</span>
          ))}
        </div>
        <h3 className="mb-2 mt-4 text-sm font-semibold uppercase tracking-wide text-slate-300">
          Focus areas
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {kpi.generalTags.map((t) => (
            <span key={t} className="rounded bg-violet-500/10 px-2 py-0.5 text-xs text-violet-200">
              {t}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
