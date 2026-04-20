import type { FastifyInstance } from "fastify";
import { z } from "zod";
import crypto from "node:crypto";
import { requireAuth } from "../lib/auth.js";
import { assertUnderCap, recordSpend } from "../lib/llmSpend.js";
import { getKPI } from "@easykpi/shared/catalog";
import { getFormula } from "@easykpi/shared/formulas";

const Body = z.object({
  kpiId: z.string(),
  series: z.array(z.object({ period: z.string(), value: z.number() })),
  mode: z.enum(["default", "deep-explain"]).default("default"),
});

// Tiny in-memory cache keyed by (kpiId, dataHash, model). Replace with Redis in prod.
const cache = new Map<string, { text: string; expiresAt: number }>();
const TTL_MS = 24 * 3600 * 1000;

function hashSeries(series: { period: string; value: number }[]): string {
  return crypto
    .createHash("sha1")
    .update(series.map((p) => `${p.period}:${p.value.toFixed(6)}`).join("|"))
    .digest("hex")
    .slice(0, 16);
}

export function registerNarrateRoutes(app: FastifyInstance): void {
  app.post("/narrate", async (req, reply) => {
    const ctx = await requireAuth(req, reply);
    const body = Body.parse(req.body);
    const kpi = getKPI(body.kpiId);
    if (!kpi) return reply.code(404).send({ error: "kpi not found" });
    const formula = getFormula(body.kpiId);
    const model = body.mode === "deep-explain" ? "claude-opus-4-7" : "claude-sonnet-4-6";

    await assertUnderCap(ctx.workspaceId);

    const key = `${body.kpiId}:${hashSeries(body.series)}:${model}`;
    const cached = cache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return { text: cached.text, cached: true, model };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      const fallback = buildStubNarrative(kpi.name, body.series);
      cache.set(key, { text: fallback, expiresAt: Date.now() + TTL_MS });
      return { text: fallback, cached: false, model, stub: true };
    }

    // Anthropic SDK-less call, with prompt caching on system + KPI context.
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: body.mode === "deep-explain" ? 1024 : 256,
        system: [
          {
            type: "text",
            text: "You are a senior data analyst. Explain KPI trends in 2-3 crisp sentences with concrete numbers. No fluff.",
            cache_control: { type: "ephemeral" },
          },
          {
            type: "text",
            text: `KPI: ${kpi.name}\nCategory: ${kpi.category}\nFormula: ${formula?.formula ?? "n/a"}\nUnit: ${formula?.unit ?? ""}\nDescription: ${kpi.description}`,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [
          {
            role: "user",
            content: `Series (period,value):\n${body.series.map((p) => `${p.period},${p.value}`).join("\n")}\n\nExplain what happened.`,
          },
        ],
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return reply.code(502).send({ error: "anthropic", detail: text });
    }
    const json = (await resp.json()) as {
      content: { type: string; text: string }[];
      usage: { input_tokens: number; output_tokens: number };
    };
    const text = json.content.map((c) => ("text" in c ? c.text : "")).join("\n").trim();
    await recordSpend({
      workspaceId: ctx.workspaceId,
      model,
      promptTokens: json.usage.input_tokens,
      outputTokens: json.usage.output_tokens,
      feature: "narrate",
    });
    cache.set(key, { text, expiresAt: Date.now() + TTL_MS });
    return { text, cached: false, model };
  });
}

function buildStubNarrative(name: string, series: { period: string; value: number }[]): string {
  if (series.length < 2) return `${name}: not enough data to narrate yet.`;
  const first = series[0]!.value;
  const last = series.at(-1)!.value;
  const pct = first === 0 ? 0 : ((last - first) / Math.abs(first)) * 100;
  const dir = pct >= 0 ? "rose" : "fell";
  return `${name} ${dir} ${Math.abs(pct).toFixed(1)}% over ${series.length} periods, ending at ${last.toFixed(2)}. Connect an ANTHROPIC_API_KEY for Claude-generated narratives.`;
}
