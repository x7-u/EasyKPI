import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import type { DriverContribution } from "@easykpi/shared/drivers";

/**
 * Waterfall chart showing contribution of each driver input to the change
 * in a KPI between two periods. Phase 3 deepens this with a full
 * decomposition engine; the view component is ready.
 */
export function DriverWaterfall({
  contributions,
  unit,
  height = 220,
}: {
  contributions: DriverContribution[];
  unit?: string;
  height?: number;
}) {
  const categories = contributions.map((c) => c.label);
  const values = contributions.map((c) => c.value);
  const option: EChartsOption = {
    backgroundColor: "transparent",
    grid: { top: 16, right: 16, bottom: 30, left: 48 },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#0f172a",
      borderColor: "#334155",
      textStyle: { color: "#e2e8f0" },
    },
    xAxis: {
      type: "category",
      data: categories,
      axisLine: { lineStyle: { color: "#334155" } },
      axisLabel: { color: "#94a3b8" },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#94a3b8", formatter: unit ? `{value} ${unit}` : "{value}" },
      axisLine: { lineStyle: { color: "#334155" } },
      splitLine: { lineStyle: { color: "#1e293b" } },
    },
    series: [
      {
        name: "Contribution",
        type: "bar",
        data: values.map((v) => ({
          value: v,
          itemStyle: { color: v >= 0 ? "#10b981" : "#ef4444" },
        })),
      },
    ],
  };
  return <ReactECharts option={option} style={{ height, width: "100%" }} theme="dark" />;
}
