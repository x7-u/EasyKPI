import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../lib/auth.js";

export async function writeAudit(evt: {
  workspaceId: string;
  actorId: string;
  entity: string;
  entityId: string;
  action: "create" | "update" | "delete";
  before?: unknown;
  after?: unknown;
}): Promise<void> {
  await prisma.auditEvent.create({
    data: {
      workspaceId: evt.workspaceId,
      actorId: evt.actorId,
      entity: evt.entity,
      entityId: evt.entityId,
      action: evt.action,
      before: evt.before ? JSON.stringify(evt.before) : null,
      after: evt.after ? JSON.stringify(evt.after) : null,
    },
  });
}

export function registerAuditRoutes(app: FastifyInstance): void {
  app.get("/audit", async (req, reply) => {
    const ctx = await requireAuth(req, reply);
    const { entity, entityId, limit } = req.query as {
      entity?: string;
      entityId?: string;
      limit?: string;
    };
    const rows = await prisma.auditEvent.findMany({
      where: {
        workspaceId: ctx.workspaceId,
        ...(entity ? { entity } : {}),
        ...(entityId ? { entityId } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit ? Math.min(500, parseInt(limit, 10)) : 100,
    });
    return rows;
  });
}
