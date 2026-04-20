# EasyKPI — Analyst Workbench

**Live site (read-only catalog preview) → [x7-u.github.io/EasyKPI](https://x7-u.github.io/EasyKPI/)**

EasyKPI is a **fully local, browser-based KPI analytics workbench**. Clone the
repo, run `EasyKPI.exe` on Windows (or `npm install && npm run dev` on any OS),
and you get charts, forecasting, benchmarks, data ingest, goal-seek, anomaly
detection, AI narratives, dashboards, and Excel export — all running on your
own machine, with nothing leaving it unless you explicitly configure a cloud
connector.

The hosted link above is the original static catalog kept for quick browsing.
Everything described below is what you get when you run the full workbench
locally.

---

## Feature showcase

### A curated catalog of 95 KPIs

Every KPI in the catalog ships with:
- **Name, category, and type** (Core / Supporting / Advanced / Lesser-Known).
- A **one-sentence definition** and a recommended **chart type** with rationale.
- **Variable tags** (the inputs needed to compute it) and **focus-area tags**
  (cross-cutting themes like *Growth*, *Profitability*, *Customer Retention*).
- A **formula** — 95 hand-written calculators covering every KPI in the library.

Browse by any combination of:
- 8 business departments: **Financial · Sales · Marketing · Customer ·
  Operational · HR & People · Technology / IT · E-commerce / Digital**.
- 19 cross-cutting **focus areas** — stackable filters that let you zero in on
  a specific concern (e.g. *Cost Management + Process Efficiency*).
- **Full-text search** across names, descriptions, and tags.
- **Plain-English semantic search** — type *"are we losing our best customers?"*
  and get ranked hits like NPS, Churn, Retention, and CSAT.

### Real charts on every KPI

No more "recommended chart type: Line Chart" with nothing drawn. Every KPI
detail page renders a live chart (ECharts) on your data — or a deterministic
mock series before you've uploaded anything. The single `<KPIChart>` adapter
handles every chart variant (line, bar, area) plus every overlay:

- **Benchmark bands** — industry p25 / p50 / p75 shaded on the Y axis.
- **Target line** — persistent per-KPI target with direction (higher is better
  / lower is better).
- **Forecast line + confidence band** — the next 6 periods projected with an
  80 % confidence interval by default.
- **Anomaly dots** — z-score-flagged points coloured by severity (warn / critical).

### Targets and traffic-light status

Set a target for any KPI and the app colours every instance of it green / amber
/ red based on:
- The latest actual value.
- The target value and direction (higher / lower is better).
- A configurable "warn at %" threshold.

Traffic-light badges show on every **KPI card**, **catalog result**,
**dashboard tile**, **comparison column**, and **KPI detail header**.

### Seeded industry benchmarks

Out of the box you get seeded p25 / p50 / p75 benchmarks for 15 of the most
commonly used KPIs:

Revenue Growth, Net Profit Margin, Gross Profit Margin, Current Ratio, DSO,
Conversion Rate, Win Rate, CAC, ROAS, CTR, NPS, CLV, Retention Rate, Churn
Rate, OEE.

Chart bands and benchmark panels pick these up automatically. Custom
workspace-scoped benchmarks live in the database and override the seeded
values when present.

### A calculator with three modes

Every one of the 95 KPIs has a first-class calculator with three tabs:

1. **Single** — type the inputs, see the answer. Unit-aware output (`%`, `$`,
   or a unit-less number) formatted to the KPI's precision.
2. **Series** — paste a CSV (first column `period`, remaining columns match the
   formula inputs). The formula runs row-wise and the result is charted inline.
   One click exports the computed series to Excel.
3. **Goal-seek** — pick which input to solve for, set the target output, and
   the app inverts the formula numerically (bisection with a Newton fallback).
   Works for every formula, no extra code per KPI.

### Data ingest — CSV, XLSX, and SQL

Turn EasyKPI from a reference tool into a tool that answers *your* questions:

- **CSV / XLSX upload** via drag-and-drop. Files are parsed in the browser
  (papaparse + SheetJS), stored in IndexedDB, and never leave your machine.
- **Column-mapping UI** — the app shows the columns it detected in your file
  on one side and the KPI's required inputs on the other. Drop-down mapping,
  live-preview chart, saved per (dataset × KPI).
- **SQL connector endpoint** (`POST /sql/query`) — runs Postgres / BigQuery /
  Snowflake queries **server-side** so credentials never reach the browser.
  Drivers are dynamic imports so they're optional.

### Forecasting, anomalies, and decomposition

The shared analytics package gives every chart a Phase-3 toolkit:

- **Holt-Winters forecasting** (pure JS) with 80 % or 95 % confidence bands.
- **STL + z-score anomaly detection** — residuals above `|z| > threshold` are
  flagged `warn` or `critical` and shaded on the chart + listed in an
  "Anomalies" panel.
- **Driver decomposition** — KPIs with a registered DAG (Revenue Growth,
  Net Profit Margin, CAC to start) render a waterfall chart showing each
  input's contribution to the period-over-period change.
- **Optional Prophet sidecar** — `apps/forecast` is a FastAPI + statsmodels
  service (with Prophet enabled when `pip install prophet` has run). The main
  API proxies to it when `PYTHON_FORECAST_URL` is set and falls back to JS
  Holt-Winters transparently.

### AI assistance via Claude

- **`Explain` button** on every chart fires `/narrate` → Claude Sonnet 4.6
  (with prompt caching on the system prompt and KPI context).
- **`Deep explain` button** escalates to Opus 4.7 for richer analysis, behind
  a cost-confirmation modal.
- **24-hour cache** keyed by `(kpiId, dataHash, model)` so repeat views are
  free.
- **Per-workspace daily USD spend cap** enforced server-side — tracked in an
  `LlmSpend` ledger table so every token is accounted for.
- **Offline fallback** — without an `ANTHROPIC_API_KEY` the API returns a
  deterministic stub narrative so the UI still works.

### Drag-and-drop dashboards

- **Up to 12 tiles per dashboard**, each with a KPI, chart, live latest value,
  unit badge, and a "⋯ → remove" control.
- **Drag to rearrange** and **resize from the corner** (react-grid-layout).
- **Multiple dashboards** per user — switch with the dropdown, rename in
  place, delete with a confirmation.
- **Persisted per user** to IndexedDB (locally) and to Postgres via the API
  (when a workspace is configured).

### Excel export, two ways

1. **Per-chart export** — a button on every chart (catalog detail, calculator,
   dashboard tile). One sheet, metadata header, `period / value / target /
   benchmark_* / forecast_* / anomaly` columns, number-formatted per KPI
   precision. Client-side (SheetJS), no server required.
2. **Multi-sheet dashboard export** — server-side via ExcelJS:
   - `Summary` — one row per tile with current / target / status with
     conditional formatting (green / amber / red fill).
   - `Data_{kpiId}` — full time series per tile, overlays included.
   - `Charts` — slot for PNG charts (headless ECharts rendering comes next).
   - `Metadata` — definitions, formulas, units, precisions, sources.
   - Frozen header rows, workbook name `{workspace}-{dashboard}-{YYYYMMDD}.xlsx`.

### Compare up to 3 KPIs side by side

Pin up to 3 KPIs from anywhere in the catalog and the Compare page shows them
in columns with:
- Live mini-chart per KPI.
- Category, description, and formula.
- Per-column **Excel export** button.
- One-click remove or clear-all.

### Governance, collaboration, and sharing

Once you bring up the backend ( `apps/api` ) these unlock automatically:

- **Workspaces and roles** (admin / editor / viewer) via a Clerk-ready auth
  middleware. In local-only mode the server treats you as an admin on a
  workspace called `local`.
- **Custom KPIs** per workspace (`CustomKPI` table) that reference a formula
  by key from the shared registry.
- **Audit log** — every KPI / target / dashboard / benchmark mutation writes
  a row with before / after JSON. Queryable at `GET /audit?entity=&entityId=`.
- **Comments + @mentions** on any KPI or dashboard tile.
- **Shareable permalinks** — `POST /permalinks` returns a `/s/:token` URL
  backed by an optional password, optional expiry, and a one-call revoke.
- **Scheduled digests** — configure a cron + email / Slack target and the
  (worker-ready) digest endpoint sends a daily / weekly summary with the rich
  Excel workbook attached.

### Plugin API for custom KPIs and data sources

`POST /plugins/register` accepts a Zod-validated manifest that can contribute:

- **Custom KPIs** — authored via a mathjs-style DSL rather than arbitrary JS
  (safe, sandboxable).
- **Custom data sources** — a narrow fetch-URL + auth-type contract.
- **Custom widgets** — a React lazy-loaded component URL for new dashboard
  tile types.

Plugins are enabled per workspace; manifests are fetched and validated before
activation.

### PWA installable

A manifest ships out of the box so Chrome / Edge offer an **Install** option.
Installed instances run in a standalone window — still 100 % web, no native
shell.

---

## Architecture at a glance

```
easykpi/
├─ apps/
│  ├─ web/        React 19 + Vite + TypeScript + Tailwind 4 + ECharts + Zustand
│  ├─ api/        Fastify 5 + Prisma 5 (SQLite locally / Postgres in prod) + ExcelJS
│  └─ forecast/   FastAPI + statsmodels (+ optional Prophet) sidecar
├─ packages/
│  └─ shared/     Zod schemas, TS types, formula registry, seeded benchmarks,
│                 driver DAGs, pure-JS Holt-Winters / anomalies / goal-seek,
│                 golden-value tests for all 95 formulas
├─ build-launcher.ps1  Rebuilds EasyKPI.exe — installs, builds, starts api +
│                      preview, opens the user's browser
└─ EasyKPI.exe        Windows single-click launcher
```

### What changed from the original

The original repo was a single-page React demo: one 385-line `App.jsx`, inline
styles, a JSON of 95 KPIs, and a manual-input calculator that rendered no
charts. It has been rebuilt as the monorepo above while **preserving every
original formula byte-for-byte** (95 golden-value tests pin the behavior). The
Windows `.exe` single-click launch experience is kept, and a GitHub Pages
deployment of the original static catalog remains linked at the top of this
README for quick reference.

---

## Getting started

### Windows, one click

1. Make sure Node.js 20+ is installed.
2. Double-click `EasyKPI.exe`. On first launch it runs
   `npm install --legacy-peer-deps`, builds the web bundle, initialises the
   SQLite database, starts the Fastify API on `:8787` and `vite preview` on
   `:5173`, and opens your default browser. Subsequent launches skip anything
   already done.

### Any OS, manual

```bash
# Install dependencies
npm install --legacy-peer-deps

# Initialise the local SQLite database + seed the "local" workspace
cd apps/api && DATABASE_URL="file:./dev.db" npx prisma db push --skip-generate
DATABASE_URL="file:./dev.db" npx tsx prisma/seed.ts
cd ../..

# Start the API (terminal 1)
cd apps/api && DATABASE_URL="file:./dev.db" PORT=8787 npm run dev

# Start the web app (terminal 2)
cd apps/web && npm run dev

# (optional) Start the Python forecast sidecar (terminal 3)
cd apps/forecast
pip install -r requirements.txt
uvicorn main:app --port 8788
```

Open http://localhost:5173 — the web app proxies `/api/*` to
`http://localhost:8787`.

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
return a deterministic stub, auth is single-user / local, and forecasts use
the pure-JS Holt-Winters implementation.

---

## API reference

All routes are workspace-scoped via the `x-workspace-id` header (drops into
Clerk's organisation model cleanly).

| Endpoint | Purpose |
|---|---|
| `GET /health` | Liveness probe |
| `GET /catalog/kpis`, `GET /catalog/kpis/:id`, `GET /catalog/count`, `GET /catalog/custom` | Catalog + per-workspace custom KPIs |
| `POST /sql/query` | Server-side Postgres / BigQuery / Snowflake queries |
| `POST /forecast` | Holt-Winters JS; proxies to Prophet sidecar when configured |
| `POST /forecast/anomalies` | Z-score anomaly list |
| `POST /forecast/goal-seek` | Formula inversion by bisection |
| `POST /narrate` | Claude Sonnet / Opus narratives with caching + spend cap + stub fallback |
| `POST /semantic/search` | Ranked KPI list for a natural-language question |
| `POST /export/dashboard` | Multi-sheet dashboard workbook via ExcelJS |
| `GET/POST/DELETE /dashboards[/:id]` | Dashboard CRUD (auto-writes audit events) |
| `GET /audit` | Filterable audit log |
| `GET/POST /comments` | Comments on KPIs and dashboard tiles with mentions |
| `POST /permalinks`, `POST /permalinks/:token/revoke`, `GET /s/:token` | Shareable read-only links |
| `GET/POST/DELETE /digests`, `POST /digests/:id/run` | Scheduled digest config + manual run |
| `GET/POST/DELETE /plugins[/:id]` | Plugin registry |

---

## Testing

```bash
# Golden-value tests for all 95 formulas (the refactor safety net)
cd packages/shared && npx vitest run

# Strict typecheck across every workspace
cd packages/shared && npx tsc --noEmit
cd apps/web      && npx tsc --noEmit
cd apps/api      && npx tsc --noEmit

# Production web build
cd apps/web && npx vite build

# API smoke (with api running on :8787)
curl -s http://localhost:8787/health
curl -s http://localhost:8787/catalog/count
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"query":"are we losing customers","topK":5}' \
  http://localhost:8787/semantic/search
```

---

## Design notes

- **Formulas are JS with a typed façade.** The 95 original formulas were not
  rewritten — they're re-exported through a typed `index.ts` so runtime
  behaviour is identical. Golden tests pin that behaviour.
- **All styling is Tailwind utility classes.** Every inline style object from
  the original app has been deleted.
- **Zustand + IndexedDB, not Redux.** One slice per feature:
  `useCatalogStore`, `useCompareStore`, `useTargetStore`, `useDatasetStore`,
  `useDashboardStore`. Persistence is transparent via
  `zustand/middleware/persist`.
- **Charts use one adapter.** `<KPIChart>` is the single ECharts wrapper used
  everywhere; overlay props (bands / target / threshold / forecast /
  anomalies) exist from day one so later phases didn't require rewrites.
- **Prisma stays on the Postgres / SQLite common subset.** No JSONB-only
  queries, no `citext`, no Postgres arrays — the same migrations run under
  the `.exe` launcher (SQLite) and in production (Postgres).
- **Claude spend is always metered.** Every `/narrate` call writes a
  token-accounted `LlmSpend` row; the daily cap is enforced before each call.
- **The `.exe` launcher runs `vite preview` over a built bundle**, not the
  dev server — avoids the PWA-vs-dev-server cache conflict.

---

## Roadmap (not yet shipped)

- Real Clerk wiring in `apps/api/src/lib/auth.ts` (the seam already exists).
- Swap the keyword semantic ranker for `@xenova/transformers` embeddings in a
  web worker — zero API cost, response shape unchanged.
- Headless ECharts rendering for `Charts` sheet PNGs in the server-side
  Excel export.
- BullMQ worker + Redis (or `better-queue` for local-only) for scheduled
  digests.
- Full driver decomposition for all 95 KPIs — starter DAGs live in
  `packages/shared/src/drivers/index.ts`.
- Code-splitting the 1.9 MB web bundle (ECharts + xlsx are the fat bits).
