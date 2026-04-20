/** Shared KPI domain types. */

export type KPICategory =
  | "Financial"
  | "Sales"
  | "Marketing"
  | "Customer"
  | "Operational"
  | "HR & People"
  | "Technology / IT"
  | "E-commerce / Digital";

export type KPIType = "Core" | "Supporting" | "Advanced" | "Lesser-Known";

export interface KPI {
  id: string;
  category: KPICategory;
  name: string;
  type: KPIType;
  description: string;
  variableTags: string[];
  generalTags: string[];
  chartRecommendation: string;
  chartType: string;
}

export interface FormulaInput {
  id: string;
  label: string;
}

export type FormulaResult = number | string | null;

export interface Formula {
  formula: string;
  inputs: FormulaInput[];
  calculate: (values: Record<string, string | number>) => FormulaResult;
  unit: string;
  precision: number;
}

export type FormulaRegistry = Record<string, Formula>;

export interface SeriesPoint {
  period: string;
  value: number;
}

export interface Series {
  kpiId: string;
  points: SeriesPoint[];
}

export interface Dataset {
  id: string;
  name: string;
  source: "csv" | "xlsx" | "google-sheets" | "rest" | "sql" | "manual";
  uploadedAt: string;
  columns: string[];
  rows: Record<string, string | number | null>[];
}

export interface ColumnMapping {
  datasetId: string;
  kpiId: string;
  mappings: Record<string, string>;
}

export interface Target {
  kpiId: string;
  value: number;
  direction: "higher-is-better" | "lower-is-better";
  warnAtPct: number;
}

export interface Benchmark {
  kpiId: string;
  industry?: string;
  region?: string;
  p25: number;
  p50: number;
  p75: number;
  source: string;
}

export interface ChartOverlays {
  bands?: { p25: number; p50: number; p75: number };
  target?: { value: number; label?: string };
  threshold?: { warn: number; critical: number };
  forecast?: {
    points: SeriesPoint[];
    low?: SeriesPoint[];
    high?: SeriesPoint[];
  };
  anomalies?: { period: string; severity: "warn" | "critical" }[];
}

export interface DashboardTile {
  id: string;
  kpiId: string;
  datasetId?: string;
  chartType?: string;
  layout: { x: number; y: number; w: number; h: number };
  title?: string;
}

export interface Dashboard {
  id: string;
  workspaceId?: string;
  name: string;
  tiles: DashboardTile[];
  createdAt: string;
  updatedAt: string;
}
