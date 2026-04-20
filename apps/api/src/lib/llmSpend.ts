import { prisma } from "./prisma.js";

const PRICING_USD_PER_MTOK: Record<string, { input: number; output: number }> = {
  "claude-sonnet-4-6": { input: 3, output: 15 },
  "claude-opus-4-7": { input: 15, output: 75 },
  "claude-haiku-4-5": { input: 0.8, output: 4 },
};

export async function recordSpend(opts: {
  workspaceId: string;
  model: string;
  promptTokens: number;
  outputTokens: number;
  feature: "narrate" | "semantic" | "explain";
}): Promise<number> {
  const p = PRICING_USD_PER_MTOK[opts.model] ?? { input: 3, output: 15 };
  const usd = (opts.promptTokens / 1_000_000) * p.input + (opts.outputTokens / 1_000_000) * p.output;
  await prisma.llmSpend.create({
    data: {
      workspaceId: opts.workspaceId,
      model: opts.model,
      promptTokens: opts.promptTokens,
      outputTokens: opts.outputTokens,
      usd,
      feature: opts.feature,
    },
  });
  return usd;
}

/** Sum spend for a workspace over the last 24h. */
export async function dailySpend(workspaceId: string): Promise<number> {
  const since = new Date(Date.now() - 24 * 3600 * 1000);
  const rows = await prisma.llmSpend.findMany({
    where: { workspaceId, createdAt: { gte: since } },
    select: { usd: true },
  });
  return rows.reduce((s, r) => s + r.usd, 0);
}

/** Hard cap per workspace per day. Configurable later via settings. */
export const DAILY_CAP_USD = Number(process.env.LLM_DAILY_CAP_USD ?? 5);

export async function assertUnderCap(workspaceId: string): Promise<void> {
  const spent = await dailySpend(workspaceId);
  if (spent >= DAILY_CAP_USD) {
    throw new Error(`Daily LLM spend cap reached ($${DAILY_CAP_USD})`);
  }
}
