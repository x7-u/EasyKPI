import type { KPI, SeriesPoint, ChartOverlays } from "@easykpi/shared/types";
import { exportChartToExcel } from "../export/excel";

export function ExportExcelButton({
  kpi,
  data,
  overlays,
  label = "Export to Excel",
  className,
}: {
  kpi: KPI;
  data: SeriesPoint[];
  overlays?: ChartOverlays;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => exportChartToExcel({ kpi, data, overlays, workspace: "local" })}
      className={
        className ??
        "inline-flex items-center gap-1.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/20"
      }
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {label}
    </button>
  );
}
