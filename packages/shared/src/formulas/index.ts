import { kpiFormulas as rawFormulas } from "./definitions.js";
import type { Formula, FormulaRegistry, FormulaResult } from "../types.js";

// The legacy JS file has the correct runtime shape; cast once at the boundary.
export const kpiFormulas: FormulaRegistry = rawFormulas as unknown as FormulaRegistry;

export function getFormula(kpiId: string): Formula | undefined {
  return kpiFormulas[kpiId];
}

export function calculate(
  kpiId: string,
  values: Record<string, string | number>,
): FormulaResult {
  const f = kpiFormulas[kpiId];
  if (!f) return null;
  try {
    return f.calculate(values);
  } catch {
    return null;
  }
}

/** Apply a formula across a series of period-indexed input rows. */
export function calculateSeries(
  kpiId: string,
  rows: Record<string, string | number>[],
): (number | null)[] {
  const f = kpiFormulas[kpiId];
  if (!f) return rows.map(() => null);
  return rows.map((row) => {
    const r = f.calculate(row);
    return typeof r === "number" && isFinite(r) ? r : null;
  });
}

export function formatResult(kpiId: string, value: FormulaResult): string {
  const f = kpiFormulas[kpiId];
  if (!f) return String(value ?? "");
  if (value === null) return "—";
  if (typeof value === "string") return value;
  const formatted = value.toFixed(f.precision);
  if (f.unit === "%") return `${formatted}%`;
  if (f.unit === "$") {
    return `$${Number(formatted).toLocaleString("en-US", {
      minimumFractionDigits: f.precision,
      maximumFractionDigits: f.precision,
    })}`;
  }
  return f.unit ? `${formatted} ${f.unit}` : formatted;
}

export type { Formula, FormulaInput, FormulaResult, FormulaRegistry } from "../types.js";
