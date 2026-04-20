import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { exportDashboardToExcel } from "../export/excel.js";
import { requireAuth } from "../lib/auth.js";

const Body = z.object({
  dashboardName: z.string(),
  tiles: z.array(
    z.object({
      kpi: z.record(z.any()),
      data: z.array(z.object({ period: z.string(), value: z.number() })),
      overlays: z.record(z.any()).optional(),
      chartPngBase64: z.string().optional(),
    }),
  ),
  format: z.enum(["xlsx", "pdf", "pptx", "docx"]).default("xlsx"),
});

export function registerExportRoutes(app: FastifyInstance): void {
  app.post("/export/dashboard", async (req, reply) => {
    const ctx = await requireAuth(req, reply);
    const body = Body.parse(req.body);
    if (body.format === "xlsx") {
      const buf = await exportDashboardToExcel({
        workspace: ctx.workspaceId,
        dashboardName: body.dashboardName,
        generatedAt: new Date().toISOString(),
        generatedBy: ctx.userId,
        tiles: body.tiles as never,
      });
      reply
        .header("content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        .header(
          "content-disposition",
          `attachment; filename="${body.dashboardName.replace(/[^a-z0-9]+/gi, "-")}.xlsx"`,
        );
      return reply.send(buf);
    }
    // PDF/PPTX/DOCX wire up in Phase 6 via headless ECharts + docx/pptx/pdf libs.
    return reply.code(501).send({ error: `format ${body.format} not implemented yet` });
  });
}
