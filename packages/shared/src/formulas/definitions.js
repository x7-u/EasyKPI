// KPI calculation formulas for all 95 KPIs
// Each entry: formula (display string), inputs (array), calculate (fn), unit, precision
export const kpiFormulas = {

  // ── FINANCIAL ────────────────────────────────────────────────────────────────
  "1": {
    formula: "((Current Revenue − Prior Revenue) ÷ Prior Revenue) × 100",
    inputs: [
      { id: "curr", label: "Current Period Revenue ($)" },
      { id: "prev", label: "Prior Period Revenue ($)" },
    ],
    calculate: v => {
      const curr = parseFloat(v.curr), prev = parseFloat(v.prev);
      if (!isFinite(curr) || !isFinite(prev) || prev === 0) return null;
      return ((curr - prev) / prev) * 100;
    },
    unit: "%", precision: 2,
  },
  "2": {
    formula: "(Net Income ÷ Revenue) × 100",
    inputs: [
      { id: "netIncome", label: "Net Income ($)" },
      { id: "revenue", label: "Total Revenue ($)" },
    ],
    calculate: v => {
      const ni = parseFloat(v.netIncome), rev = parseFloat(v.revenue);
      if (!isFinite(ni) || !isFinite(rev) || rev === 0) return null;
      return (ni / rev) * 100;
    },
    unit: "%", precision: 2,
  },
  "3": {
    formula: "((Revenue − COGS) ÷ Revenue) × 100",
    inputs: [
      { id: "revenue", label: "Revenue ($)" },
      { id: "cogs", label: "Cost of Goods Sold — COGS ($)" },
    ],
    calculate: v => {
      const rev = parseFloat(v.revenue), cogs = parseFloat(v.cogs);
      if (!isFinite(rev) || !isFinite(cogs) || rev === 0) return null;
      return ((rev - cogs) / rev) * 100;
    },
    unit: "%", precision: 2,
  },
  "4": {
    formula: "Net Income + Interest + Taxes + Depreciation + Amortisation",
    inputs: [
      { id: "netIncome", label: "Net Income ($)" },
      { id: "interest", label: "Interest Expense ($)" },
      { id: "taxes", label: "Taxes ($)" },
      { id: "depreciation", label: "Depreciation ($)" },
      { id: "amortisation", label: "Amortisation ($)" },
    ],
    calculate: v => {
      const vals = [v.netIncome, v.interest, v.taxes, v.depreciation, v.amortisation].map(parseFloat);
      if (vals.some(x => !isFinite(x))) return null;
      return vals.reduce((a, b) => a + b, 0);
    },
    unit: "$", precision: 2,
  },
  "5": {
    formula: "((Net Return − Cost of Investment) ÷ Cost of Investment) × 100",
    inputs: [
      { id: "netReturn", label: "Net Return / Profit ($)" },
      { id: "cost", label: "Cost of Investment ($)" },
    ],
    calculate: v => {
      const ret = parseFloat(v.netReturn), cost = parseFloat(v.cost);
      if (!isFinite(ret) || !isFinite(cost) || cost === 0) return null;
      return ((ret - cost) / cost) * 100;
    },
    unit: "%", precision: 2,
  },
  "6": {
    formula: "(Net Income ÷ Shareholders' Equity) × 100",
    inputs: [
      { id: "netIncome", label: "Net Income ($)" },
      { id: "equity", label: "Shareholders' Equity ($)" },
    ],
    calculate: v => {
      const ni = parseFloat(v.netIncome), eq = parseFloat(v.equity);
      if (!isFinite(ni) || !isFinite(eq) || eq === 0) return null;
      return (ni / eq) * 100;
    },
    unit: "%", precision: 2,
  },
  "7": {
    formula: "Current Assets ÷ Current Liabilities",
    inputs: [
      { id: "assets", label: "Current Assets ($)" },
      { id: "liabilities", label: "Current Liabilities ($)" },
    ],
    calculate: v => {
      const a = parseFloat(v.assets), l = parseFloat(v.liabilities);
      if (!isFinite(a) || !isFinite(l) || l === 0) return null;
      return a / l;
    },
    unit: "x", precision: 2,
  },
  "8": {
    formula: "Total Debt ÷ Total Shareholders' Equity",
    inputs: [
      { id: "debt", label: "Total Debt ($)" },
      { id: "equity", label: "Total Shareholders' Equity ($)" },
    ],
    calculate: v => {
      const d = parseFloat(v.debt), e = parseFloat(v.equity);
      if (!isFinite(d) || !isFinite(e) || e === 0) return null;
      return d / e;
    },
    unit: "x", precision: 2,
  },
  "9": {
    formula: "Net Income + Non-Cash Charges + Changes in Working Capital",
    inputs: [
      { id: "netIncome", label: "Net Income ($)" },
      { id: "nonCash", label: "Non-Cash Charges (Depreciation + Amortisation) ($)" },
      { id: "workingCapital", label: "Net Change in Working Capital ($)" },
    ],
    calculate: v => {
      const ni = parseFloat(v.netIncome), nc = parseFloat(v.nonCash), wc = parseFloat(v.workingCapital);
      if (!isFinite(ni) || !isFinite(nc) || !isFinite(wc)) return null;
      return ni + nc + wc;
    },
    unit: "$", precision: 2,
  },
  "10": {
    formula: "(Starting Cash − Ending Cash) ÷ Number of Months",
    inputs: [
      { id: "startCash", label: "Starting Cash Balance ($)" },
      { id: "endCash", label: "Ending Cash Balance ($)" },
      { id: "months", label: "Number of Months" },
    ],
    calculate: v => {
      const start = parseFloat(v.startCash), end = parseFloat(v.endCash), months = parseFloat(v.months);
      if (!isFinite(start) || !isFinite(end) || !isFinite(months) || months === 0) return null;
      return (start - end) / months;
    },
    unit: "$/month", precision: 2,
  },
  "11": {
    formula: "Current Assets ÷ Current Liabilities",
    inputs: [
      { id: "assets", label: "Current Assets ($)" },
      { id: "liabilities", label: "Current Liabilities ($)" },
    ],
    calculate: v => {
      const a = parseFloat(v.assets), l = parseFloat(v.liabilities);
      if (!isFinite(a) || !isFinite(l) || l === 0) return null;
      return a / l;
    },
    unit: "x", precision: 2,
  },
  "12": {
    formula: "Days Inventory Outstanding (DIO) + Days Sales Outstanding (DSO) − Days Payable Outstanding (DPO)",
    inputs: [
      { id: "dio", label: "Days Inventory Outstanding — DIO (days)" },
      { id: "dso", label: "Days Sales Outstanding — DSO (days)" },
      { id: "dpo", label: "Days Payable Outstanding — DPO (days)" },
    ],
    calculate: v => {
      const dio = parseFloat(v.dio), dso = parseFloat(v.dso), dpo = parseFloat(v.dpo);
      if (!isFinite(dio) || !isFinite(dso) || !isFinite(dpo)) return null;
      return dio + dso - dpo;
    },
    unit: "days", precision: 1,
  },
  "13": {
    formula: "NOPAT − (Capital Invested × WACC)",
    inputs: [
      { id: "nopat", label: "NOPAT — Net Operating Profit After Tax ($)" },
      { id: "capital", label: "Capital Invested ($)" },
      { id: "wacc", label: "WACC — Weighted Avg. Cost of Capital (%)" },
    ],
    calculate: v => {
      const nopat = parseFloat(v.nopat), capital = parseFloat(v.capital), wacc = parseFloat(v.wacc);
      if (!isFinite(nopat) || !isFinite(capital) || !isFinite(wacc)) return null;
      return nopat - capital * (wacc / 100);
    },
    unit: "$", precision: 2,
  },
  "14": {
    formula: "Total Revenue ÷ Number of Employees",
    inputs: [
      { id: "revenue", label: "Total Revenue ($)" },
      { id: "employees", label: "Number of Employees" },
    ],
    calculate: v => {
      const rev = parseFloat(v.revenue), emp = parseFloat(v.employees);
      if (!isFinite(rev) || !isFinite(emp) || emp === 0) return null;
      return rev / emp;
    },
    unit: "$/employee", precision: 2,
  },
  "15": {
    formula: "(Accounts Receivable ÷ Revenue) × Number of Days in Period",
    inputs: [
      { id: "ar", label: "Accounts Receivable ($)" },
      { id: "revenue", label: "Revenue for the Period ($)" },
      { id: "days", label: "Number of Days in Period (e.g. 90 for quarter)" },
    ],
    calculate: v => {
      const ar = parseFloat(v.ar), rev = parseFloat(v.revenue), days = parseFloat(v.days);
      if (!isFinite(ar) || !isFinite(rev) || !isFinite(days) || rev === 0) return null;
      return (ar / rev) * days;
    },
    unit: "days", precision: 1,
  },

  // ── SALES ─────────────────────────────────────────────────────────────────────
  "16": {
    formula: "Units Sold × Average Selling Price",
    inputs: [
      { id: "units", label: "Total Units / Transactions Sold" },
      { id: "price", label: "Average Selling Price ($)" },
    ],
    calculate: v => {
      const units = parseFloat(v.units), price = parseFloat(v.price);
      if (!isFinite(units) || !isFinite(price)) return null;
      return units * price;
    },
    unit: "$", precision: 2,
  },
  "17": {
    formula: "((Current Sales − Prior Sales) ÷ Prior Sales) × 100",
    inputs: [
      { id: "curr", label: "Current Period Sales ($)" },
      { id: "prev", label: "Prior Period Sales ($)" },
    ],
    calculate: v => {
      const curr = parseFloat(v.curr), prev = parseFloat(v.prev);
      if (!isFinite(curr) || !isFinite(prev) || prev === 0) return null;
      return ((curr - prev) / prev) * 100;
    },
    unit: "%", precision: 2,
  },
  "18": {
    formula: "(Number of Conversions ÷ Total Leads) × 100",
    inputs: [
      { id: "conversions", label: "Number of Conversions" },
      { id: "leads", label: "Total Leads / Visitors" },
    ],
    calculate: v => {
      const conv = parseFloat(v.conversions), leads = parseFloat(v.leads);
      if (!isFinite(conv) || !isFinite(leads) || leads === 0) return null;
      return (conv / leads) * 100;
    },
    unit: "%", precision: 2,
  },
  "19": {
    formula: "Total Revenue from Deals ÷ Number of Deals Closed",
    inputs: [
      { id: "revenue", label: "Total Revenue from Deals ($)" },
      { id: "deals", label: "Number of Deals Closed" },
    ],
    calculate: v => {
      const rev = parseFloat(v.revenue), deals = parseFloat(v.deals);
      if (!isFinite(rev) || !isFinite(deals) || deals === 0) return null;
      return rev / deals;
    },
    unit: "$/deal", precision: 2,
  },
  "20": {
    formula: "Total Days to Close All Deals ÷ Number of Deals Closed",
    inputs: [
      { id: "totalDays", label: "Total Days Across All Deals Closed" },
      { id: "deals", label: "Number of Deals Closed" },
    ],
    calculate: v => {
      const days = parseFloat(v.totalDays), deals = parseFloat(v.deals);
      if (!isFinite(days) || !isFinite(deals) || deals === 0) return null;
      return days / deals;
    },
    unit: "days", precision: 1,
  },
  "21": {
    formula: "(Actual Sales ÷ Sales Quota) × 100",
    inputs: [
      { id: "actual", label: "Actual Sales ($)" },
      { id: "quota", label: "Sales Quota / Target ($)" },
    ],
    calculate: v => {
      const actual = parseFloat(v.actual), quota = parseFloat(v.quota);
      if (!isFinite(actual) || !isFinite(quota) || quota === 0) return null;
      return (actual / quota) * 100;
    },
    unit: "%", precision: 1,
  },
  "22": {
    formula: "Number of Open Deals × Average Deal Value",
    inputs: [
      { id: "deals", label: "Number of Open Deals in Pipeline" },
      { id: "avgValue", label: "Average Deal Value ($)" },
    ],
    calculate: v => {
      const deals = parseFloat(v.deals), avg = parseFloat(v.avgValue);
      if (!isFinite(deals) || !isFinite(avg)) return null;
      return deals * avg;
    },
    unit: "$", precision: 2,
  },
  "23": {
    formula: "(Deals Won ÷ Total Deals Closed) × 100",
    inputs: [
      { id: "won", label: "Deals Won" },
      { id: "total", label: "Total Deals Closed (Won + Lost)" },
    ],
    calculate: v => {
      const won = parseFloat(v.won), total = parseFloat(v.total);
      if (!isFinite(won) || !isFinite(total) || total === 0) return null;
      return (won / total) * 100;
    },
    unit: "%", precision: 1,
  },
  "24": {
    formula: "((Qualified Leads This Month − Qualified Leads Last Month) ÷ Qualified Leads Last Month) × 100",
    inputs: [
      { id: "curr", label: "Qualified Leads This Month" },
      { id: "prev", label: "Qualified Leads Last Month" },
    ],
    calculate: v => {
      const curr = parseFloat(v.curr), prev = parseFloat(v.prev);
      if (!isFinite(curr) || !isFinite(prev) || prev === 0) return null;
      return ((curr - prev) / prev) * 100;
    },
    unit: "%", precision: 1,
  },
  "25": {
    formula: "(Opportunities × Avg. Deal Value × Win Rate%) ÷ Sales Cycle Length",
    inputs: [
      { id: "opps", label: "Number of Open Opportunities" },
      { id: "avgDeal", label: "Average Deal Value ($)" },
      { id: "winRate", label: "Win Rate (%)" },
      { id: "cycleLength", label: "Average Sales Cycle Length (days)" },
    ],
    calculate: v => {
      const opps = parseFloat(v.opps), avg = parseFloat(v.avgDeal),
            wr = parseFloat(v.winRate), cycle = parseFloat(v.cycleLength);
      if ([opps, avg, wr, cycle].some(x => !isFinite(x)) || cycle === 0) return null;
      return (opps * avg * (wr / 100)) / cycle;
    },
    unit: "$/day", precision: 2,
  },
  "26": {
    formula: "(Upsell / Cross-sell Revenue ÷ Total Revenue) × 100",
    inputs: [
      { id: "upsellRevenue", label: "Upsell / Cross-sell Revenue ($)" },
      { id: "totalRevenue", label: "Total Revenue ($)" },
    ],
    calculate: v => {
      const up = parseFloat(v.upsellRevenue), total = parseFloat(v.totalRevenue);
      if (!isFinite(up) || !isFinite(total) || total === 0) return null;
      return (up / total) * 100;
    },
    unit: "%", precision: 2,
  },
  "27": {
    formula: "(Won Opportunities ÷ Total Opportunities) × 100",
    inputs: [
      { id: "won", label: "Opportunities Won" },
      { id: "total", label: "Total Opportunities" },
    ],
    calculate: v => {
      const won = parseFloat(v.won), total = parseFloat(v.total);
      if (!isFinite(won) || !isFinite(total) || total === 0) return null;
      return (won / total) * 100;
    },
    unit: "%", precision: 1,
  },

  // ── MARKETING ─────────────────────────────────────────────────────────────────
  "28": {
    formula: "Total Sales & Marketing Spend ÷ New Customers Acquired",
    inputs: [
      { id: "spend", label: "Total Sales & Marketing Spend ($)" },
      { id: "customers", label: "New Customers Acquired" },
    ],
    calculate: v => {
      const spend = parseFloat(v.spend), cust = parseFloat(v.customers);
      if (!isFinite(spend) || !isFinite(cust) || cust === 0) return null;
      return spend / cust;
    },
    unit: "$/customer", precision: 2,
  },
  "29": {
    formula: "Revenue Generated from Ads ÷ Total Ad Spend",
    inputs: [
      { id: "revenue", label: "Revenue Generated from Ads ($)" },
      { id: "spend", label: "Total Ad Spend ($)" },
    ],
    calculate: v => {
      const rev = parseFloat(v.revenue), spend = parseFloat(v.spend);
      if (!isFinite(rev) || !isFinite(spend) || spend === 0) return null;
      return rev / spend;
    },
    unit: "x", precision: 2,
  },
  "30": {
    formula: "(Total Clicks ÷ Total Impressions) × 100",
    inputs: [
      { id: "clicks", label: "Total Clicks" },
      { id: "impressions", label: "Total Impressions" },
    ],
    calculate: v => {
      const clicks = parseFloat(v.clicks), impr = parseFloat(v.impressions);
      if (!isFinite(clicks) || !isFinite(impr) || impr === 0) return null;
      return (clicks / impr) * 100;
    },
    unit: "%", precision: 2,
  },
  "31": {
    formula: "Total Ad Spend ÷ Total Clicks",
    inputs: [
      { id: "spend", label: "Total Ad Spend ($)" },
      { id: "clicks", label: "Total Clicks" },
    ],
    calculate: v => {
      const spend = parseFloat(v.spend), clicks = parseFloat(v.clicks);
      if (!isFinite(spend) || !isFinite(clicks) || clicks === 0) return null;
      return spend / clicks;
    },
    unit: "$/click", precision: 2,
  },
  "32": {
    formula: "Total Marketing Spend ÷ Total Leads Generated",
    inputs: [
      { id: "spend", label: "Total Marketing Spend ($)" },
      { id: "leads", label: "Total Leads Generated" },
    ],
    calculate: v => {
      const spend = parseFloat(v.spend), leads = parseFloat(v.leads);
      if (!isFinite(spend) || !isFinite(leads) || leads === 0) return null;
      return spend / leads;
    },
    unit: "$/lead", precision: 2,
  },
  "33": {
    formula: "Total Leads × (MQL Qualification Rate ÷ 100)",
    inputs: [
      { id: "leads", label: "Total Leads" },
      { id: "rate", label: "MQL Qualification Rate (%)" },
    ],
    calculate: v => {
      const leads = parseFloat(v.leads), rate = parseFloat(v.rate);
      if (!isFinite(leads) || !isFinite(rate)) return null;
      return Math.round(leads * (rate / 100));
    },
    unit: "MQLs", precision: 0,
  },
  "34": {
    formula: "(Respondents Aware of Brand ÷ Total Survey Respondents) × 100",
    inputs: [
      { id: "aware", label: "Respondents Aware of Brand" },
      { id: "total", label: "Total Survey Respondents" },
    ],
    calculate: v => {
      const aware = parseFloat(v.aware), total = parseFloat(v.total);
      if (!isFinite(aware) || !isFinite(total) || total === 0) return null;
      return (aware / total) * 100;
    },
    unit: "%", precision: 1,
  },
  "35": {
    formula: "Open Rate: (Emails Opened ÷ Emails Delivered) × 100  |  Click Rate: (Emails Clicked ÷ Emails Delivered) × 100",
    inputs: [
      { id: "opened", label: "Emails Opened" },
      { id: "clicked", label: "Emails Clicked" },
      { id: "delivered", label: "Emails Delivered" },
    ],
    calculate: v => {
      const opened = parseFloat(v.opened), clicked = parseFloat(v.clicked), delivered = parseFloat(v.delivered);
      if (!isFinite(opened) || !isFinite(clicked) || !isFinite(delivered) || delivered === 0) return null;
      const openRate = (opened / delivered) * 100;
      const clickRate = (clicked / delivered) * 100;
      return `Open Rate: ${openRate.toFixed(1)}%   |   Click Rate: ${clickRate.toFixed(1)}%`;
    },
    unit: "", precision: 1, multiResult: true,
  },
  "36": {
    formula: "(Marketing Attributed Revenue ÷ Total Revenue) × 100",
    inputs: [
      { id: "mktRevenue", label: "Marketing Attributed Revenue ($)" },
      { id: "totalRevenue", label: "Total Revenue ($)" },
    ],
    calculate: v => {
      const mkt = parseFloat(v.mktRevenue), total = parseFloat(v.totalRevenue);
      if (!isFinite(mkt) || !isFinite(total) || total === 0) return null;
      return (mkt / total) * 100;
    },
    unit: "%", precision: 2,
  },
  "37": {
    formula: "(Your Brand Mentions ÷ Total Market Mentions) × 100",
    inputs: [
      { id: "brand", label: "Your Brand Mentions" },
      { id: "total", label: "Total Market Mentions (all brands combined)" },
    ],
    calculate: v => {
      const brand = parseFloat(v.brand), total = parseFloat(v.total);
      if (!isFinite(brand) || !isFinite(total) || total === 0) return null;
      return (brand / total) * 100;
    },
    unit: "%", precision: 1,
  },
  "38": {
    formula: "(Total Engagements ÷ Total Reach) × 100",
    inputs: [
      { id: "engagements", label: "Total Engagements (likes + comments + shares)" },
      { id: "reach", label: "Total Reach (unique users)" },
    ],
    calculate: v => {
      const eng = parseFloat(v.engagements), reach = parseFloat(v.reach);
      if (!isFinite(eng) || !isFinite(reach) || reach === 0) return null;
      return (eng / reach) * 100;
    },
    unit: "%", precision: 2,
  },
  "39": {
    formula: "((Current Organic Visits − Prior Organic Visits) ÷ Prior Organic Visits) × 100",
    inputs: [
      { id: "curr", label: "Current Period Organic Visits" },
      { id: "prev", label: "Prior Period Organic Visits" },
    ],
    calculate: v => {
      const curr = parseFloat(v.curr), prev = parseFloat(v.prev);
      if (!isFinite(curr) || !isFinite(prev) || prev === 0) return null;
      return ((curr - prev) / prev) * 100;
    },
    unit: "%", precision: 2,
  },
  "40": {
    formula: "Total Time on Page ÷ Total Page Views",
    inputs: [
      { id: "totalTime", label: "Total Time on Page (seconds)" },
      { id: "pageViews", label: "Total Page Views" },
    ],
    calculate: v => {
      const time = parseFloat(v.totalTime), views = parseFloat(v.pageViews);
      if (!isFinite(time) || !isFinite(views) || views === 0) return null;
      return time / views;
    },
    unit: "sec/view", precision: 1,
  },
  "41": {
    formula: "Total Impressions ÷ Unique Reach",
    inputs: [
      { id: "impressions", label: "Total Impressions" },
      { id: "reach", label: "Unique Reach (unique users)" },
    ],
    calculate: v => {
      const impr = parseFloat(v.impressions), reach = parseFloat(v.reach);
      if (!isFinite(impr) || !isFinite(reach) || reach === 0) return null;
      return impr / reach;
    },
    unit: "x per user", precision: 2,
  },

  // ── CUSTOMER ──────────────────────────────────────────────────────────────────
  "42": {
    formula: "% Promoters − % Detractors  (where % = count ÷ total respondents × 100)",
    inputs: [
      { id: "promoters", label: "Promoters (gave score 9 or 10)" },
      { id: "detractors", label: "Detractors (gave score 0 – 6)" },
      { id: "total", label: "Total Survey Respondents" },
    ],
    calculate: v => {
      const p = parseFloat(v.promoters), d = parseFloat(v.detractors), t = parseFloat(v.total);
      if (!isFinite(p) || !isFinite(d) || !isFinite(t) || t === 0) return null;
      return ((p / t) * 100) - ((d / t) * 100);
    },
    unit: "(NPS score)", precision: 0,
  },
  "43": {
    formula: "(Satisfied Responses ÷ Total Responses) × 100",
    inputs: [
      { id: "satisfied", label: "Satisfied Responses (rated 4 or 5 on 5-pt scale)" },
      { id: "total", label: "Total Responses" },
    ],
    calculate: v => {
      const sat = parseFloat(v.satisfied), total = parseFloat(v.total);
      if (!isFinite(sat) || !isFinite(total) || total === 0) return null;
      return (sat / total) * 100;
    },
    unit: "%", precision: 1,
  },
  "44": {
    formula: "Average Purchase Value × Purchase Frequency × Customer Lifespan",
    inputs: [
      { id: "avgPurchase", label: "Average Purchase Value ($)" },
      { id: "frequency", label: "Purchase Frequency (times per year)" },
      { id: "lifespan", label: "Average Customer Lifespan (years)" },
    ],
    calculate: v => {
      const avg = parseFloat(v.avgPurchase), freq = parseFloat(v.frequency), life = parseFloat(v.lifespan);
      if (!isFinite(avg) || !isFinite(freq) || !isFinite(life)) return null;
      return avg * freq * life;
    },
    unit: "$", precision: 2,
  },
  "45": {
    formula: "((Customers at End − New Customers) ÷ Customers at Start) × 100",
    inputs: [
      { id: "endCustomers", label: "Customers at End of Period" },
      { id: "newCustomers", label: "New Customers Acquired in Period" },
      { id: "startCustomers", label: "Customers at Start of Period" },
    ],
    calculate: v => {
      const end = parseFloat(v.endCustomers), newC = parseFloat(v.newCustomers), start = parseFloat(v.startCustomers);
      if (!isFinite(end) || !isFinite(newC) || !isFinite(start) || start === 0) return null;
      return ((end - newC) / start) * 100;
    },
    unit: "%", precision: 1,
  },
  "46": {
    formula: "(Customers Lost ÷ Customers at Start of Period) × 100",
    inputs: [
      { id: "lost", label: "Customers Lost in Period" },
      { id: "start", label: "Customers at Start of Period" },
    ],
    calculate: v => {
      const lost = parseFloat(v.lost), start = parseFloat(v.start);
      if (!isFinite(lost) || !isFinite(start) || start === 0) return null;
      return (lost / start) * 100;
    },
    unit: "%", precision: 2,
  },
  "47": {
    formula: "Sum of CES Scores ÷ Number of Respondents",
    inputs: [
      { id: "totalScore", label: "Sum of All CES Scores" },
      { id: "respondents", label: "Number of Respondents" },
    ],
    calculate: v => {
      const total = parseFloat(v.totalScore), resp = parseFloat(v.respondents);
      if (!isFinite(total) || !isFinite(resp) || resp === 0) return null;
      return total / resp;
    },
    unit: "(avg score)", precision: 2,
  },
  "48": {
    formula: "Average of: Usage Score + Engagement Score + NPS Score + Support Score",
    inputs: [
      { id: "usage", label: "Usage Score (0 – 100)" },
      { id: "engagement", label: "Engagement Score (0 – 100)" },
      { id: "nps", label: "NPS Contribution Score (0 – 100)" },
      { id: "support", label: "Support / Satisfaction Score (0 – 100)" },
    ],
    calculate: v => {
      const vals = [v.usage, v.engagement, v.nps, v.support].map(parseFloat);
      if (vals.some(x => !isFinite(x))) return null;
      return vals.reduce((a, b) => a + b, 0) / vals.length;
    },
    unit: "(composite)", precision: 1,
  },
  "49": {
    formula: "(Users Using Feature ÷ Total Active Users) × 100",
    inputs: [
      { id: "featureUsers", label: "Users Using the Feature / Product" },
      { id: "totalUsers", label: "Total Active Users" },
    ],
    calculate: v => {
      const feat = parseFloat(v.featureUsers), total = parseFloat(v.totalUsers);
      if (!isFinite(feat) || !isFinite(total) || total === 0) return null;
      return (feat / total) * 100;
    },
    unit: "%", precision: 1,
  },
  "50": {
    formula: "(Customers with More Than 1 Purchase ÷ Total Customers) × 100",
    inputs: [
      { id: "repeat", label: "Customers with More Than 1 Purchase" },
      { id: "total", label: "Total Customers" },
    ],
    calculate: v => {
      const repeat = parseFloat(v.repeat), total = parseFloat(v.total);
      if (!isFinite(repeat) || !isFinite(total) || total === 0) return null;
      return (repeat / total) * 100;
    },
    unit: "%", precision: 1,
  },
  "51": {
    formula: "Total Customer Interactions ÷ Total Active Customers",
    inputs: [
      { id: "interactions", label: "Total Customer Interactions" },
      { id: "customers", label: "Total Active Customers" },
    ],
    calculate: v => {
      const inter = parseFloat(v.interactions), cust = parseFloat(v.customers);
      if (!isFinite(inter) || !isFinite(cust) || cust === 0) return null;
      return inter / cust;
    },
    unit: "interactions/customer", precision: 2,
  },
  "52": {
    formula: "(Customers Who Referred Others ÷ Total Customers) × 100",
    inputs: [
      { id: "referrers", label: "Customers Who Made a Referral" },
      { id: "total", label: "Total Customers" },
    ],
    calculate: v => {
      const ref = parseFloat(v.referrers), total = parseFloat(v.total);
      if (!isFinite(ref) || !isFinite(total) || total === 0) return null;
      return (ref / total) * 100;
    },
    unit: "%", precision: 1,
  },
  "53": {
    formula: "(Customer Spend with Your Company ÷ Total Customer Spend in Category) × 100",
    inputs: [
      { id: "yourSpend", label: "Customer Spend with Your Company ($)" },
      { id: "totalSpend", label: "Total Customer Spend in Category ($)" },
    ],
    calculate: v => {
      const yours = parseFloat(v.yourSpend), total = parseFloat(v.totalSpend);
      if (!isFinite(yours) || !isFinite(total) || total === 0) return null;
      return (yours / total) * 100;
    },
    unit: "%", precision: 1,
  },

  // ── OPERATIONAL ───────────────────────────────────────────────────────────────
  "54": {
    formula: "Availability (%) × Performance (%) × Quality (%) ÷ 10000",
    inputs: [
      { id: "availability", label: "Availability (%)" },
      { id: "performance", label: "Performance (%)" },
      { id: "quality", label: "Quality (%)" },
    ],
    calculate: v => {
      const a = parseFloat(v.availability), p = parseFloat(v.performance), q = parseFloat(v.quality);
      if (!isFinite(a) || !isFinite(p) || !isFinite(q)) return null;
      return (a / 100) * (p / 100) * (q / 100) * 100;
    },
    unit: "%", precision: 2,
  },
  "55": {
    formula: "Total Fulfillment Time ÷ Number of Orders",
    inputs: [
      { id: "totalTime", label: "Total Fulfillment Time (hours) across all orders" },
      { id: "orders", label: "Number of Orders" },
    ],
    calculate: v => {
      const time = parseFloat(v.totalTime), orders = parseFloat(v.orders);
      if (!isFinite(time) || !isFinite(orders) || orders === 0) return null;
      return time / orders;
    },
    unit: "hours/order", precision: 2,
  },
  "56": {
    formula: "Cost of Goods Sold ÷ Average Inventory Value",
    inputs: [
      { id: "cogs", label: "Cost of Goods Sold — COGS ($)" },
      { id: "avgInventory", label: "Average Inventory Value ($)" },
    ],
    calculate: v => {
      const cogs = parseFloat(v.cogs), inv = parseFloat(v.avgInventory);
      if (!isFinite(cogs) || !isFinite(inv) || inv === 0) return null;
      return cogs / inv;
    },
    unit: "x/year", precision: 2,
  },
  "57": {
    formula: "(Actual Output ÷ Maximum Possible Output) × 100",
    inputs: [
      { id: "actual", label: "Actual Output (units)" },
      { id: "max", label: "Maximum Possible Output (units)" },
    ],
    calculate: v => {
      const actual = parseFloat(v.actual), max = parseFloat(v.max);
      if (!isFinite(actual) || !isFinite(max) || max === 0) return null;
      return (actual / max) * 100;
    },
    unit: "%", precision: 1,
  },
  "58": {
    formula: "(Orders Delivered on Time ÷ Total Orders Delivered) × 100",
    inputs: [
      { id: "onTime", label: "Orders Delivered on Time" },
      { id: "total", label: "Total Orders Delivered" },
    ],
    calculate: v => {
      const onTime = parseFloat(v.onTime), total = parseFloat(v.total);
      if (!isFinite(onTime) || !isFinite(total) || total === 0) return null;
      return (onTime / total) * 100;
    },
    unit: "%", precision: 1,
  },
  "59": {
    formula: "Total Production Cost ÷ Total Units Produced",
    inputs: [
      { id: "cost", label: "Total Production Cost ($)" },
      { id: "units", label: "Total Units Produced" },
    ],
    calculate: v => {
      const cost = parseFloat(v.cost), units = parseFloat(v.units);
      if (!isFinite(cost) || !isFinite(units) || units === 0) return null;
      return cost / units;
    },
    unit: "$/unit", precision: 2,
  },
  "60": {
    formula: "Total Units Produced ÷ Time Period",
    inputs: [
      { id: "units", label: "Total Units Produced" },
      { id: "time", label: "Time Period (hours)" },
    ],
    calculate: v => {
      const units = parseFloat(v.units), time = parseFloat(v.time);
      if (!isFinite(units) || !isFinite(time) || time === 0) return null;
      return units / time;
    },
    unit: "units/hour", precision: 2,
  },
  "61": {
    formula: "Total Lead Time Across All Orders ÷ Number of Orders",
    inputs: [
      { id: "totalLeadTime", label: "Total Lead Time Across All Orders (days)" },
      { id: "orders", label: "Number of Orders" },
    ],
    calculate: v => {
      const time = parseFloat(v.totalLeadTime), orders = parseFloat(v.orders);
      if (!isFinite(time) || !isFinite(orders) || orders === 0) return null;
      return time / orders;
    },
    unit: "days", precision: 1,
  },
  "62": {
    formula: "((Recorded Inventory − Actual Inventory) ÷ Recorded Inventory) × 100",
    inputs: [
      { id: "recorded", label: "Recorded Inventory Value ($)" },
      { id: "actual", label: "Actual Inventory Value ($)" },
    ],
    calculate: v => {
      const rec = parseFloat(v.recorded), actual = parseFloat(v.actual);
      if (!isFinite(rec) || !isFinite(actual) || rec === 0) return null;
      return ((rec - actual) / rec) * 100;
    },
    unit: "%", precision: 2,
  },
  "63": {
    formula: "(Tasks Following Defined Process ÷ Total Tasks Completed) × 100",
    inputs: [
      { id: "adherent", label: "Tasks Following the Defined Process" },
      { id: "total", label: "Total Tasks Completed" },
    ],
    calculate: v => {
      const adh = parseFloat(v.adherent), total = parseFloat(v.total);
      if (!isFinite(adh) || !isFinite(total) || total === 0) return null;
      return (adh / total) * 100;
    },
    unit: "%", precision: 1,
  },
  "64": {
    formula: "Total Repair / Downtime ÷ Number of Repair Incidents",
    inputs: [
      { id: "totalTime", label: "Total Repair / Downtime (hours)" },
      { id: "incidents", label: "Number of Repair Incidents" },
    ],
    calculate: v => {
      const time = parseFloat(v.totalTime), incidents = parseFloat(v.incidents);
      if (!isFinite(time) || !isFinite(incidents) || incidents === 0) return null;
      return time / incidents;
    },
    unit: "hours", precision: 2,
  },

  // ── HR & PEOPLE ───────────────────────────────────────────────────────────────
  "65": {
    formula: "(Employees Who Left ÷ Average Headcount) × 100",
    inputs: [
      { id: "left", label: "Employees Who Left in Period" },
      { id: "headcount", label: "Average Headcount in Period" },
    ],
    calculate: v => {
      const left = parseFloat(v.left), hc = parseFloat(v.headcount);
      if (!isFinite(left) || !isFinite(hc) || hc === 0) return null;
      return (left / hc) * 100;
    },
    unit: "%", precision: 2,
  },
  "66": {
    formula: "Sum of All Survey Scores ÷ Number of Respondents",
    inputs: [
      { id: "totalScore", label: "Sum of All Survey Scores" },
      { id: "respondents", label: "Number of Respondents" },
    ],
    calculate: v => {
      const total = parseFloat(v.totalScore), resp = parseFloat(v.respondents);
      if (!isFinite(total) || !isFinite(resp) || resp === 0) return null;
      return total / resp;
    },
    unit: "(avg score)", precision: 2,
  },
  "67": {
    formula: "(Total Days Absent ÷ Total Available Working Days) × 100",
    inputs: [
      { id: "absent", label: "Total Days Absent (all employees combined)" },
      { id: "available", label: "Total Available Working Days (headcount × working days)" },
    ],
    calculate: v => {
      const absent = parseFloat(v.absent), avail = parseFloat(v.available);
      if (!isFinite(absent) || !isFinite(avail) || avail === 0) return null;
      return (absent / avail) * 100;
    },
    unit: "%", precision: 2,
  },
  "68": {
    formula: "Total Days from Job Post to Accepted Offer ÷ Number of Hires",
    inputs: [
      { id: "totalDays", label: "Total Days (all hires combined)" },
      { id: "hires", label: "Number of Hires" },
    ],
    calculate: v => {
      const days = parseFloat(v.totalDays), hires = parseFloat(v.hires);
      if (!isFinite(days) || !isFinite(hires) || hires === 0) return null;
      return days / hires;
    },
    unit: "days", precision: 1,
  },
  "69": {
    formula: "Total Hiring Costs ÷ Number of Hires",
    inputs: [
      { id: "totalCost", label: "Total Hiring Costs ($)" },
      { id: "hires", label: "Number of Hires" },
    ],
    calculate: v => {
      const cost = parseFloat(v.totalCost), hires = parseFloat(v.hires);
      if (!isFinite(cost) || !isFinite(hires) || hires === 0) return null;
      return cost / hires;
    },
    unit: "$/hire", precision: 2,
  },
  "70": {
    formula: "(Employees Who Completed Training ÷ Total Enrolled) × 100",
    inputs: [
      { id: "completed", label: "Employees Who Completed Training" },
      { id: "enrolled", label: "Total Enrolled" },
    ],
    calculate: v => {
      const comp = parseFloat(v.completed), enr = parseFloat(v.enrolled);
      if (!isFinite(comp) || !isFinite(enr) || enr === 0) return null;
      return (comp / enr) * 100;
    },
    unit: "%", precision: 1,
  },
  "71": {
    formula: "(Internal Promotions ÷ Total Promotions) × 100",
    inputs: [
      { id: "internal", label: "Number of Internal Promotions" },
      { id: "total", label: "Total Promotions (internal + external fills)" },
    ],
    calculate: v => {
      const int_ = parseFloat(v.internal), total = parseFloat(v.total);
      if (!isFinite(int_) || !isFinite(total) || total === 0) return null;
      return (int_ / total) * 100;
    },
    unit: "%", precision: 1,
  },
  "72": {
    formula: "(HR Staff ÷ Total Employees) × 100",
    inputs: [
      { id: "hrStaff", label: "Number of HR Staff" },
      { id: "employees", label: "Total Number of Employees" },
    ],
    calculate: v => {
      const hr = parseFloat(v.hrStaff), emp = parseFloat(v.employees);
      if (!isFinite(hr) || !isFinite(emp) || emp === 0) return null;
      return (hr / emp) * 100;
    },
    unit: "%", precision: 2,
  },
  "73": {
    formula: "(High Performers ÷ Total Employees) × 100",
    inputs: [
      { id: "highPerformers", label: "Number of High Performers" },
      { id: "total", label: "Total Employees" },
    ],
    calculate: v => {
      const hp = parseFloat(v.highPerformers), total = parseFloat(v.total);
      if (!isFinite(hp) || !isFinite(total) || total === 0) return null;
      return (hp / total) * 100;
    },
    unit: "%", precision: 1,
  },
  "74": {
    formula: "Sum of Manager Effectiveness Scores ÷ Number of Respondents",
    inputs: [
      { id: "totalScore", label: "Sum of All Manager Effectiveness Scores" },
      { id: "respondents", label: "Number of Respondents" },
    ],
    calculate: v => {
      const total = parseFloat(v.totalScore), resp = parseFloat(v.respondents);
      if (!isFinite(total) || !isFinite(resp) || resp === 0) return null;
      return total / resp;
    },
    unit: "(avg score)", precision: 2,
  },
  "75": {
    formula: "(Top Performers Retained ÷ Total Top Performers at Start) × 100",
    inputs: [
      { id: "retained", label: "Top Performers Still at Company" },
      { id: "total", label: "Total Top Performers at Start of Period" },
    ],
    calculate: v => {
      const ret = parseFloat(v.retained), total = parseFloat(v.total);
      if (!isFinite(ret) || !isFinite(total) || total === 0) return null;
      return (ret / total) * 100;
    },
    unit: "%", precision: 1,
  },

  // ── TECHNOLOGY / IT ───────────────────────────────────────────────────────────
  "76": {
    formula: "((Total Time − Downtime) ÷ Total Time) × 100",
    inputs: [
      { id: "totalTime", label: "Total Time in Period (hours)" },
      { id: "downtime", label: "Total Downtime in Period (hours)" },
    ],
    calculate: v => {
      const total = parseFloat(v.totalTime), down = parseFloat(v.downtime);
      if (!isFinite(total) || !isFinite(down) || total === 0) return null;
      return ((total - down) / total) * 100;
    },
    unit: "%", precision: 3,
  },
  "77": {
    formula: "Total Uptime ÷ Number of Failures",
    inputs: [
      { id: "uptime", label: "Total Uptime (hours)" },
      { id: "failures", label: "Number of Failures" },
    ],
    calculate: v => {
      const uptime = parseFloat(v.uptime), failures = parseFloat(v.failures);
      if (!isFinite(uptime) || !isFinite(failures) || failures === 0) return null;
      return uptime / failures;
    },
    unit: "hours", precision: 2,
  },
  "78": {
    formula: "(Total IT Costs ÷ Total Revenue) × 100",
    inputs: [
      { id: "itCosts", label: "Total IT Costs ($)" },
      { id: "revenue", label: "Total Revenue ($)" },
    ],
    calculate: v => {
      const it = parseFloat(v.itCosts), rev = parseFloat(v.revenue);
      if (!isFinite(it) || !isFinite(rev) || rev === 0) return null;
      return (it / rev) * 100;
    },
    unit: "%", precision: 2,
  },
  "79": {
    formula: "Total Resolution Time ÷ Number of Incidents",
    inputs: [
      { id: "totalTime", label: "Total Resolution Time (hours)" },
      { id: "incidents", label: "Number of Incidents" },
    ],
    calculate: v => {
      const time = parseFloat(v.totalTime), inc = parseFloat(v.incidents);
      if (!isFinite(time) || !isFinite(inc) || inc === 0) return null;
      return time / inc;
    },
    unit: "hours/incident", precision: 2,
  },
  "80": {
    formula: "(Remediation Cost ÷ Total Development Cost) × 100",
    inputs: [
      { id: "remediationCost", label: "Cost to Remediate Technical Debt ($)" },
      { id: "devCost", label: "Total Development Cost ($)" },
    ],
    calculate: v => {
      const rem = parseFloat(v.remediationCost), dev = parseFloat(v.devCost);
      if (!isFinite(rem) || !isFinite(dev) || dev === 0) return null;
      return (rem / dev) * 100;
    },
    unit: "%", precision: 2,
  },
  "81": {
    formula: "Total Deployments ÷ Number of Weeks",
    inputs: [
      { id: "deployments", label: "Total Number of Deployments" },
      { id: "weeks", label: "Number of Weeks in Period" },
    ],
    calculate: v => {
      const dep = parseFloat(v.deployments), weeks = parseFloat(v.weeks);
      if (!isFinite(dep) || !isFinite(weeks) || weeks === 0) return null;
      return dep / weeks;
    },
    unit: "deploys/week", precision: 2,
  },
  "82": {
    formula: "(Failed / Rolled-back Changes ÷ Total Changes Deployed) × 100",
    inputs: [
      { id: "failed", label: "Failed or Rolled-back Changes" },
      { id: "total", label: "Total Changes Deployed" },
    ],
    calculate: v => {
      const failed = parseFloat(v.failed), total = parseFloat(v.total);
      if (!isFinite(failed) || !isFinite(total) || total === 0) return null;
      return (failed / total) * 100;
    },
    unit: "%", precision: 2,
  },
  "83": {
    formula: "Total Response Time ÷ Number of API Requests",
    inputs: [
      { id: "totalTime", label: "Total Response Time (milliseconds)" },
      { id: "requests", label: "Number of API Requests" },
    ],
    calculate: v => {
      const time = parseFloat(v.totalTime), req = parseFloat(v.requests);
      if (!isFinite(time) || !isFinite(req) || req === 0) return null;
      return time / req;
    },
    unit: "ms", precision: 2,
  },
  "84": {
    formula: "(Valid / Accurate Records ÷ Total Records) × 100",
    inputs: [
      { id: "valid", label: "Valid / Accurate Records" },
      { id: "total", label: "Total Records" },
    ],
    calculate: v => {
      const valid = parseFloat(v.valid), total = parseFloat(v.total);
      if (!isFinite(valid) || !isFinite(total) || total === 0) return null;
      return (valid / total) * 100;
    },
    unit: "%", precision: 2,
  },
  "85": {
    formula: "(Active Users ÷ Licenses Purchased) × 100",
    inputs: [
      { id: "activeUsers", label: "Active Users (currently using the software)" },
      { id: "licenses", label: "Total Licenses / Seats Purchased" },
    ],
    calculate: v => {
      const active = parseFloat(v.activeUsers), lic = parseFloat(v.licenses);
      if (!isFinite(active) || !isFinite(lic) || lic === 0) return null;
      return (active / lic) * 100;
    },
    unit: "%", precision: 1,
  },

  // ── E-COMMERCE / DIGITAL ──────────────────────────────────────────────────────
  "86": {
    formula: "((Carts Created − Completed Purchases) ÷ Carts Created) × 100",
    inputs: [
      { id: "carts", label: "Carts Created / Initiated" },
      { id: "purchases", label: "Completed Purchases" },
    ],
    calculate: v => {
      const carts = parseFloat(v.carts), purchases = parseFloat(v.purchases);
      if (!isFinite(carts) || !isFinite(purchases) || carts === 0) return null;
      return ((carts - purchases) / carts) * 100;
    },
    unit: "%", precision: 2,
  },
  "87": {
    formula: "Total Revenue ÷ Total Number of Orders",
    inputs: [
      { id: "revenue", label: "Total Revenue ($)" },
      { id: "orders", label: "Total Number of Orders" },
    ],
    calculate: v => {
      const rev = parseFloat(v.revenue), orders = parseFloat(v.orders);
      if (!isFinite(rev) || !isFinite(orders) || orders === 0) return null;
      return rev / orders;
    },
    unit: "$/order", precision: 2,
  },
  "88": {
    formula: "Total Revenue ÷ Total Site Visitors",
    inputs: [
      { id: "revenue", label: "Total Revenue ($)" },
      { id: "visitors", label: "Total Site Visitors" },
    ],
    calculate: v => {
      const rev = parseFloat(v.revenue), vis = parseFloat(v.visitors);
      if (!isFinite(rev) || !isFinite(vis) || vis === 0) return null;
      return rev / vis;
    },
    unit: "$/visitor", precision: 2,
  },
  "89": {
    formula: "Revenue Generated from Ads ÷ Total Ad Spend",
    inputs: [
      { id: "revenue", label: "Revenue Generated from Ads ($)" },
      { id: "spend", label: "Total Ad Spend ($)" },
    ],
    calculate: v => {
      const rev = parseFloat(v.revenue), spend = parseFloat(v.spend);
      if (!isFinite(rev) || !isFinite(spend) || spend === 0) return null;
      return rev / spend;
    },
    unit: "x", precision: 2,
  },
  "90": {
    formula: "(Completed Checkouts ÷ Initiated Checkouts) × 100",
    inputs: [
      { id: "completed", label: "Completed Checkouts" },
      { id: "initiated", label: "Initiated Checkouts" },
    ],
    calculate: v => {
      const comp = parseFloat(v.completed), init = parseFloat(v.initiated);
      if (!isFinite(comp) || !isFinite(init) || init === 0) return null;
      return (comp / init) * 100;
    },
    unit: "%", precision: 1,
  },
  "91": {
    formula: "(Exits from Search Results Page ÷ Total Searches) × 100",
    inputs: [
      { id: "exits", label: "Exits from Search Results Page" },
      { id: "searches", label: "Total Searches" },
    ],
    calculate: v => {
      const exits = parseFloat(v.exits), searches = parseFloat(v.searches);
      if (!isFinite(exits) || !isFinite(searches) || searches === 0) return null;
      return (exits / searches) * 100;
    },
    unit: "%", precision: 1,
  },
  "92": {
    formula: "(Wishlist Items Purchased ÷ Total Wishlist Items Added) × 100",
    inputs: [
      { id: "purchased", label: "Wishlist Items Purchased" },
      { id: "added", label: "Total Wishlist Items Added" },
    ],
    calculate: v => {
      const purch = parseFloat(v.purchased), added = parseFloat(v.added);
      if (!isFinite(purch) || !isFinite(added) || added === 0) return null;
      return (purch / added) * 100;
    },
    unit: "%", precision: 1,
  },
  "93": {
    formula: "(Failed Payments ÷ Total Payment Attempts) × 100",
    inputs: [
      { id: "failed", label: "Failed Payment Attempts" },
      { id: "total", label: "Total Payment Attempts" },
    ],
    calculate: v => {
      const failed = parseFloat(v.failed), total = parseFloat(v.total);
      if (!isFinite(failed) || !isFinite(total) || total === 0) return null;
      return (failed / total) * 100;
    },
    unit: "%", precision: 2,
  },
  "94": {
    formula: "(Number of Refunds ÷ Total Orders) × 100",
    inputs: [
      { id: "refunds", label: "Number of Refunds" },
      { id: "orders", label: "Total Orders" },
    ],
    calculate: v => {
      const ref = parseFloat(v.refunds), orders = parseFloat(v.orders);
      if (!isFinite(ref) || !isFinite(orders) || orders === 0) return null;
      return (ref / orders) * 100;
    },
    unit: "%", precision: 2,
  },
  "95": {
    formula: "Mobile: (Mobile Conversions ÷ Mobile Visitors) × 100   |   Desktop: (Desktop Conversions ÷ Desktop Visitors) × 100",
    inputs: [
      { id: "mobileConv", label: "Mobile Conversions" },
      { id: "mobileVis", label: "Mobile Visitors" },
      { id: "desktopConv", label: "Desktop Conversions" },
      { id: "desktopVis", label: "Desktop Visitors" },
    ],
    calculate: v => {
      const mConv = parseFloat(v.mobileConv), mVis = parseFloat(v.mobileVis);
      const dConv = parseFloat(v.desktopConv), dVis = parseFloat(v.desktopVis);
      if ([mConv, mVis, dConv, dVis].some(x => !isFinite(x)) || mVis === 0 || dVis === 0) return null;
      const mRate = (mConv / mVis) * 100;
      const dRate = (dConv / dVis) * 100;
      return `Mobile: ${mRate.toFixed(1)}%   |   Desktop: ${dRate.toFixed(1)}%`;
    },
    unit: "", precision: 1, multiResult: true,
  },
};
