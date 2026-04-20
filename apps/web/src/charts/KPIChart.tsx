import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import type { KPI, SeriesPoint, ChartOverlays } from "@easykpi/shared/types";
import { getFormula } from "@easykpi/shared/formulas";

/** Format a number to a KPI's precision + unit (%, $, or plain). */
function formatNumberForKPI(kpiId: string, value: unknown): string {
  if (typeof value !== "number" || !isFinite(value)) return "—";
  const f = getFormula(kpiId);
  const precision = f?.precision ?? 2;
  const unit = f?.unit;
  const rounded = Number(value.toFixed(precision));
  if (unit === "%") return `${rounded.toFixed(precision)}%`;
  if (unit === "$") {
    return `$${rounded.toLocaleString("en-US", {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    })}`;
  }
  return unit ? `${rounded.toFixed(precision)} ${unit}` : rounded.toFixed(precision);
}

export interface KPIChartProps {
  kpi: KPI;
  data: SeriesPoint[];
  overlays?: ChartOverlays;
  height?: number | string;
  variant?: "line" | "bar" | "area" | "auto";
  className?: string;
}

function pickVariant(kpi: KPI, requested: KPIChartProps["variant"]): "line" | "bar" | "area" {
  if (requested && requested !== "auto") return requested;
  const t = kpi.chartType?.toLowerCase() ?? "";
  if (t.includes("bar") || t.includes("column") || t.includes("waterfall")) return "bar";
  if (t.includes("area") || t.includes("funnel")) return "area";
  return "line";
}

/**
 * Single ECharts adapter for all KPI charts. Overlay props (bands, target,
 * thresholds, forecast, anomalies) are defined from day one so Phase 3
 * features render without touching this component again.
 */
export function KPIChart({
  kpi,
  data,
  overlays,
  height = 280,
  variant = "auto",
  className,
}: KPIChartProps) {
  const option = useMemo<EChartsOption>(() => {
    const kind = pickVariant(kpi, variant);
    const categories = data.map((p) => p.period);
    const values = data.map((p) => p.value);

    const forecastData = overlays?.forecast?.points ?? [];
    const forecastLow = overlays?.forecast?.low ?? [];
    const forecastHigh = overlays?.forecast?.high ?? [];
    const allCategories = [...categories, ...forecastData.map((p) => p.period)];

    const anomalyPoints = (overlays?.anomalies ?? []).map((a) => {
      const point = data.find((d) => d.period === a.period);
      return { name: a.period, value: [a.period, point?.value ?? 0], severity: a.severity };
    });

    const series: EChartsOption["series"] = [];

    const mainSeries = {
      name: kpi.name,
      type: kind === "bar" ? ("bar" as const) : ("line" as const),
      data: values,
      smooth: kind !== "bar",
      areaStyle: kind === "area" ? { opacity: 0.2 } : undefined,
      itemStyle: { color: "#38bdf8" },
      lineStyle: kind === "bar" ? undefined : { width: 2, color: "#38bdf8" },
      emphasis: { focus: "series" as const },
    };
    series.push(mainSeries);

    if (overlays?.bands) {
      const p25 = Array(categories.length).fill(overlays.bands.p25);
      const p50 = Array(categories.length).fill(overlays.bands.p50);
      const p75 = Array(categories.length).fill(overlays.bands.p75);
      series.push(
        {
          name: "Benchmark p25",
          type: "line",
          data: p25,
          lineStyle: { type: "dashed", color: "#64748b", width: 1 },
          symbol: "none",
          silent: true,
          z: 1,
        },
        {
          name: "Benchmark p50",
          type: "line",
          data: p50,
          lineStyle: { type: "dashed", color: "#94a3b8", width: 1 },
          symbol: "none",
          silent: true,
          z: 1,
        },
        {
          name: "Benchmark p75",
          type: "line",
          data: p75,
          lineStyle: { type: "dashed", color: "#64748b", width: 1 },
          symbol: "none",
          silent: true,
          z: 1,
        },
      );
    }

    if (overlays?.target) {
      const targetLine = Array(allCategories.length).fill(overlays.target.value);
      series.push({
        name: overlays.target.label ?? "Target",
        type: "line",
        data: targetLine,
        lineStyle: { type: "solid", color: "#f59e0b", width: 2 },
        symbol: "none",
        silent: true,
        z: 2,
      });
    }

    if (forecastData.length > 0) {
      const padding = Array(categories.length).fill(null);
      series.push({
        name: "Forecast",
        type: "line",
        data: [...padding, ...forecastData.map((p) => p.value)],
        lineStyle: { type: "dashed", color: "#a855f7", width: 2 },
        itemStyle: { color: "#a855f7" },
        symbol: "circle",
        symbolSize: 4,
        z: 3,
      });
      if (forecastHigh.length > 0 && forecastLow.length > 0) {
        series.push({
          name: "Confidence",
          type: "line",
          data: [...padding, ...forecastHigh.map((p) => p.value)],
          lineStyle: { opacity: 0 },
          stack: "conf",
          symbol: "none",
          silent: true,
          z: 0,
        });
        series.push({
          name: "Confidence-low",
          type: "line",
          data: [...padding, ...forecastLow.map((p) => p.value)],
          lineStyle: { opacity: 0 },
          areaStyle: { color: "rgba(168,85,247,0.15)" },
          stack: "conf",
          symbol: "none",
          silent: true,
          z: 0,
        });
      }
    }

    if (anomalyPoints.length > 0) {
      series.push({
        name: "Anomaly",
        type: "scatter",
        data: anomalyPoints.map((a) => a.value),
        itemStyle: {
          color: ((p: { dataIndex: number }) => {
            const sev = anomalyPoints[p.dataIndex]?.severity;
            return sev === "critical" ? "#ef4444" : "#f59e0b";
          }) as unknown as string,
        },
        symbolSize: 10,
        z: 4,
      });
    }

    return {
      backgroundColor: "transparent",
      grid: { top: 20, right: 16, bottom: 30, left: 56 },
      tooltip: {
        trigger: "axis",
        backgroundColor: "#0f172a",
        borderColor: "#334155",
        textStyle: { color: "#e2e8f0" },
        valueFormatter: (v: unknown) => formatNumberForKPI(kpi.id, v),
      },
      xAxis: {
        type: "category",
        data: allCategories.length ? allCategories : ["(no data)"],
        axisLine: { lineStyle: { color: "#334155" } },
        axisLabel: { color: "#94a3b8" },
      },
      yAxis: {
        type: "value",
        axisLine: { lineStyle: { color: "#334155" } },
        splitLine: { lineStyle: { color: "#1e293b" } },
        axisLabel: {
          color: "#94a3b8",
          formatter: (v: number) => formatNumberForKPI(kpi.id, v),
        },
      },
      legend: { show: false },
      series,
    };
  }, [kpi, data, overlays, variant]);

  return (
    <ReactECharts
      option={option}
      style={{ height, width: "100%" }}
      theme="dark"
      notMerge
      lazyUpdate
      className={className}
    />
  );
}
