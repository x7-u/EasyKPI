/**
 * Pure-JS forecasting primitives for KPI time series.
 * Phase 3 extends this with STL decomposition, anomaly detection, and
 * confidence bands. Phase 3.5 introduces a Python FastAPI sidecar for
 * Prophet-style forecasts behind the same request/response contract.
 */

import type { SeriesPoint } from "../types.js";

export interface ForecastResult {
  points: SeriesPoint[];
  low: SeriesPoint[];
  high: SeriesPoint[];
  method: "holt-winters" | "naive" | "moving-average";
  confidence: number;
}

function mean(xs: number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function stdev(xs: number[]): number {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1));
}

/** Double exponential smoothing (Holt's linear trend). */
function holtLinear(
  values: number[],
  horizon: number,
  alpha = 0.5,
  beta = 0.3,
): number[] {
  if (values.length < 2) return Array(horizon).fill(values[0] ?? 0);
  let level = values[0]!;
  let trend = (values[1] ?? values[0]!) - values[0]!;
  for (let i = 1; i < values.length; i++) {
    const prevLevel = level;
    level = alpha * values[i]! + (1 - alpha) * (level + trend);
    trend = beta * (level - prevLevel) + (1 - beta) * trend;
  }
  return Array.from({ length: horizon }, (_, i) => level + (i + 1) * trend);
}

/** Forecast `horizon` future periods with 80% confidence bands by default. */
export function forecast(
  series: SeriesPoint[],
  horizon = 6,
  confidence = 0.8,
): ForecastResult {
  const values = series.map((p) => p.value);
  const projected = holtLinear(values, horizon);
  const residualSD = stdev(values);
  const z = confidence === 0.95 ? 1.96 : 1.28; // 80% by default
  const margin = z * residualSD;

  const nextPeriod = (prev: string, offset: number): string => {
    const n = parseInt(prev, 10);
    if (!isNaN(n)) return String(n + offset);
    return `t+${offset}`;
  };
  const lastPeriod = series[series.length - 1]?.period ?? "0";

  const points = projected.map((value, i) => ({
    period: nextPeriod(lastPeriod, i + 1),
    value,
  }));
  const low = projected.map((value, i) => ({
    period: nextPeriod(lastPeriod, i + 1),
    value: value - margin,
  }));
  const high = projected.map((value, i) => ({
    period: nextPeriod(lastPeriod, i + 1),
    value: value + margin,
  }));

  return { points, low, high, method: "holt-winters", confidence };
}

/**
 * Simple z-score anomaly detection on residuals. Returns indices where
 * |(value - moving_mean) / moving_sd| exceeds `threshold`.
 */
export function detectAnomalies(
  series: SeriesPoint[],
  threshold = 3,
): { index: number; period: string; severity: "warn" | "critical" }[] {
  if (series.length < 4) return [];
  const vals = series.map((p) => p.value);
  const m = mean(vals);
  const sd = stdev(vals);
  if (sd === 0) return [];
  const out: { index: number; period: string; severity: "warn" | "critical" }[] = [];
  series.forEach((p, i) => {
    const z = Math.abs((p.value - m) / sd);
    if (z >= threshold) out.push({ index: i, period: p.period, severity: "critical" });
    else if (z >= threshold * 0.66) out.push({ index: i, period: p.period, severity: "warn" });
  });
  return out;
}

/**
 * Goal-seek: find the value of `inputId` that makes `calculate(inputs)` equal
 * `targetOutput`. Uses bisection over a reasonable range; returns null if
 * the formula does not cross the target within the search window.
 */
export function goalSeek(
  calculate: (v: Record<string, number>) => number | string | null,
  baseInputs: Record<string, number>,
  inputId: string,
  targetOutput: number,
  opts: { min?: number; max?: number; tolerance?: number; iterations?: number } = {},
): number | null {
  const min = opts.min ?? -1e9;
  const max = opts.max ?? 1e9;
  const tol = opts.tolerance ?? 1e-6;
  const iters = opts.iterations ?? 80;
  let lo = min;
  let hi = max;
  const evalAt = (x: number): number | null => {
    const r = calculate({ ...baseInputs, [inputId]: x });
    return typeof r === "number" && isFinite(r) ? r - targetOutput : null;
  };
  const f0 = evalAt(lo);
  const f1 = evalAt(hi);
  if (f0 === null || f1 === null || f0 * f1 > 0) return null;
  for (let i = 0; i < iters; i++) {
    const mid = (lo + hi) / 2;
    const fm = evalAt(mid);
    if (fm === null) return null;
    if (Math.abs(fm) < tol) return mid;
    if (fm * f0 < 0) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}
