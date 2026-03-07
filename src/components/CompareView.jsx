import { chartIcons } from '../data/kpis';

const catDotColor = {
  Financial: '#34d399', Sales: '#60a5fa', Marketing: '#a78bfa',
  Customer: '#fb923c', Operational: '#22d3ee', 'HR & People': '#f472b6',
  'Technology / IT': '#818cf8', 'E-commerce / Digital': '#facc15',
};

const typeStyle = {
  Core:           { background: 'rgba(59,130,246,0.15)',   color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)' },
  Supporting:     { background: 'rgba(100,116,139,0.15)',  color: '#94a3b8', border: '1px solid rgba(100,116,139,0.3)' },
  Advanced:       { background: 'rgba(139,92,246,0.15)',   color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)' },
  'Lesser-Known': { background: 'rgba(100,116,139,0.12)', color: '#94a3b8', border: '1px solid rgba(100,116,139,0.25)' },
};

const LABEL_W = 140;
const CELL_PAD = '20px 24px';
const LABEL_PAD = '20px 20px';
const DIVIDER = '1px solid rgba(51,65,85,0.35)';

export default function CompareView({ compareList, onRemove, onClose }) {
  if (compareList.length === 0) return null;
  const cols = Math.min(compareList.length, 3);
  const items = compareList.slice(0, cols);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '48px 24px 48px',
        overflowY: 'auto',
        backgroundColor: 'rgba(0,0,10,0.78)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 900,
          borderRadius: 16,
          border: '1px solid rgba(51,65,85,0.55)',
          backgroundColor: '#0d1526',
          boxShadow: '0 30px 70px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}
      >
        {/* Modal header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 28px', borderBottom: DIVIDER }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>KPI Comparison</h2>
            <p style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
              Comparing {compareList.length} KPI{compareList.length > 1 ? 's' : ''} side by side
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ padding: 6, borderRadius: 8, background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}
            onMouseOver={e => e.currentTarget.style.color = '#94a3b8'}
            onMouseOut={e => e.currentTarget.style.color = '#475569'}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <colgroup>
              <col style={{ width: LABEL_W }} />
              {items.map((_, i) => <col key={i} />)}
            </colgroup>

            {/* KPI name header row */}
            <thead>
              <tr>
                <th style={{ padding: LABEL_PAD, borderBottom: DIVIDER, background: 'rgba(8,15,35,0.4)' }} />
                {items.map(kpi => {
                  const dot = catDotColor[kpi.category] || '#818cf8';
                  return (
                    <th key={kpi.id} style={{ padding: CELL_PAD, borderBottom: DIVIDER, borderLeft: DIVIDER, background: 'rgba(8,15,35,0.4)', textAlign: 'left', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                        <div>
                          <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: '0 0 8px', lineHeight: 1.35 }}>{kpi.name}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, display: 'inline-block', flexShrink: 0 }} />
                            <span style={{ fontSize: 12, color: dot, fontWeight: 500 }}>{kpi.category}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemove(kpi)}
                          style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', padding: 2, flexShrink: 0 }}
                          onMouseOver={e => e.currentTarget.style.color = '#64748b'}
                          onMouseOut={e => e.currentTarget.style.color = '#334155'}
                        >
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {/* Type */}
              <tr>
                <td style={{ padding: LABEL_PAD, borderBottom: DIVIDER, fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', verticalAlign: 'middle' }}>
                  Type
                </td>
                {items.map(kpi => {
                  const s = typeStyle[kpi.type] || typeStyle.Supporting;
                  return (
                    <td key={kpi.id} style={{ padding: CELL_PAD, borderBottom: DIVIDER, borderLeft: DIVIDER, verticalAlign: 'middle' }}>
                      <span style={{ ...s, padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500 }}>{kpi.type}</span>
                    </td>
                  );
                })}
              </tr>

              {/* Description */}
              <tr>
                <td style={{ padding: LABEL_PAD, borderBottom: DIVIDER, fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', verticalAlign: 'top', paddingTop: 22 }}>
                  Description
                </td>
                {items.map(kpi => (
                  <td key={kpi.id} style={{ padding: CELL_PAD, borderBottom: DIVIDER, borderLeft: DIVIDER, fontSize: 13, color: '#cbd5e1', lineHeight: 1.65, verticalAlign: 'top' }}>
                    {kpi.description}
                  </td>
                ))}
              </tr>

              {/* Best Chart */}
              <tr>
                <td style={{ padding: LABEL_PAD, borderBottom: DIVIDER, fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', verticalAlign: 'top', paddingTop: 22 }}>
                  Best Chart
                </td>
                {items.map(kpi => {
                  const dot = catDotColor[kpi.category] || '#818cf8';
                  const icon = chartIcons[kpi.chartType] || '📊';
                  const explainer = kpi.chartRecommendation?.split('—')[1]?.trim() || kpi.chartRecommendation?.split('–')[1]?.trim() || '';
                  return (
                    <td key={kpi.id} style={{ padding: CELL_PAD, borderBottom: DIVIDER, borderLeft: DIVIDER, verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: explainer ? 8 : 0 }}>
                        <span style={{ fontSize: 18 }}>{icon}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: dot }}>{kpi.chartType || '—'}</span>
                      </div>
                      {explainer && (
                        <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.6 }}>{explainer}</p>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Focus Areas */}
              <tr>
                <td style={{ padding: LABEL_PAD, borderBottom: DIVIDER, fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', verticalAlign: 'top', paddingTop: 22 }}>
                  Focus Areas
                </td>
                {items.map(kpi => (
                  <td key={kpi.id} style={{ padding: CELL_PAD, borderBottom: DIVIDER, borderLeft: DIVIDER, verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {kpi.generalTags.map(tag => (
                        <span key={tag} style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, background: 'rgba(109,40,217,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#c4b5fd' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Key Variables */}
              <tr>
                <td style={{ padding: LABEL_PAD, fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', verticalAlign: 'top', paddingTop: 22 }}>
                  Key Variables
                </td>
                {items.map(kpi => (
                  <td key={kpi.id} style={{ padding: CELL_PAD, borderLeft: DIVIDER, verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {kpi.variableTags.slice(0, 6).map(tag => (
                        <span key={tag} style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(51,65,85,0.4)', color: '#64748b' }}>
                          {tag}
                        </span>
                      ))}
                      {kpi.variableTags.length > 6 && (
                        <span style={{ fontSize: 12, color: '#334155', padding: '4px 0' }}>+{kpi.variableTags.length - 6} more</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
