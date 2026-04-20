/**
 * Driver decomposition — expresses each KPI as a DAG of inputs so the UI can
 * render contribution waterfalls. Phase 3 will populate this for all KPIs;
 * for now we ship a minimal set covering the 15 benchmarked KPIs.
 */

export interface DriverNode {
  id: string;
  label: string;
  kind: "input" | "intermediate" | "output";
  formula?: string;
  children?: string[];
}

export interface DriverDAG {
  kpiId: string;
  nodes: Record<string, DriverNode>;
  rootId: string;
}

export const driverDAGs: Record<string, DriverDAG> = {
  // Revenue Growth Rate = (Current - Prior) / Prior
  "1": {
    kpiId: "1",
    rootId: "growth",
    nodes: {
      growth: {
        id: "growth",
        label: "Revenue Growth %",
        kind: "output",
        formula: "(current - prior) / prior * 100",
        children: ["current", "prior"],
      },
      current: { id: "current", label: "Current Period Revenue", kind: "input" },
      prior: { id: "prior", label: "Prior Period Revenue", kind: "input" },
    },
  },
  // Net Profit Margin = Net Income / Revenue
  "2": {
    kpiId: "2",
    rootId: "margin",
    nodes: {
      margin: {
        id: "margin",
        label: "Net Profit Margin %",
        kind: "output",
        formula: "netIncome / revenue * 100",
        children: ["netIncome", "revenue"],
      },
      netIncome: { id: "netIncome", label: "Net Income", kind: "input" },
      revenue: {
        id: "revenue",
        label: "Revenue",
        kind: "intermediate",
        formula: "price * volume",
        children: ["price", "volume"],
      },
      price: { id: "price", label: "Average Price", kind: "input" },
      volume: { id: "volume", label: "Units Sold", kind: "input" },
    },
  },
  // CAC = Acquisition Spend / New Customers
  "28": {
    kpiId: "28",
    rootId: "cac",
    nodes: {
      cac: {
        id: "cac",
        label: "Customer Acquisition Cost",
        kind: "output",
        formula: "spend / newCustomers",
        children: ["spend", "newCustomers"],
      },
      spend: {
        id: "spend",
        label: "Acquisition Spend",
        kind: "intermediate",
        formula: "marketing + sales",
        children: ["marketing", "sales"],
      },
      marketing: { id: "marketing", label: "Marketing Spend", kind: "input" },
      sales: { id: "sales", label: "Sales Spend", kind: "input" },
      newCustomers: { id: "newCustomers", label: "New Customers", kind: "input" },
    },
  },
};

export function getDriverDAG(kpiId: string): DriverDAG | undefined {
  return driverDAGs[kpiId];
}

export interface DriverContribution {
  nodeId: string;
  label: string;
  contributionPct: number;
  value: number;
}

/**
 * Given a DAG and input values for two periods, compute each input's
 * contribution to the output change. Phase 3 ships the full implementation;
 * this placeholder returns equal weight to exercise the chart adapter.
 */
export function decompose(
  dag: DriverDAG,
  prior: Record<string, number>,
  current: Record<string, number>,
): DriverContribution[] {
  const inputs = Object.values(dag.nodes).filter((n) => n.kind === "input");
  return inputs.map((n) => ({
    nodeId: n.id,
    label: n.label,
    value: (current[n.id] ?? 0) - (prior[n.id] ?? 0),
    contributionPct: 100 / inputs.length,
  }));
}
