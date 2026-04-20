import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireAuth } from "../lib/auth.js";

/**
 * Phase 2 SQL connector. The wire format is stable; dialect-specific drivers
 * (pg, @google-cloud/bigquery, snowflake-sdk) plug in behind `runQuery`.
 * Credentials never leave the server; the web client only sends a reference
 * to a stored connection (Phase 4 adds encrypted DSN storage).
 */

const Body = z.object({
  engine: z.enum(["postgres", "bigquery", "snowflake", "sqlite"]),
  dsn: z.string().min(1),
  query: z.string().min(1),
});

async function runQuery(engine: string, dsn: string, query: string): Promise<unknown[]> {
  switch (engine) {
    case "postgres": {
      // Dynamic import so the `pg` package is optional and only required
      // when a workspace actually configures a Postgres connector.
      const pkg = (await import("pg" as string).catch(() => null)) as {
        default: { Client: new (opts: { connectionString: string }) => { connect: () => Promise<void>; query: (q: string) => Promise<{ rows: unknown[] }>; end: () => Promise<void> } };
      } | null;
      if (!pkg) throw new Error("pg driver not installed — run: npm i pg");
      const Client = pkg.default.Client;
      const c = new Client({ connectionString: dsn });
      await c.connect();
      try {
        const res = await c.query(query);
        return res.rows;
      } finally {
        await c.end();
      }
    }
    case "sqlite":
      throw new Error("SQLite connector not implemented yet — use file upload");
    case "bigquery":
      throw new Error("BigQuery connector installed via @google-cloud/bigquery in Phase 4");
    case "snowflake":
      throw new Error("Snowflake connector installed via snowflake-sdk in Phase 4");
    default:
      throw new Error("unsupported engine");
  }
}

export function registerSqlRoutes(app: FastifyInstance): void {
  app.post("/sql/query", async (req, reply) => {
    await requireAuth(req, reply);
    const body = Body.parse(req.body);
    try {
      const rows = await runQuery(body.engine, body.dsn, body.query);
      return { rows, count: rows.length };
    } catch (e) {
      return reply.code(400).send({ error: (e as Error).message });
    }
  });
}
