import type { FastifyRequest, FastifyReply } from "fastify";

/**
 * Phase 4 will wire this to Clerk. For now, we accept an `x-workspace-id`
 * header for development and treat the caller as admin within that workspace.
 * Clerk integration plugs in here without touching the rest of the codebase.
 */
export interface AuthContext {
  userId: string;
  workspaceId: string;
  role: "admin" | "editor" | "viewer";
}

export async function requireAuth(
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<AuthContext> {
  const workspaceId = (req.headers["x-workspace-id"] as string) || "local";
  const userId = (req.headers["x-user-id"] as string) || "local-user";
  if (!workspaceId || !userId) {
    reply.code(401).send({ error: "unauthenticated" });
    throw new Error("unauthenticated");
  }
  return { userId, workspaceId, role: "admin" };
}

export function requireRole(ctx: AuthContext, min: "viewer" | "editor" | "admin"): void {
  const order = { viewer: 0, editor: 1, admin: 2 } as const;
  if (order[ctx.role] < order[min]) {
    throw new Error("forbidden");
  }
}
