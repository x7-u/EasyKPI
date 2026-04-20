import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../lib/auth.js";
import { writeAudit } from "./audit.js";

const Upsert = z.object({
  id: z.string().optional(),
  name: z.string(),
  tiles: z.array(z.any()),
});

export function registerDashboardRoutes(app: FastifyInstance): void {
  app.get("/dashboards", async (req, reply) => {
    const ctx = await requireAuth(req, reply);
    const rows = await prisma.dashboard.findMany({ where: { workspaceId: ctx.workspaceId } });
    return rows.map((r) => ({ ...r, tiles: JSON.parse(r.tiles) }));
  });

  app.post("/dashboards", async (req, reply) => {
    const ctx = await requireAuth(req, reply);
    const body = Upsert.parse(req.body);
    const data = {
      workspaceId: ctx.workspaceId,
      name: body.name,
      tiles: JSON.stringify(body.tiles),
    };
    const row = body.id
      ? await prisma.dashboard.update({ where: { id: body.id }, data })
      : await prisma.dashboard.create({ data });
    await writeAudit({
      workspaceId: ctx.workspaceId,
      actorId: ctx.userId,
      entity: "dashboard",
      entityId: row.id,
      action: body.id ? "update" : "create",
      after: body,
    });
    return row;
  });

  app.delete("/dashboards/:id", async (req, reply) => {
    const ctx = await requireAuth(req, reply);
    const { id } = req.params as { id: string };
    await prisma.dashboard.delete({ where: { id } });
    await writeAudit({
      workspaceId: ctx.workspaceId,
      actorId: ctx.userId,
      entity: "dashboard",
      entityId: id,
      action: "delete",
    });
    return { ok: true };
  });
}
