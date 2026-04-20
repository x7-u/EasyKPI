import { z } from "zod";

export const KPICategorySchema = z.enum([
  "Financial",
  "Sales",
  "Marketing",
  "Customer",
  "Operational",
  "HR & People",
  "Technology / IT",
  "E-commerce / Digital",
]);

export const KPITypeSchema = z.enum(["Core", "Supporting", "Advanced", "Lesser-Known"]);

export const KPISchema = z.object({
  id: z.string(),
  category: KPICategorySchema,
  name: z.string(),
  type: KPITypeSchema,
  description: z.string(),
  variableTags: z.array(z.string()),
  generalTags: z.array(z.string()),
  chartRecommendation: z.string(),
  chartType: z.string(),
});

export const FormulaInputSchema = z.object({
  id: z.string(),
  label: z.string(),
});

export const SeriesPointSchema = z.object({
  period: z.string(),
  value: z.number(),
});

export const SeriesSchema = z.object({
  kpiId: z.string(),
  points: z.array(SeriesPointSchema),
});

export const DatasetSchema = z.object({
  id: z.string(),
  name: z.string(),
  source: z.enum(["csv", "xlsx", "google-sheets", "rest", "sql", "manual"]),
  uploadedAt: z.string(),
  columns: z.array(z.string()),
  rows: z.array(z.record(z.union([z.string(), z.number(), z.null()]))),
});

export const TargetSchema = z.object({
  kpiId: z.string(),
  value: z.number(),
  direction: z.enum(["higher-is-better", "lower-is-better"]),
  warnAtPct: z.number().min(0).max(100),
});

export const BenchmarkSchema = z.object({
  kpiId: z.string(),
  industry: z.string().optional(),
  region: z.string().optional(),
  p25: z.number(),
  p50: z.number(),
  p75: z.number(),
  source: z.string(),
});

export const DashboardTileSchema = z.object({
  id: z.string(),
  kpiId: z.string(),
  datasetId: z.string().optional(),
  chartType: z.string().optional(),
  layout: z.object({
    x: z.number(),
    y: z.number(),
    w: z.number(),
    h: z.number(),
  }),
  title: z.string().optional(),
});

export const DashboardSchema = z.object({
  id: z.string(),
  workspaceId: z.string().optional(),
  name: z.string(),
  tiles: z.array(DashboardTileSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});
