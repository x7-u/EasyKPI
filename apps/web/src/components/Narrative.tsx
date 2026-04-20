import { useState } from "react";
import type { KPI, SeriesPoint } from "@easykpi/shared/types";

const API_BASE = import.meta.env.VITE_API_BASE ?? "/api";

export function Narrative({ kpi, data }: { kpi: KPI; data: SeriesPoint[] }) {
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"default" | "deep-explain">("default");

  const narrate = async (nextMode: "default" | "deep-explain") => {
    setLoading(true);
    setError(null);
    setMode(nextMode);
    try {
      const resp = await fetch(`${API_BASE}/narrate`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-workspace-id": "local", "x-user-id": "local-user" },
        body: JSON.stringify({ kpiId: kpi.id, series: data, mode: nextMode }),
      });
      if (!resp.ok) throw new Error(await resp.text());
      const json = (await resp.json()) as { text: string; stub?: boolean };
      setText(json.stub ? `(stub) ${json.text}` : json.text);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
          AI narrative
        </h3>
        <div className="flex gap-2 text-xs">
          <button
            type="button"
            onClick={() => narrate("default")}
            disabled={loading}
            className="rounded bg-sky-500 px-2 py-1 font-medium text-white hover:bg-sky-400 disabled:opacity-50"
          >
            {loading && mode === "default" ? "…" : "Explain (Sonnet)"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm("Deep explain uses Claude Opus — higher cost. Proceed?")) {
                narrate("deep-explain");
              }
            }}
            disabled={loading}
            className="rounded border border-violet-500/40 bg-violet-500/10 px-2 py-1 font-medium text-violet-200 hover:bg-violet-500/20 disabled:opacity-50"
          >
            {loading && mode === "deep-explain" ? "…" : "Deep (Opus)"}
          </button>
        </div>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {text ? (
        <p className="text-sm leading-relaxed text-slate-200">{text}</p>
      ) : (
        <p className="text-xs text-slate-500">
          Click Explain for a 2-3 sentence summary. Requires apps/api running and an
          ANTHROPIC_API_KEY (otherwise returns a stub).
        </p>
      )}
    </div>
  );
}
