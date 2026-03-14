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

export default function KPIDetail({ kpi, onClose, onCompareToggle, isComparing, onTagClick, onCategoryClick, onCalculate }) {
  if (!kpi) return null;

  const dotColor = catDotColor[kpi.category] || '#818cf8';
  const badge = typeStyle[kpi.type] || typeStyle.Supporting;
  const icon = chartIcons[kpi.chartType] || '📊';
  const chartExplainer =
    kpi.chartRecommendation?.split('—')[1]?.trim() ||
    kpi.chartRecommendation?.split('–')[1]?.trim() ||
    kpi.chartRecommendation || '';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        backgroundColor: 'rgba(0,0,10,0.72)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 560,
          maxHeight: '88vh',
          borderRadius: 16,
          border: '1px solid rgba(51,65,85,0.6)',
          backgroundColor: '#0d1526',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Accent bar */}
        <div style={{ height: 3, background: dotColor, flexShrink: 0 }} />

        {/* Header */}
        <div style={{ padding: '24px 28px 20px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, display: 'inline-block' }} />
                <button
                onClick={() => onCategoryClick(kpi.category)}
                style={{ fontSize: 12, fontWeight: 600, color: dotColor, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: 3 }}
              >
                {kpi.category}
              </button>
                <span style={{ color: '#334155' }}>·</span>
                <span style={{ ...badge, padding: '2px 9px', borderRadius: 6, fontSize: 11, fontWeight: 500 }}>
                  {kpi.type}
                </span>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: 0, lineHeight: 1.3 }}>
                {kpi.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{ padding: 6, borderRadius: 8, background: 'none', border: 'none', color: '#475569', cursor: 'pointer', flexShrink: 0, marginTop: 2 }}
              onMouseOver={e => e.currentTarget.style.color = '#94a3b8'}
              onMouseOut={e => e.currentTarget.style.color = '#475569'}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(51,65,85,0.4)', flexShrink: 0 }} />

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* What it measures */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#475569', marginBottom: 8 }}>
              What it measures
            </p>
            <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.65, margin: 0 }}>
              {kpi.description}
            </p>
          </div>

          {/* Chart recommendation */}
          {kpi.chartType && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#475569', marginBottom: 10 }}>
                Recommended visualisation
              </p>
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                background: 'rgba(8,15,35,0.6)', border: '1px solid rgba(51,65,85,0.35)',
                borderRadius: 10, padding: '14px 16px',
              }}>
                <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{icon}</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: dotColor, margin: '0 0 6px' }}>{kpi.chartType}</p>
                  {chartExplainer && (
                    <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>{chartExplainer}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Focus areas */}
          {kpi.generalTags.length > 0 && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#475569', marginBottom: 10 }}>
                Focus areas
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {kpi.generalTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => onTagClick(tag)}
                    style={{
                      padding: '5px 12px', borderRadius: 7, fontSize: 12, cursor: 'pointer',
                      background: 'rgba(109,40,217,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#c4b5fd',
                      transition: 'all 0.15s',
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(109,40,217,0.25)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(109,40,217,0.12)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)'; }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Key variables */}
          {kpi.variableTags.length > 0 && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#475569', marginBottom: 10 }}>
                Key variables
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {kpi.variableTags.map(tag => (
                  <span key={tag} style={{
                    padding: '5px 12px', borderRadius: 7, fontSize: 12,
                    background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(51,65,85,0.4)', color: '#64748b',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 28px 24px', borderTop: '1px solid rgba(51,65,85,0.35)', flexShrink: 0, display: 'flex', gap: 10 }}>
          <button
            onClick={() => onCompareToggle(kpi)}
            style={{
              flex: 1, padding: '11px 0', borderRadius: 10,
              fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
              background: isComparing ? 'rgba(109,40,217,0.25)' : 'rgba(109,40,217,0.15)',
              border: '1px solid rgba(139,92,246,0.4)',
              color: '#c4b5fd',
            }}
          >
            {isComparing ? '✓ Remove from Compare' : '+ Add to Compare'}
          </button>
          <button
            onClick={() => onCalculate(kpi)}
            style={{
              padding: '11px 20px', borderRadius: 10,
              fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
              background: `${dotColor}20`,
              border: `1px solid ${dotColor}50`,
              color: dotColor,
              flexShrink: 0,
            }}
            onMouseOver={e => e.currentTarget.style.background = `${dotColor}35`}
            onMouseOut={e => e.currentTarget.style.background = `${dotColor}20`}
          >
            Calculate
          </button>
        </div>
      </div>
    </div>
  );
}
