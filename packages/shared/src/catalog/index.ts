import rawData from "./kpi_data.json" with { type: "json" };
import type { KPI, KPICategory } from "../types.js";

// JSON is validated by shape at build time via types; run Zod at the app boundary if needed.
export const kpis: readonly KPI[] = rawData as readonly KPI[];

export function getKPI(id: string): KPI | undefined {
  return kpis.find((k) => k.id === id);
}

export function getKPIsByCategory(category: KPICategory): KPI[] {
  return kpis.filter((k) => k.category === category);
}

export function searchKPIs(query: string): KPI[] {
  const q = query.toLowerCase().trim();
  if (!q) return [...kpis];
  return kpis.filter((k) => {
    return (
      k.name.toLowerCase().includes(q) ||
      k.description.toLowerCase().includes(q) ||
      k.category.toLowerCase().includes(q) ||
      k.variableTags.some((t) => t.toLowerCase().includes(q)) ||
      k.generalTags.some((t) => t.toLowerCase().includes(q))
    );
  });
}

export function filterKPIs(opts: {
  categories?: string[];
  tags?: string[];
  query?: string;
}): KPI[] {
  let result = opts.query ? searchKPIs(opts.query) : [...kpis];
  if (opts.categories?.length) {
    result = result.filter((k) => opts.categories!.includes(k.category));
  }
  if (opts.tags?.length) {
    result = result.filter((k) => opts.tags!.some((t) => k.generalTags.includes(t)));
  }
  return result;
}

export const ALL_CATEGORIES: readonly KPICategory[] = Array.from(
  new Set(kpis.map((k) => k.category)),
) as KPICategory[];

export const ALL_TAGS: readonly string[] = Array.from(
  new Set(kpis.flatMap((k) => k.generalTags)),
).sort();
