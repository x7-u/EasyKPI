# EasyKPI

**🌐 Live site → [x7-u.github.io/EasyKPI](https://x7-u.github.io/EasyKPI/)**

A clean, fast KPI reference tool built for entry-level data analysts. Stop googling "what does X metric mean" mid-dashboard — EasyKPI puts 95+ KPIs across 8 business departments at your fingertips, with chart recommendations and side-by-side comparisons built in.

---

## What it does

**Browse by department**
Filter KPIs across Financial, Sales, Marketing, Customer, Operational, HR & People, Technology / IT, and E-commerce / Digital.

**Filter by focus area**
19 focus area tags — Revenue, Growth, Customer Retention, Profitability, Risk, and more — let you drill down to exactly the type of metric you need.

**Search by name or keyword**
Don't know the exact KPI name? Search by description, tag, or category and the results update instantly.

**Detailed KPI cards**
Every KPI includes what it measures, its key variables, focus area tags, and a recommended chart type with a short explanation of why that chart works for that metric.

**Side-by-side comparison**
Pin up to 3 KPIs and compare them directly — useful when you're deciding between similar metrics for a dashboard.

**KPI type labelling**
Each KPI is tagged as Core, Supporting, Advanced, or Lesser-Known, so you always know how commonly used a metric is in practice.

---

## What it does well

- Covers the KPIs you'll actually encounter in a junior analyst role — no obscure academic metrics, just the ones that come up in real dashboards and reports
- Chart recommendations bridge the gap between "I have this data" and "how do I visualise it"
- Filtering is instant and stackable — combine department filters with focus area tags to zero in on what you need
- Clean dark UI that doesn't get in the way
- Works offline once dependencies are installed

---

## Who it's for

EasyKPI is aimed at **entry-level data analysts** — people who are:

- New to business analytics and still building their KPI vocabulary
- Building dashboards and unsure which metrics to include or how to label them
- Trying to understand which chart type best communicates a particular metric
- Writing reports and wanting to quickly check what a KPI actually measures before including it

If you've ever had a manager say "can you add churn rate to the dashboard?" and immediately opened a new browser tab to figure out what that means — this tool is for you.

---

## Limitations

- **No live data** — EasyKPI is a reference tool. It tells you *about* KPIs; it doesn't connect to your data or calculate anything
- **Fixed library** — the 95 KPIs are hand-curated and static. You can't add custom KPIs yet
- **No live data** — EasyKPI is a reference tool, not a BI platform
- **Fixed library** — the 95 KPIs are hand-curated and static; you can't add custom KPIs yet
- **No export** — KPI details can't currently be downloaded or saved to PDF, CSV, or any other format

---

## Getting started

No install needed — just open the live site:

**https://x7-u.github.io/EasyKPI/**

Works in any browser on any device.

---

## What's next

EasyKPI started as a personal learning tool, but there's a clear direction for where it goes from here:

**Standalone desktop app**
The biggest friction point right now is needing Node.js installed to run it. The plan is to package EasyKPI using Electron so it ships as a true desktop application — a single `.exe` on Windows, `.dmg` on Mac — with nothing else to install.

**Custom KPI library**
Let users add, edit, and save their own KPIs alongside the built-in ones. Useful for teams with company-specific metrics that don't appear in any standard reference.

**Formula builder**
Attach the actual calculation formula to each KPI so analysts know exactly how to compute it, not just what it measures.

**Export**
Download individual KPI summaries or full comparison views as PDF or CSV to drop into reports and presentations.

**More KPIs**
The current library of 95 covers the most common business metrics but there's room to grow — more niche industries, emerging digital metrics, and ESG-related KPIs are all on the list.

**Live data connection**
Longer term: connect to a spreadsheet or BI source and see actual KPI values within the tool itself, turning it from a reference into a lightweight dashboard.

---

## Tech stack

Plain HTML, CSS, and JavaScript — no frameworks, no dependencies, no build step.

---

*Built for analysts who are still figuring it out — one KPI at a time.*
