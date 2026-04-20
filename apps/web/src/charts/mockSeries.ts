import type { KPI, SeriesPoint } from "@easykpi/shared/types";

/**
 * Deterministic mock series so every KPI card/chart has something visible
 * before the user uploads their own data. Values are seeded from the KPI id
 * so the same chart always looks the same.
 */
export function mockSeries(kpi: KPI, length = 12): SeriesPoint[] {
  const seed = Number(kpi.id) || 1;
  const t = kpi.chartType.toLowerCase();
  const baseline = t.includes("percent") || kpi.id === "2" || kpi.id === "3" ? 30 : 100;
  const trend = ((seed * 7) % 17) - 8;
  const amplitude = 6 + (seed % 9);
  const out: SeriesPoint[] = [];
  const now = new Date();
  for (let i = 0; i < length; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - (length - 1 - i), 1);
    const period = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const wave = Math.sin((i + seed) / 2) * amplitude;
    const value = Math.max(0, baseline + (trend * i) / 4 + wave);
    out.push({ period, value: Number(value.toFixed(2)) });
  }
  return out;
}
