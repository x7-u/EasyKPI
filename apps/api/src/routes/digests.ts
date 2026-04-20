import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../lib/auth.js";

const Body = z.object({
  cron: z.string().min(1),
  channel: z.enum(["email", "slack"]),
  target: z.string().min(1),
  dashboardId: z.string().optional(),
});

export function registerDigestRoutes(app: FastifyInstance): void {
  app.get("/digests", async (req, reply) => {
    const ctx = await requireAuth(req, reply);
    return prisma.digest.findMany({ where: { workspaceId: ctx.workspaceId } });
  });

  app.post("/digests", async (req, reply) => {
    const ctx = await requireAuth(req, reply);
    const body = Body.parse(req.body);
    return prisma.digest.create({
      data: { workspaceId: ctx.workspaceId, ...body, dashboardId: body.dashboardId ?? null },
    });
  });

  app.delete("/digests/:id", async (req, reply) => {
    await requireAuth(req, reply);
    const { id } = req.params as { id: string };
    await prisma.digest.delete({ where: { id } });
    return { ok: true };
  });

  /**
   * Manual trigger for a digest. In production a BullMQ worker reads from
   * prisma.digest at each cron tick, renders charts, generates the rich xlsx,
   * and sends via SendGrid (email) or an HTTPS webhook (Slack).
   */
  app.post("/digests/:id/run", async (req, reply) => {
    await requireAuth(req, reply);
    const { id } = req.params as { id: string };
    const d = await prisma.digest.findUnique({ where: { id } });
    if (!d) return reply.code(404).send({ error: "not found" });
    await prisma.digest.update({ where: { id }, data: { lastSentAt: new Date() } });
    return { ok: true, note: "Stub — worker not wired; would render + deliver via " + d.channel };
  });
}
