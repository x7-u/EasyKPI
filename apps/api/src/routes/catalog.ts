import type { FastifyInstance } from "fastify";
import { kpis, filterKPIs, getKPI } from "@easykpi/shared/catalog";
import { getFormula } from "@easykpi/shared/formulas";
import { getBenchmark } from "@easykpi/shared/benchmarks";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../lib/auth.js";

export function registerCatalogRoutes(app: FastifyInstance): void {
  app.get("/catalog/kpis", async (req) => {
    const { category, tag, q } = req.query as { category?: string; tag?: string; q?: string };
    return filterKPIs({
      categories: category ? [category] : undefined,
      tags: tag ? [tag] : undefined,
      query: q,
    });
  });

  app.get("/catalog/kpis/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const kpi = getKPI(id);
    if (!kpi) return reply.code(404).send({ error: "not found" });
    const formula = getFormula(id);
    const benchmark = getBenchmark(id);
    return { kpi, formula, benchmark };
  });

  app.get("/catalog/custom", async (req, reply) => {
    const ctx = await requireAuth(req, reply);
    const custom = await prisma.customKPI.findMany({ where: { workspaceId: ctx.workspaceId } });
    return custom;
  });

  app.get("/catalog/count", async () => ({ count: kpis.length }));
}
