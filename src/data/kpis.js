import rawData from '../kpi_data.json';

export const kpis = rawData;

export const categories = [
  'Financial',
  'Sales',
  'Marketing',
  'Customer',
  'Operational',
  'HR & People',
  'Technology / IT',
  'E-commerce / Digital',
];

export const generalTags = [
  'Cost Management',
  'Customer Acquisition',
  'Customer Experience',
  'Customer Retention',
  'Data & Analytics',
  'Digital Performance',
  'Financial Health',
  'Growth',
  'Marketing & Brand',
  'Pricing',
  'Process Efficiency',
  'Product',
  'Profitability',
  'Quality',
  'Revenue',
  'Risk',
  'Supply Chain',
  'Technology & Systems',
  'Workforce',
];

export const chartIcons = {
  'Line Chart': '📈',
  'Bar Chart': '📊',
  'Column Chart': '📊',
  'Stacked Bar Chart': '📊',
  'Stacked Column Chart': '📊',
  'Grouped Bar Chart': '📊',
  'Area Chart': '📉',
  'Waterfall Chart': '🪜',
  'Funnel Chart': '🔻',
  'Donut Chart': '🍩',
  'Gauge Chart': '🎯',
  'Combo Chart (Bar + Line)': '📊',
  'Bullet Chart': '🎯',
  'Radar Chart': '🕸️',
  'Heatmap': '🔥',
  'Histogram': '📊',
  'Box Plot': '📦',
};

export const categoryColors = {
  Financial: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  Sales: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', dot: 'bg-blue-400' },
  Marketing: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', dot: 'bg-purple-400' },
  Customer: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', dot: 'bg-orange-400' },
  Operational: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', dot: 'bg-cyan-400' },
  'HR & People': { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400', dot: 'bg-pink-400' },
  'Technology / IT': { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-400', dot: 'bg-indigo-400' },
  'E-commerce / Digital': { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', dot: 'bg-yellow-400' },
};

export const typeColors = {
  Core: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/40' },
  Supporting: { bg: 'bg-slate-500/20', text: 'text-slate-300', border: 'border-slate-500/40' },
  Advanced: { bg: 'bg-violet-500/20', text: 'text-violet-300', border: 'border-violet-500/40' },
};
