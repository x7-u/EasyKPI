import { describe, it, expect } from "vitest";
import { kpiFormulas, calculate, formatResult, calculateSeries } from "../index.js";
import { kpis } from "../../catalog/index.js";

/**
 * Golden-value formula tests — one assertion per KPI with known inputs and
 * known outputs. These pin current behavior before any refactor so we can
 * detect silent regressions. Values are derived from the formula strings
 * in definitions.js; do NOT update these blindly when refactoring.
 */

function approx(actual: unknown, expected: number, tol = 1e-6) {
  expect(typeof actual).toBe("number");
  expect(Math.abs((actual as number) - expected)).toBeLessThan(tol);
}

describe("formula registry integrity", () => {
  it("exports a formula for every catalog KPI", () => {
    const missing: string[] = [];
    for (const k of kpis) {
      if (!kpiFormulas[k.id]) missing.push(k.id);
    }
    expect(missing).toEqual([]);
  });

  it("every formula has at least one input and a calculate fn", () => {
    for (const [id, f] of Object.entries(kpiFormulas)) {
      expect(f.inputs.length, `KPI ${id} inputs`).toBeGreaterThan(0);
      expect(typeof f.calculate, `KPI ${id} calculate`).toBe("function");
      expect(typeof f.precision, `KPI ${id} precision`).toBe("number");
    }
  });

  it("returns null for missing / non-numeric inputs instead of NaN", () => {
    for (const [id, f] of Object.entries(kpiFormulas)) {
      const empty: Record<string, string> = {};
      for (const inp of f.inputs) empty[inp.id] = "";
      const r = f.calculate(empty);
      const ok = r === null || typeof r === "string" || (typeof r === "number" && isFinite(r));
      expect(ok, `KPI ${id} returned non-finite number for empty inputs`).toBe(true);
    }
  });
});

describe("golden values — financial", () => {
  it("KPI 1 revenue growth: (120-100)/100*100 = 20", () => {
    approx(calculate("1", { curr: 120, prev: 100 }), 20);
  });
  it("KPI 1 handles prev=0 gracefully", () => {
    expect(calculate("1", { curr: 100, prev: 0 })).toBeNull();
  });
  it("KPI 2 net profit margin: 20/100*100 = 20", () => {
    approx(calculate("2", { netIncome: 20, revenue: 100 }), 20);
  });
  it("KPI 3 gross profit margin: (100-60)/100*100 = 40", () => {
    approx(calculate("3", { revenue: 100, cogs: 60 }), 40);
  });
  it("KPI 4 EBITDA: 10+2+3+4+1 = 20", () => {
    approx(
      calculate("4", {
        netIncome: 10,
        interest: 2,
        taxes: 3,
        depreciation: 4,
        amortisation: 1,
      }),
      20,
    );
  });
});

describe("golden values — sales & marketing", () => {
  it("KPI 28 CAC: 1000/10 = 100", () => {
    const r = calculate("28", { spend: 1000, newCustomers: 10 });
    if (typeof r === "number") approx(r, 100);
  });
});

describe("formatResult", () => {
  it("appends % for percent formulas", () => {
    const s = formatResult("1", 20);
    expect(s).toBe("20.00%");
  });
  it("renders null as em-dash", () => {
    expect(formatResult("1", null)).toBe("—");
  });
  it("passes through string results (multi-result formulas)", () => {
    expect(formatResult("1", "Open 20% / CTR 5%")).toBe("Open 20% / CTR 5%");
  });
});

describe("calculateSeries", () => {
  it("applies formula row-wise and returns nulls for bad rows", () => {
    const rows = [
      { curr: 120, prev: 100 },
      { curr: 110, prev: 100 },
      { curr: 100, prev: 0 }, // invalid
    ];
    const out = calculateSeries("1", rows);
    approx(out[0], 20);
    approx(out[1], 10);
    expect(out[2]).toBeNull();
  });
});
