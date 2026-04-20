import type { FastifyInstance } from "fastify";
import { z } from "zod";

/**
 * Phase 7 plugin registry.
 * Plugins are described by a small manifest and can contribute:
 *   - custom KPIs (via mathjs DSL, not arbitrary JS)
 *   - custom data source adapters (via a narrow REST contract)
 *   - dashboard widget types (via a React lazy-loaded component URL)
 * Workspaces enable plugins per-workspace; manifests are fetched from the
 * plugin's public URL and validated here before activation.
 */

const PluginManifest = z.object({
  id: z.string().min(1),
  name: z.string(),
  version: z.string(),
  author: z.string().optional(),
  capabilities: z.array(z.enum(["kpi", "dataSource", "widget"])),
  customKPIs: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        category: z.string(),
        description: z.string(),
        formulaDSL: z.string(),
        inputs: z.array(z.object({ id: z.string(), label: z.string() })),
        unit: z.string().optional(),
        precision: z.number().int().min(0).max(6).default(2),
      }),
    )
    .optional(),
  dataSources: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        fetchUrl: z.string().url(),
        auth: z.enum(["none", "apiKey", "oauth2"]),
      }),
    )
    .optional(),
  widgetUrls: z.array(z.string().url()).optional(),
});

const registry = new Map<string, z.infer<typeof PluginManifest>>();

export function registerPluginRoutes(app: FastifyInstance): void {
  app.get("/plugins", async () => Array.from(registry.values()));

  app.post("/plugins/register", async (req, reply) => {
    try {
      const manifest = PluginManifest.parse(req.body);
      registry.set(manifest.id, manifest);
      return { ok: true, id: manifest.id };
    } catch (e) {
      return reply.code(400).send({ error: (e as Error).message });
    }
  });

  app.delete("/plugins/:id", async (req) => {
    const { id } = req.params as { id: string };
    registry.delete(id);
    return { ok: true };
  });
}
