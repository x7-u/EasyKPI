import type { KPI } from "@easykpi/shared/types";
import { useTargetStore } from "../stores/useTargetStore";

const CLASSES: Record<string, string> = {
  ok: "bg-emerald-500",
  warn: "bg-amber-500",
  critical: "bg-red-500",
  none: "bg-slate-600",
};

const LABELS: Record<string, string> = {
  ok: "On target",
  warn: "At risk",
  critical: "Below target",
  none: "No target set",
};

export function TrafficLight({
  kpi,
  actual,
  size = "sm",
}: {
  kpi: KPI;
  actual: number | null | undefined;
  size?: "sm" | "md";
}) {
  const status = useTargetStore((s) =>
    actual === null || actual === undefined ? "none" : s.status(kpi.id, actual),
  );
  const dot = size === "sm" ? "h-2 w-2" : "h-3 w-3";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-400" title={LABELS[status]}>
      <span className={`inline-block rounded-full ${dot} ${CLASSES[status]}`} />
      <span className="capitalize">{status === "none" ? "no target" : status}</span>
    </span>
  );
}
