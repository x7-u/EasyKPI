import { useState } from "react";
import type { KPI } from "@easykpi/shared/types";
import { useTargetStore } from "../../stores/useTargetStore";

export function TargetEditor({ kpi, actual }: { kpi: KPI; actual: number | null }) {
  const existing = useTargetStore((s) => s.targets[kpi.id]);
  const setTarget = useTargetStore((s) => s.setTarget);
  const removeTarget = useTargetStore((s) => s.removeTarget);
  const status = useTargetStore((s) => (actual === null ? "none" : s.status(kpi.id, actual)));

  const [value, setValue] = useState<string>(existing ? String(existing.value) : "");
  const [direction, setDirection] = useState<"higher-is-better" | "lower-is-better">(
    existing?.direction ?? "higher-is-better",
  );
  const [warnAt, setWarnAt] = useState<string>(existing ? String(existing.warnAtPct) : "10");

  const save = () => {
    const v = Number(value);
    const w = Number(warnAt);
    if (!isFinite(v) || !isFinite(w)) return;
    setTarget({ kpiId: kpi.id, value: v, direction, warnAtPct: w });
  };

  return (
    <div className="space-y-2 text-xs">
      <label className="block">
        <span className="text-slate-400">Target value</span>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-1 w-full rounded border border-slate-700 bg-slate-950/60 px-2 py-1 text-slate-100"
          step="any"
        />
      </label>
      <label className="block">
        <span className="text-slate-400">Direction</span>
        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value as "higher-is-better" | "lower-is-better")}
          className="mt-1 w-full rounded border border-slate-700 bg-slate-950/60 px-2 py-1 text-slate-100"
        >
          <option value="higher-is-better">Higher is better</option>
          <option value="lower-is-better">Lower is better</option>
        </select>
      </label>
      <label className="block">
        <span className="text-slate-400">Warn at (%)</span>
        <input
          type="number"
          value={warnAt}
          onChange={(e) => setWarnAt(e.target.value)}
          className="mt-1 w-full rounded border border-slate-700 bg-slate-950/60 px-2 py-1 text-slate-100"
          step="1"
        />
      </label>
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={save}
          className="rounded bg-sky-500 px-3 py-1 font-medium text-white hover:bg-sky-400"
        >
          Save
        </button>
        {existing && (
          <button
            type="button"
            onClick={() => removeTarget(kpi.id)}
            className="rounded bg-slate-800 px-3 py-1 text-slate-300 hover:bg-slate-700"
          >
            Clear
          </button>
        )}
        <span className="ml-auto text-slate-500">status: {status}</span>
      </div>
    </div>
  );
}
