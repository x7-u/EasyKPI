import { useState } from 'react';
import { kpiFormulas } from '../data/kpi_formulas';

const catDotColor = {
  Financial: '#34d399', Sales: '#60a5fa', Marketing: '#a78bfa',
  Customer: '#fb923c', Operational: '#22d3ee', 'HR & People': '#f472b6',
  'Technology / IT': '#818cf8', 'E-commerce / Digital': '#facc15',
};

function formatNumber(n, precision) {
  const fixed = Math.abs(n).toFixed(precision);
  const parts = fixed.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (n < 0 ? '-' : '') + parts.join('.');
}

export default function KPICalculator({ kpi, onClose }) {
  const formulaDef = kpiFormulas[kpi.id];
  const [values, setValues] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const dotColor = catDotColor[kpi.category] || '#818cf8';

  if (!formulaDef) return null;

  const handleChange = (id, value) => {
    setValues(prev => ({ ...prev, [id]: value }));
    setResult(null);
    setError(null);
  };

  const handleCalculate = () => {
    const r = formulaDef.calculate(values);
    if (r === null) {
      setError('Please fill in all fields with valid numbers.');
      setResult(null);
    } else {
      setResult(r);
      setError(null);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') handleCalculate();
    if (e.key === 'Escape') onClose();
  };

  const displayResult = () => {
    if (typeof result === 'string') return result;
    const formatted = formatNumber(result, formulaDef.precision);
    return formulaDef.unit ? `${formatted} ${formulaDef.unit}` : formatted;
  };

  return (
    <div
      onClick={onClose}
      onKeyDown={handleKeyDown}
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        backgroundColor: 'rgba(0,0,10,0.75)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 480,
          maxHeight: '90vh',
          borderRadius: 16,
          border: '1px solid rgba(51,65,85,0.6)',
          backgroundColor: '#0d1526',
          boxShadow: '0 25px 60px rgba(0,0,0,0.65)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Accent bar */}
        <div style={{ height: 3, background: dotColor, flexShrink: 0 }} />

        {/* Header */}
        <div style={{ padding: '20px 24px 16px', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div>
              <p style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#475569', margin: '0 0 6px',
              }}>
                KPI Calculator
              </p>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: 0, lineHeight: 1.3 }}>
                {kpi.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                padding: 6, borderRadius: 8, background: 'none', border: 'none',
                color: '#475569', cursor: 'pointer', flexShrink: 0, marginTop: 2,
              }}
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
        <div style={{
          flex: 1, overflowY: 'auto', padding: '20px 24px',
          display: 'flex', flexDirection: 'column', gap: 18,
        }}>

          {/* Formula display */}
          <div style={{
            background: 'rgba(8,15,35,0.8)',
            border: `1px solid ${dotColor}35`,
            borderRadius: 10, padding: '14px 16px',
          }}>
            <p style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#475569', margin: '0 0 8px',
            }}>
              Formula
            </p>
            <p style={{
              fontSize: 13, color: dotColor, margin: 0, lineHeight: 1.65,
              fontFamily: "'Courier New', Courier, monospace", fontWeight: 500,
            }}>
              {formulaDef.formula}
            </p>
          </div>

          {/* Input fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {formulaDef.inputs.map(input => (
              <div key={input.id}>
                <label style={{
                  display: 'block', fontSize: 12, color: '#94a3b8',
                  marginBottom: 5, fontWeight: 500,
                }}>
                  {input.label}
                </label>
                <input
                  type="number"
                  value={values[input.id] ?? ''}
                  onChange={e => handleChange(input.id, e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter value..."
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '9px 12px', borderRadius: 8, fontSize: 13,
                    background: 'rgba(15,23,42,0.9)',
                    border: '1px solid rgba(71,85,105,0.5)',
                    color: '#e2e8f0', outline: 'none',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = dotColor + '90'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(71,85,105,0.5)'}
                />
              </div>
            ))}
          </div>

          {/* Error message */}
          {error && (
            <p style={{
              fontSize: 12, color: '#f87171', margin: 0,
              padding: '8px 12px',
              background: 'rgba(239,68,68,0.08)',
              borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)',
            }}>
              {error}
            </p>
          )}

          {/* Result */}
          {result !== null && (
            <div style={{
              background: `${dotColor}12`,
              border: `1px solid ${dotColor}40`,
              borderRadius: 10, padding: '16px',
              textAlign: 'center',
            }}>
              <p style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#475569', margin: '0 0 10px',
              }}>
                Result
              </p>
              <p style={{
                fontSize: typeof result === 'string' ? 15 : 30,
                fontWeight: 700, color: dotColor, margin: 0,
                lineHeight: 1.25,
                letterSpacing: typeof result === 'string' ? 0 : '-0.5px',
              }}>
                {displayResult()}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px 20px',
          borderTop: '1px solid rgba(51,65,85,0.35)',
          flexShrink: 0,
        }}>
          <button
            onClick={handleCalculate}
            style={{
              width: '100%', padding: '11px 0', borderRadius: 10,
              fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
              background: `${dotColor}22`,
              border: `1px solid ${dotColor}55`,
              color: dotColor,
            }}
            onMouseOver={e => e.currentTarget.style.background = `${dotColor}38`}
            onMouseOut={e => e.currentTarget.style.background = `${dotColor}22`}
          >
            Calculate
          </button>
        </div>
      </div>
    </div>
  );
}
