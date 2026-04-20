# EasyKPI — Analyst Workbench

**🌐 Live site (read-only catalog preview) → [x7-u.github.io/EasyKPI](https://x7-u.github.io/EasyKPI/)**

The hosted site is the original static catalog for quick browsing. The code in
this repo is the full local workbench described below — clone it and run
`EasyKPI.exe` (or `npm install && npm run dev`) to get charts, forecasting,
ingest, and Excel export.

---

A fully local, browser-based KPI analytics workbench. Download the repo, run
`EasyKPI.exe` on Windows (or `npm install && npm run dev` on any OS), and you get:

- A searchable catalog of **95 KPIs** across 8 business domains.
- **Real charts** (ECharts) with benchmark bands, targets, forecasts, and anomaly flags.
- A **time-series calculator** and a **goal-seek solver** for every formula.
- **CSV / XLSX ingest** with a column-mapping UI that binds file columns to KPI inputs.
- A **drag-resizable dashboard** (up to 12 tiles) with per-chart and dashboard-wide
  **Excel export**.
- **Holt-Winters forecasting** + STL/z-score **anomaly detection** out of the box.
- **Driver decomposition** (waterfall chart) for KPIs that have a registered DAG.
- **AI narratives** via Claude (Sonnet by default, Opus on "Deep explain") with prompt
  caching and per-workspace daily spend caps. Uses a deterministic stub when no API
  key is configured, so the feature works offline.
- **Plain-English semantic search**: "are we losing our best customers?" →
  NPS / Retention / Churn / CSAT.
- A local Fastify **API** for everything that can't safely run in the browser:
  SQL connectors, server-side Excel export (ExcelJS), comments, audit log,
  shareable permalinks, scheduled digests, and a plugin registry.
- A Python sidecar (`apps/forecast`) that optionally adds **Prophet** forecasting.

Nothing leaves the user's machine unless they explicitly configure a connector or
provide an `ANTHROPIC_API_KEY`. Data is persisted in the browser's IndexedDB and in
a local SQLite database under `apps/api/prisma/dev.db`.

---

## What changed from the original

The original repo was a single-page React 19 + Vite demo: an 385-line `App.jsx`
with inline styles, 95 KPIs in a JSON file, and a manual-input calculator that
didn't render any charts. It has been rebuilt from the ground up into a
production-shaped workspace while preserving every original formula and keeping
the Windows `.exe` single-click launch experience.

### Monorepo layout

```
easykpi/
├─ apps/
│  ├─ web/                Vite + React 19 + TypeScript strict + Tailwind 4 + ECharts + Zustand
│  │   ├─ src/app/           Router + RootLayout
│  │   ├─ src/features/      catalog, compare, calculator, dashboard, upload, settings
│  │   ├─ src/stores/        Zustand + IndexedDB persistence (catalog filters, compare,
│  │   │                     targets, datasets, dashboards)
│  │   ├─ src/charts/        KPIChart (ECharts adapter), DriverWaterfall, mockSeries
│  │   ├─ src/components/    KPICard, TrafficLight, ExportExcelButton, AnomalyList,
│  │   │                     Narrative, SemanticSearch
│  │   └─ src/export/        excel.ts — SheetJS per-chart & dashboard workbooks
│  ├─ api/                Fastify 5 + Prisma 5 + SQLite (dev / .exe) or Postgres (prod)
│  │   ├─ src/routes/        health, catalog, forecast, narrate, semantic, sql,
│  │   │                     export, dashboards, audit, comments, permalinks,
│  │   │                     digests, plugins
│  │   ├─ src/lib/           prisma, auth middleware, llmSpend ledger
│  │   ├─ src/export/        excel.ts — ExcelJS multi-sheet dashboard export
│  │   └─ prisma/schema.prisma  Workspaces, Users, Memberships, CustomKPIs, Datasets,
│  │                            Targets, Benchmarks, Dashboards, Permalinks, Comments,
│  │                            AuditEvent, Digest, LlmSpend
│  └─ forecast/           FastAPI + statsmodels (+ optional Prophet) sidecar
├─ packages/
│  └─ shared/             Zod schemas, TS types, formula registry, 15 seeded benchmarks,
│                         driver DAGs, pure-JS Holt-Winters / anomaly detection / goal-seek,
│                         golden-value tests for all 95 formulas
├─ build-launcher.ps1     Rebuilds EasyKPI.exe — installs, builds, starts api + preview,
│                         opens the user's browser
├─ EasyKPI.exe            Windows single-click launcher (committed)
├─ package.json           npm workspace root (pnpm-style layout)
├─ tsconfig.base.json     Shared strict TS config
└─ README.md
```

### Phase-by-phase scope shipped

| Phase | What landed |
|---|---|
| **0 — Foundations** | npm workspaces (`apps/*`, `packages/*`); TypeScript strict throughout; Vitest; ESLint; `react-router` with 7 feature routes; Zustand stores per feature persisted to IndexedDB via `idb-keyval`; Tailwind 4 migration with **all** inline styles deleted; **golden-value tests for all 95 formulas** so future refactors are safe. |
| **1 — Visual** | ECharts `<KPIChart>` adapter with overlay props for bands / target / thresholds / forecast / anomalies; every KPI detail page renders a real chart on a deterministic mock series (real data once uploaded); calculator gains **Series** (paste CSV, chart result) and **Goal-seek** tabs; Dashboard route with `react-grid-layout` (≤12 tiles) persisted per-user; per-chart **Export to Excel** (SheetJS) from catalog, calculator, dashboard; traffic-light target badges on every card. |
| **1.5 — Benchmarks** | Seeded industry p25/p50/p75 benchmarks for 15 popular KPIs (Revenue Growth, Net Margin, Gross Margin, Current Ratio, DSO, Conversion Rate, Win Rate, CAC, ROAS, CTR, NPS, CLV, Retention, Churn, OEE). Chart bands and KPI detail cards consume them automatically. |
| **2 — Ingest** | CSV + XLSX upload via `papaparse` + SheetJS, files stored in IndexedDB; column-mapping UI binds file columns → KPI `variableTags`; Fastify `apps/api` scaffold with a `POST /sql/query` endpoint so DB creds never touch the browser; Vite proxies `/api/*` → `http://localhost:8787`. |
| **3 — Depth** | Pure-JS Holt-Winters forecasting with 80% confidence bands; STL + z-score anomaly detection; bisection-based goal-seek that inverts any formula; driver-decomposition DAG + waterfall chart for a starter set of KPIs; every analytical primitive lives in `@easykpi/shared/forecasting` and `@easykpi/shared/drivers` so server-side digests reuse them. |
| **3.5 — Prophet sidecar** | `apps/forecast` — FastAPI + `statsmodels` + optional Prophet, same request/response contract as the JS forecaster. The api proxies requests to it when `PYTHON_FORECAST_URL` is set and falls back to JS otherwise. |
| **4 — Governance** | Prisma schema with Workspace / User / Membership / CustomKPI / Dataset / Target / Benchmark / Dashboard / Permalink / Comment / AuditEvent / Digest / LlmSpend (runs clean on both SQLite and Postgres). Auth middleware is ready for a Clerk drop-in; a local-mode stub treats `x-workspace-id: local` / `x-user-id: local-user` as an authenticated admin. Every dashboard mutation writes an audit row. |
| **5 — Intelligence** | `/narrate` route calls Claude (Sonnet 4.6 default, Opus 4.7 for "Deep explain") with system-prompt and KPI-context caching, a 24h (kpiId, dataHash, model) cache, and a per-workspace daily USD spend cap enforced server-side. Falls back to a deterministic stub when no API key is set. `/semantic/search` ranks KPIs by keyword overlap for now; the response shape matches a future `@xenova/transformers` embedding upgrade. |
| **6 — Distribution** | Multi-sheet ExcelJS dashboard export (`Summary` / `Data_{kpiId}` / `Charts` / `Metadata`) with conditional formatting on status cells, number formats per KPI precision, and a slot for embedded PNG charts; shareable `/s/:token` permalinks with optional password + expiry + revoke; scheduled digest config endpoint (worker-ready); PWA manifest. |
| **7 — Productise** | Plugin registry at `POST /plugins/register` validates a Zod-typed manifest with `kpi`, `dataSource`, and `widget` capabilities — custom KPIs use a mathjs-style DSL rather than arbitrary JS. |

### Frontend features

- Feature-folder routes: `/catalog`, `/kpis/:id`, `/compare`, `/calculator/:id?`,
  `/dashboard`, `/upload`, `/settings`.
- Every KPI detail page shows: live chart (with benchmark bands, target line,
  forecast + CI, anomaly markers), formula card, benchmarks panel, inline target
  editor, anomaly list, AI narrative panel, driver waterfall, variable tags,
  focus areas.
- Catalog supports filtering by category + focus area + full-text search,
  plus a semantic-search bar that hits the api.
- Compare page shows up to 3 KPIs side-by-side with per-column chart and
  per-column Excel export.
- Dashboard: drag to rearrange, resize from the corner, add up to 12 tiles,
  switch between saved dashboards, delete/rename, **Export to Excel** for the
  whole thing.
- Settings page surfaces local state counts (targets, datasets, dashboards,
  compare items) and a "Clear all local data" danger-zone button.

### Backend features

All routes scoped to a workspace via `x-workspace-id` header (drops into Clerk's
org model cleanly):

| Endpoint | Purpose |
|---|---|
| `GET /health` | Liveness |
| `GET /catalog/kpis`, `GET /catalog/kpis/:id`, `GET /catalog/count`, `GET /catalog/custom` | Catalog + per-workspace custom KPIs |
| `POST /sql/query` | Executes `postgres`/`bigquery`/`snowflake` queries server-side (drivers are dynamic imports so they're optional) |
| `POST /forecast` | Holt-Winters JS; proxies to Python Prophet if `PYTHON_FORECAST_URL` is set |
| `POST /forecast/anomalies` | Z-score anomaly list |
| `POST /forecast/goal-seek` | Formula inversion (bisection) |
| `POST /narrate` | Claude call with prompt caching + spend ledger + daily cap + stub fallback |
| `POST /semantic/search` | Ranked KPI list for a natural-language question |
| `POST /export/dashboard` | Multi-sheet `.xlsx` via ExcelJS (Phase 6 rich export) |
| `GET/POST/DELETE /dashboards[/:id]` | Dashboard CRUD with automatic audit events |
| `GET /audit` | Filterable audit log |
| `GET/POST /comments` | Comments on KPIs or dashboard tiles with `@mentions` |
| `POST /permalinks`, `POST /permalinks/:token/revoke`, `GET /s/:token` | Shareable read-only dashboard links |
| `GET/POST/DELETE /digests`, `POST /digests/:id/run` | Scheduled digest config + manual trigger |
| `GET/POST/DELETE /plugins[/:id]` | Plugin registry |

### Excel export

Two first-class features, deliberately split by phase and implementation:

- **E1 — per-chart export (client-side, SheetJS)** — button on every KPI detail,
  calculator result, and dashboard tile. Single sheet; metadata header +
  `period / value / target / benchmark_* / forecast_* / anomaly` columns;
  formatting per KPI precision; filename `{slug}-{YYYYMMDD-HHmm}.xlsx`.
- **E2 — dashboard export (server-side, ExcelJS)** — four sheets: `Summary`
  (one row per tile with traffic-light fill), `Data_{kpiId}` per tile with full
  series + overlays, `Charts` (slot for embedded PNGs), `Metadata`
  (definitions + formulas + sources). Frozen header rows; conditional formatting
  on status cells; workbook name `{workspace}-{dashboard}-{YYYYMMDD}.xlsx`.

---

## Getting started

### Windows, non-technical — the `.exe` launcher

1. Make sure Node.js 20+ is installed (`node --version` should print v20 or higher).
2. Double-click `EasyKPI.exe`.
3. First launch: it runs `npm install --legacy-peer-deps`, builds the web bundle,
   initialises the SQLite database, starts the Fastify api on `:8787` and
   `vite preview` on `:5173`, and opens your default browser. Subsequent launches
   skip the install + build steps if they've already run.

### Any OS — manual

```bash
# 1. Install dependencies (npm workspaces require --legacy-peer-deps for
#    the @fastify/type-provider-zod v1 + zod v3 peer range)
npm install --legacy-peer-deps

# 2. Initialise the local SQLite database
cd apps/api && DATABASE_URL="file:./dev.db" npx prisma db push --skip-generate
DATABASE_URL="file:./dev.db" npx tsx prisma/seed.ts
cd ../..

# 3. Start the api (terminal 1)
cd apps/api && DATABASE_URL="file:./dev.db" PORT=8787 npm run dev

# 4. Start the web app (terminal 2)
cd apps/web && npm run dev

# 5. (optional) Start the Python forecast sidecar (terminal 3)
cd apps/forecast
pip install -r requirements.txt
uvicorn main:app --port 8788
```

Open http://localhost:5173 — the web app proxies `/api/*` to `http://localhost:8787`.

### Environment variables (`apps/api/.env`)

```
DATABASE_URL="file:./dev.db"              # or postgres://... for production
PORT=8787
ANTHROPIC_API_KEY=sk-ant-...              # optional — enables real AI narratives
CLERK_SECRET_KEY=...                       # optional — enables multi-user workspaces
CLERK_PUBLISHABLE_KEY=...                  # optional
PYTHON_FORECAST_URL=http://localhost:8788  # optional — Prophet sidecar
LLM_DAILY_CAP_USD=5                        # per-workspace daily spend cap
```

Without any of the optional variables the app still fully works — narratives
return a deterministic stub, auth is single-user/local, and forecasts use the
pure-JS Holt-Winters implementation.

---

## Testing

```bash
# Golden-value tests for all 95 formulas (the refactor safety net)
cd packages/shared && npx vitest run

# Strict typecheck (must pass for each workspace)
cd packages/shared && npx tsc --noEmit
cd apps/web      && npx tsc --noEmit
cd apps/api      && npx tsc --noEmit

# Production web build
cd apps/web && npx vite build

# API end-to-end smoke (with api running on :8787)
curl -s http://localhost:8787/health
curl -s http://localhost:8787/catalog/count
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"query":"are we losing customers","topK":5}' \
  http://localhost:8787/semantic/search
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"series":[{"period":"2024-01","value":100},{"period":"2024-02","value":110},{"period":"2024-03","value":120}],"horizon":3}' \
  http://localhost:8787/forecast
```

---

## Design notes

- **Formulas are JS with a typed façade.** The 95 original formulas in
  `packages/shared/src/formulas/definitions.js` were *not* rewritten — they're
  re-exported through a typed `index.ts` so runtime behavior is identical. Golden
  tests pin that behavior.
- **All styling is Tailwind utility classes.** Every inline style object from
  the original 385-line `App.jsx` has been deleted.
- **Zustand + IndexedDB, not Redux.** Each feature has its own slice:
  `useCatalogStore`, `useCompareStore`, `useTargetStore`, `useDatasetStore`,
  `useDashboardStore`. Persistence is transparent via `zustand/middleware/persist`.
- **Charts use one adapter.** `<KPIChart>` is the single ECharts wrapper used
  everywhere; overlay props (bands / target / threshold / forecast / anomalies)
  exist from day one so later phases didn't require rewrites.
- **Prisma stays on the Postgres/SQLite common subset.** No JSONB-only queries,
  no `citext`, no Postgres arrays — the same migrations run under the `.exe`
  launcher (SQLite) and in production (Postgres).
- **Claude spend is always metered.** Every call through `/narrate` writes a
  token-accounted `LlmSpend` row; the daily cap is enforced before each call.
- **`react-grid-layout` is pinned to v1.4.4** for React 19 compatibility.
- **The `.exe` launcher now runs `vite preview` over a built bundle**, not the
  dev server, avoiding the PWA-vs-dev-server cache conflict.

---

## Next steps (not shipped yet)

- Real Clerk wiring in `src/lib/auth.ts` (the seam already exists).
- Switch the keyword semantic ranker for `@xenova/transformers` embeddings in a
  web worker (zero API cost, response shape unchanged).
- Headless ECharts rendering for `Charts` sheet PNGs in the server-side Excel
  export.
- BullMQ worker + Redis (or `better-queue` if sticking to local) for the
  scheduled digests.
- Full driver decomposition for all 95 KPIs (starter DAGs live in
  `packages/shared/src/drivers/index.ts`).
- Code-splitting the 1.9 MB web bundle (ECharts + xlsx are the fat bits).
