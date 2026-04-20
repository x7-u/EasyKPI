import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { forecast, detectAnomalies, goalSeek } from "@easykpi/shared/forecasting";
import { getFormula } from "@easykpi/shared/formulas";

const ForecastBody = z.object({
  series: z.array(z.object({ period: z.string(), value: z.number() })),
  horizon: z.number().int().min(1).max(24).default(6),
  confidence: z.number().min(0.5).max(0.99).default(0.8),
  // If true + PYTHON_FORECAST_URL is set, we proxy to the Python sidecar.
  prophet: z.boolean().optional(),
});

const AnomalyBody = z.object({
  series: z.array(z.object({ period: z.string(), value: z.number() })),
  threshold: z.number().positive().default(3),
});

const GoalSeekBody = z.object({
  kpiId: z.string(),
  baseInputs: z.record(z.number()),
  inputId: z.string(),
  targetOutput: z.number(),
  min: z.number().optional(),
  max: z.number().optional(),
});

export function registerForecastRoutes(app: FastifyInstance): void {
  app.post("/forecast", async (req, reply) => {
    const body = ForecastBody.parse(req.body);
    if (body.prophet && process.env.PYTHON_FORECAST_URL) {
      try {
        const r = await fetch(`${process.env.PYTHON_FORECAST_URL}/forecast`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        });
        return await r.json();
      } catch (e) {
        app.log.warn({ err: e }, "prophet sidecar unavailable, falling back to holt-winters");
      }
    }
    return forecast(body.series, body.horizon, body.confidence);
  });

  app.post("/forecast/anomalies", async (req) => {
    const body = AnomalyBody.parse(req.body);
    return detectAnomalies(body.series, body.threshold);
  });

  app.post("/forecast/goal-seek", async (req, reply) => {
    const body = GoalSeekBody.parse(req.body);
    const f = getFormula(body.kpiId);
    if (!f) return reply.code(404).send({ error: "formula not found" });
    const solved = goalSeek(
      (v) => f.calculate(v),
      body.baseInputs,
      body.inputId,
      body.targetOutput,
      { min: body.min, max: body.max },
    );
    return { solution: solved };
  });
}
