import type { FastifyInstance } from "fastify";
import crypto from "node:crypto";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../lib/auth.js";

const Body = z.object({
  dashboardId: z.string(),
  password: z.string().optional(),
  expiresAt: z.string().optional(),
});

function hashPassword(pw: string): string {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

export function registerPermalinkRoutes(app: FastifyInstance): void {
  app.post("/permalinks", async (req, reply) => {
    await requireAuth(req, reply);
    const body = Body.parse(req.body);
    const token = crypto.randomBytes(16).toString("hex");
    const row = await prisma.permalink.create({
      data: {
        dashboardId: body.dashboardId,
        token,
        passwordHash: body.password ? hashPassword(body.password) : null,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      },
    });
    return { token: row.token, url: `/s/${row.token}` };
  });

  app.post("/permalinks/:token/revoke", async (req, reply) => {
    await requireAuth(req, reply);
    const { token } = req.params as { token: string };
    const row = await prisma.permalink.update({
      where: { token },
      data: { revokedAt: new Date() },
    });
    return row;
  });

  app.get("/s/:token", async (req, reply) => {
    const { token } = req.params as { token: string };
    const { pw } = req.query as { pw?: string };
    const row = await prisma.permalink.findUnique({
      where: { token },
      include: { dashboard: true },
    });
    if (!row) return reply.code(404).send({ error: "not found" });
    if (row.revokedAt) return reply.code(410).send({ error: "revoked" });
    if (row.expiresAt && row.expiresAt < new Date()) {
      return reply.code(410).send({ error: "expired" });
    }
    if (row.passwordHash) {
      if (!pw || hashPassword(pw) !== row.passwordHash) {
        return reply.code(401).send({ error: "password required" });
      }
    }
    return { dashboard: row.dashboard ? { ...row.dashboard, tiles: JSON.parse(row.dashboard.tiles) } : null };
  });
}
