import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { registerHealthRoutes } from "./routes/health.js";
import { registerCatalogRoutes } from "./routes/catalog.js";
import { registerForecastRoutes } from "./routes/forecast.js";
import { registerNarrateRoutes } from "./routes/narrate.js";
import { registerSemanticSearchRoutes } from "./routes/semantic.js";
import { registerSqlRoutes } from "./routes/sql.js";
import { registerExportRoutes } from "./routes/export.js";
import { registerDashboardRoutes } from "./routes/dashboards.js";
import { registerAuditRoutes } from "./routes/audit.js";
import { registerCommentRoutes } from "./routes/comments.js";
import { registerPermalinkRoutes } from "./routes/permalinks.js";
import { registerDigestRoutes } from "./routes/digests.js";
import { registerPluginRoutes } from "./routes/plugins.js";

const PORT = Number(process.env.PORT ?? 8787);

export async function buildServer() {
  const app = Fastify({ logger: true });
  await app.register(cors, { origin: true });
  await app.register(rateLimit, { max: 200, timeWindow: "1 minute" });

  registerHealthRoutes(app);
  registerCatalogRoutes(app);
  registerForecastRoutes(app);
  registerNarrateRoutes(app);
  registerSemanticSearchRoutes(app);
  registerSqlRoutes(app);
  registerExportRoutes(app);
  registerDashboardRoutes(app);
  registerAuditRoutes(app);
  registerCommentRoutes(app);
  registerPermalinkRoutes(app);
  registerDigestRoutes(app);
  registerPluginRoutes(app);

  return app;
}

const app = await buildServer();
try {
  await app.listen({ port: PORT, host: "0.0.0.0" });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
