import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../lib/auth.js";

const Body = z.object({
  dashboardId: z.string().optional(),
  kpiKey: z.string().optional(),
  body: z.string().min(1).max(4000),
  mentions: z.array(z.string()).default([]),
});

export function registerCommentRoutes(app: FastifyInstance): void {
  app.get("/comments", async (req, reply) => {
    const ctx = await requireAuth(req, reply);
    const { dashboardId, kpiKey } = req.query as { dashboardId?: string; kpiKey?: string };
    const rows = await prisma.comment.findMany({
      where: {
        workspaceId: ctx.workspaceId,
        ...(dashboardId ? { dashboardId } : {}),
        ...(kpiKey ? { kpiKey } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => ({ ...r, mentions: JSON.parse(r.mentions) }));
  });

  app.post("/comments", async (req, reply) => {
    const ctx = await requireAuth(req, reply);
    const body = Body.parse(req.body);
    const c = await prisma.comment.create({
      data: {
        workspaceId: ctx.workspaceId,
        dashboardId: body.dashboardId ?? null,
        kpiKey: body.kpiKey ?? null,
        authorId: ctx.userId,
        body: body.body,
        mentions: JSON.stringify(body.mentions),
      },
    });
    return c;
  });
}
