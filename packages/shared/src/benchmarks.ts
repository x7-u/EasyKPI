import type { Benchmark } from "./types.js";

/**
 * Seeded industry benchmarks for 15 popular KPIs.
 * Values are pooled medians from public SaaS / operations / marketing reports
 * (Gartner, Klipfolio, OpenView, Profitwell). Treat as illustrative defaults —
 * override per workspace once the governance UI ships in Phase 3.
 */
export const benchmarks: readonly Benchmark[] = [
  // Financial
  { kpiId: "1", p25: 3, p50: 8, p75: 20, source: "seed/SaaS-capital-2024" }, // Revenue Growth
  { kpiId: "2", p25: 2, p50: 10, p75: 20, source: "seed/NYU-Stern-2024" }, // Net Profit Margin
  { kpiId: "3", p25: 20, p50: 40, p75: 65, source: "seed/NYU-Stern-2024" }, // Gross Profit Margin
  { kpiId: "7", p25: 1.2, p50: 1.8, p75: 2.5, source: "seed/industry-avg" }, // Current Ratio
  { kpiId: "15", p25: 30, p50: 45, p75: 65, source: "seed/industry-avg" }, // DSO (lower is better)
  // Sales
  { kpiId: "18", p25: 1.5, p50: 3.5, p75: 8, source: "seed/WordStream-2024" }, // Conversion Rate
  { kpiId: "23", p25: 15, p50: 25, p75: 40, source: "seed/HubSpot-2024" }, // Win Rate
  // Marketing
  { kpiId: "28", p25: 100, p50: 250, p75: 600, source: "seed/Profitwell-2024" }, // CAC
  { kpiId: "29", p25: 2, p50: 4, p75: 7, source: "seed/WordStream-2024" }, // ROAS
  { kpiId: "30", p25: 0.5, p50: 1.5, p75: 3.5, source: "seed/WordStream-2024" }, // CTR
  // Customer
  { kpiId: "41", p25: 10, p50: 30, p75: 50, source: "seed/Delighted-2024" }, // NPS
  { kpiId: "43", p25: 1200, p50: 3500, p75: 9000, source: "seed/Profitwell-2024" }, // CLV
  { kpiId: "44", p25: 65, p50: 80, p75: 92, source: "seed/Profitwell-2024" }, // Retention
  { kpiId: "45", p25: 3, p50: 7, p75: 15, source: "seed/Profitwell-2024" }, // Churn (lower better)
  // Operational
  { kpiId: "54", p25: 50, p50: 70, p75: 85, source: "seed/WCM-2024" }, // OEE
];

const byKpi = new Map<string, Benchmark>(benchmarks.map((b) => [b.kpiId, b]));

export function getBenchmark(kpiId: string): Benchmark | undefined {
  return byKpi.get(kpiId);
}
