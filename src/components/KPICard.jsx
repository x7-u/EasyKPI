import { chartIcons } from '../data/kpis';

const catDotColor = {
  Financial: '#34d399', Sales: '#60a5fa', Marketing: '#a78bfa',
  Customer: '#fb923c', Operational: '#22d3ee', 'HR & People': '#f472b6',
  'Technology / IT': '#818cf8', 'E-commerce / Digital': '#facc15',
};

const typeStyleMap = {
  Core:           { background: 'rgba(59,130,246,0.15)',   color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)' },
  Supporting:     { background: 'rgba(100,116,139,0.15)',  color: '#94a3b8', border: '1px solid rgba(100,116,139,0.3)' },
  Advanced:       { background: 'rgba(139,92,246,0.15)',   color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)' },
  'Lesser-Known': { background: 'rgba(100,116,139,0.12)', color: '#94a3b8', border: '1px solid rgba(100,116,139,0.25)' },
};

export default function KPICard({ kpi, isComparing, onCompareToggle, onSelect, onTagClick, onCategoryClick, onCalculate, selectedTags = [], selectedCategories = [] }) {
  const icon = chartIcons[kpi.chartType] || '📊';
  const dotColor = catDotColor[kpi.category] || '#818cf8';
  const typeStyle = typeStyleMap[kpi.type] || typeStyleMap.Supporting;

  return (
    <div
      onClick={() => onSelect(kpi)}
      style={{
        display: 'flex', flexDirection: 'column',
        borderRadius: 12, overflow: 'hidden',
        border: '1px solid',
        borderColor: isComparing ? 'rgba(139,92,246,0.5)' : 'rgba(51,65,85,0.4)',
        background: isComparing ? 'rgba(109,40,217,0.07)' : 'rgba(15,23,42,0.6)',
        cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s',
      }}
      onMouseOver={e => { if (!isComparing) { e.currentTarget.style.borderColor = 'rgba(71,85,105,0.65)'; e.currentTarget.style.background = 'rgba(15,23,42,0.85)'; }}}
      onMouseOut={e => { if (!isComparing) { e.currentTarget.style.borderColor = 'rgba(51,65,85,0.4)'; e.currentTarget.style.background = 'rgba(15,23,42,0.6)'; }}}
    >
      {/* Accent bar */}
      <div style={{ height: 3, background: dotColor, opacity: 0.7 }} />

      {/* Body */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>

        {/* Name + type badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', lineHeight: 1.4, margin: 0, flex: 1 }}>
            {kpi.name}
          </h3>
          <span style={{ ...typeStyle, padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0 }}>
            {kpi.type}
          </span>
        </div>

        {/* Clickable category */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
          <button
            onClick={e => { e.stopPropagation(); onCategoryClick(kpi.category); }}
            style={{ fontSize: 12, fontWeight: 500, color: dotColor, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: 3 }}
          >
            {kpi.category}
          </button>
        </div>

        {/* Description */}
        <p style={{
          fontSize: 12, color: '#94a3b8', lineHeight: 1.55, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {kpi.description}
        </p>

        {/* Chart recommendation */}
        {kpi.chartType && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(8,15,35,0.6)', border: '1px solid rgba(51,65,85,0.3)',
            borderRadius: 8, padding: '8px 12px',
          }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 10, color: '#475569', margin: '0 0 2px', fontWeight: 500 }}>Recommended chart</p>
              <p style={{ fontSize: 12, fontWeight: 600, color: dotColor, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {kpi.chartType}
              </p>
            </div>
          </div>
        )}

        {/* Clickable focus area tags */}
        {kpi.generalTags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {kpi.generalTags.map(tag => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={e => { e.stopPropagation(); onTagClick(tag); }}
                  style={{
                    padding: '3px 9px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                    transition: 'all 0.15s',
                    background: active ? 'rgba(109,40,217,0.3)' : 'rgba(109,40,217,0.1)',
                    border: active ? '1px solid rgba(139,92,246,0.6)' : '1px solid rgba(139,92,246,0.2)',
                    color: active ? '#e9d5ff' : '#a78bfa',
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {active ? '✓ ' : ''}{tag}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer: Compare + Calculate */}
      <div style={{ padding: '0 16px 14px', display: 'flex', gap: 8 }}>
        <button
          onClick={e => { e.stopPropagation(); onCompareToggle(kpi); }}
          style={{
            flex: 1, padding: '6px 0', borderRadius: 8, fontSize: 12, fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.15s',
            ...(isComparing
              ? { background: 'rgba(109,40,217,0.2)', border: '1px solid rgba(139,92,246,0.45)', color: '#c4b5fd' }
              : { background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(51,65,85,0.35)', color: '#64748b' })
          }}
        >
          {isComparing ? '✓ In Compare' : '+ Compare'}
        </button>
        <button
          onClick={e => { e.stopPropagation(); onCalculate(kpi); }}
          style={{
            padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
            background: `${dotColor}15`,
            border: `1px solid ${dotColor}35`,
            color: dotColor,
          }}
          onMouseOver={e => { e.currentTarget.style.background = `${dotColor}28`; e.currentTarget.style.borderColor = `${dotColor}60`; }}
          onMouseOut={e => { e.currentTarget.style.background = `${dotColor}15`; e.currentTarget.style.borderColor = `${dotColor}35`; }}
        >
          Calculate
        </button>
      </div>
    </div>
  );
}
