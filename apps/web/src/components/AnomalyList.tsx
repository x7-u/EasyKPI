import type { SeriesPoint } from "@easykpi/shared/types";
import { detectAnomalies } from "@easykpi/shared/forecasting";

export function AnomalyList({ data }: { data: SeriesPoint[] }) {
  const anomalies = detectAnomalies(data, 2.5);
  if (anomalies.length === 0) {
    return <p className="text-xs text-slate-500">No anomalies detected (z-score &gt; 2.5).</p>;
  }
  return (
    <ul className="space-y-1 text-xs">
      {anomalies.map((a) => {
        const point = data.find((p) => p.period === a.period);
        return (
          <li
            key={a.period}
            className={`flex items-center justify-between rounded border px-2 py-1 ${
              a.severity === "critical"
                ? "border-red-500/40 bg-red-500/10 text-red-200"
                : "border-amber-500/40 bg-amber-500/10 text-amber-200"
            }`}
          >
            <span>{a.period}</span>
            <span>{point?.value.toFixed(2)}</span>
            <span className="uppercase text-[10px]">{a.severity}</span>
          </li>
        );
      })}
    </ul>
  );
}
