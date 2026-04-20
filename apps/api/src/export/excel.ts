import ExcelJS from "exceljs";
import type { KPI, SeriesPoint, ChartOverlays } from "@easykpi/shared/types";
import { getFormula } from "@easykpi/shared/formulas";

/**
 * Phase 6 E2 — rich dashboard Excel export.
 * Sheets:
 *   Summary     — dashboard header + one row per tile (KPI, current, target, status).
 *   Data_{id}   — per-tile full time series.
 *   Charts      — PNG images of every chart embedded via worksheet.addImage.
 *   Metadata    — KPI definitions, formulas, units, precisions, sources.
 * Conditional formatting on status cells; number columns formatted to each KPI's precision.
 */

export interface DashboardExportPayload {
  workspace: string;
  dashboardName: string;
  generatedAt: string;
  generatedBy?: string;
  tiles: {
    kpi: KPI;
    data: SeriesPoint[];
    overlays?: ChartOverlays;
    chartPngBase64?: string;
  }[];
}

function numFmt(precision: number, unit?: string): string {
  const zeros = "0".repeat(Math.max(0, precision));
  const base = precision > 0 ? `#,##0.${zeros}` : "#,##0";
  if (unit === "%") return `${base}"%"`;
  if (unit === "$") return `"$"${base}`;
  return base;
}

function tileStatus(data: SeriesPoint[], target?: { value: number }): "OK" | "WARN" | "CRITICAL" | "—" {
  if (!target) return "—";
  const latest = data.at(-1)?.value;
  if (latest === undefined) return "—";
  if (latest >= target.value) return "OK";
  if (latest >= target.value * 0.9) return "WARN";
  return "CRITICAL";
}

export async function exportDashboardToExcel(payload: DashboardExportPayload): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = payload.generatedBy ?? "EasyKPI";
  wb.created = new Date(payload.generatedAt);

  // Summary
  const summary = wb.addWorksheet("Summary");
  summary.columns = [
    { header: "KPI", width: 30 },
    { header: "Category", width: 18 },
    { header: "Current", width: 14 },
    { header: "Target", width: 14 },
    { header: "Status", width: 12 },
    { header: "Unit", width: 10 },
  ];
  summary.addRow([]);
  summary.spliceRows(1, 0, ["Dashboard", payload.dashboardName]);
  summary.spliceRows(2, 0, ["Workspace", payload.workspace]);
  summary.spliceRows(3, 0, ["Generated at", payload.generatedAt]);
  summary.spliceRows(4, 0, []);
  summary.views = [{ state: "frozen", ySplit: 5 }];

  payload.tiles.forEach((t) => {
    const latest = t.data.at(-1)?.value ?? null;
    const target = t.overlays?.target;
    const status = tileStatus(t.data, target ? { value: target.value } : undefined);
    const row = summary.addRow([
      t.kpi.name,
      t.kpi.category,
      latest,
      target?.value ?? null,
      status,
      getFormula(t.kpi.id)?.unit ?? "",
    ]);
    const statusCell = row.getCell(5);
    statusCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: status === "OK" ? "FF10B981" : status === "WARN" ? "FFF59E0B" : status === "CRITICAL" ? "FFEF4444" : "FF64748B",
      },
    };
    statusCell.font = { color: { argb: "FFFFFFFF" }, bold: true };
  });

  // One Data_{id} sheet per tile
  for (const t of payload.tiles) {
    const f = getFormula(t.kpi.id);
    const sheetName = `Data_${t.kpi.id}`.slice(0, 31);
    const ws = wb.addWorksheet(sheetName);
    ws.columns = [
      { header: "period", width: 14 },
      { header: "value", width: 14 },
      { header: "target", width: 14 },
      { header: "benchmark_p25", width: 14 },
      { header: "benchmark_p50", width: 14 },
      { header: "benchmark_p75", width: 14 },
      { header: "forecast", width: 14 },
      { header: "forecast_low", width: 14 },
      { header: "forecast_high", width: 14 },
      { header: "anomaly", width: 10 },
    ];
    ws.views = [{ state: "frozen", ySplit: 1 }];
    const fc = new Map((t.overlays?.forecast?.points ?? []).map((p) => [p.period, p.value]));
    const fcLow = new Map((t.overlays?.forecast?.low ?? []).map((p) => [p.period, p.value]));
    const fcHigh = new Map((t.overlays?.forecast?.high ?? []).map((p) => [p.period, p.value]));
    const anomalies = new Map((t.overlays?.anomalies ?? []).map((a) => [a.period, a.severity]));
    const allPeriods = [...t.data.map((p) => p.period), ...(t.overlays?.forecast?.points ?? []).map((p) => p.period)];
    const uniq = Array.from(new Set(allPeriods));
    const fmt = numFmt(f?.precision ?? 2, f?.unit);
    for (const period of uniq) {
      const actual = t.data.find((p) => p.period === period);
      const row = ws.addRow([
        period,
        actual?.value ?? null,
        t.overlays?.target?.value ?? null,
        t.overlays?.bands?.p25 ?? null,
        t.overlays?.bands?.p50 ?? null,
        t.overlays?.bands?.p75 ?? null,
        fc.get(period) ?? null,
        fcLow.get(period) ?? null,
        fcHigh.get(period) ?? null,
        anomalies.get(period) ?? null,
      ]);
      [2, 3, 4, 5, 6, 7, 8, 9].forEach((c) => {
        row.getCell(c).numFmt = fmt;
      });
    }
  }

  // Charts sheet — embedded PNGs (optional; headless ECharts renderer lives in Phase 6)
  if (payload.tiles.some((t) => t.chartPngBase64)) {
    const ws = wb.addWorksheet("Charts");
    ws.getColumn(1).width = 40;
    let row = 1;
    for (const t of payload.tiles) {
      if (!t.chartPngBase64) continue;
      ws.getCell(`A${row}`).value = t.kpi.name;
      ws.getCell(`A${row}`).font = { bold: true };
      const imgId = wb.addImage({ base64: t.chartPngBase64, extension: "png" });
      ws.addImage(imgId, { tl: { col: 1, row }, ext: { width: 600, height: 280 } });
      row += 18;
    }
  }

  // Metadata
  const meta = wb.addWorksheet("Metadata");
  meta.columns = [
    { header: "KPI", width: 30 },
    { header: "Formula", width: 60 },
    { header: "Unit", width: 10 },
    { header: "Precision", width: 10 },
    { header: "Category", width: 18 },
    { header: "Chart", width: 20 },
  ];
  meta.views = [{ state: "frozen", ySplit: 1 }];
  for (const t of payload.tiles) {
    const f = getFormula(t.kpi.id);
    meta.addRow([t.kpi.name, f?.formula ?? "", f?.unit ?? "", f?.precision ?? 2, t.kpi.category, t.kpi.chartType]);
  }

  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
