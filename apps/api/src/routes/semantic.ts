import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { kpis } from "@easykpi/shared/catalog";

/**
 * Semantic search — lightweight keyword-overlap ranker in this build.
 * Phase 5 upgrades to `@xenova/transformers` embeddings in a web worker
 * (zero API cost) with cosine similarity; the response shape stays the same.
 */

const Body = z.object({ query: z.string().min(2).max(256), topK: z.number().int().min(1).max(20).default(5) });

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

export function registerSemanticSearchRoutes(app: FastifyInstance): void {
  app.post("/semantic/search", async (req) => {
    const body = Body.parse(req.body);
    const qTokens = tokenize(body.query);
    if (qTokens.length === 0) return [];
    const scored = kpis.map((k) => {
      const bag = tokenize(
        `${k.name} ${k.description} ${k.variableTags.join(" ")} ${k.generalTags.join(" ")} ${k.category}`,
      );
      let score = 0;
      for (const t of qTokens) if (bag.includes(t)) score++;
      // domain hints
      if (/(churn|lose|leaving)/.test(body.query) && /churn|retention/i.test(k.name)) score += 3;
      if (/(customer|loyalty|love)/.test(body.query) && /nps|satisfaction|retention/i.test(k.name)) score += 2;
      if (/(cost|cheap|expensive|spend)/.test(body.query) && /cost|cac|spend/i.test(k.name)) score += 2;
      return { kpi: k, score };
    });
    return scored
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, body.topK)
      .map((r) => ({ id: r.kpi.id, name: r.kpi.name, category: r.kpi.category, score: r.score }));
  });
}
