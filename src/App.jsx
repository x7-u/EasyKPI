import { useState, useMemo } from 'react';
import { kpis, categories, generalTags, categoryColors } from './data/kpis';
import KPICard from './components/KPICard';
import KPIDetail from './components/KPIDetail';
import CompareView from './components/CompareView';
import KPICalculator from './components/KPICalculator';

const CONTAINER = { maxWidth: 1100, margin: '0 auto', width: '100%', padding: '0 24px' };

export default function App() {
  const [mode, setMode] = useState('tags');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagsPanel, setShowTagsPanel] = useState(false);
  const [showAll, setShowAll] = useState(true);
  const [selectedKPI, setSelectedKPI] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [calculatorKPI, setCalculatorKPI] = useState(null);

  const filteredKPIs = useMemo(() => {
    let result = kpis;
    if (mode === 'tags') {
      if (showAll) return [...result].sort((a, b) => a.name.localeCompare(b.name));
      if (selectedCategories.length > 0)
        result = result.filter(k => selectedCategories.includes(k.category));
      if (selectedTags.length > 0)
        result = result.filter(k => selectedTags.every(t => k.generalTags.includes(t)));
      if (selectedCategories.length === 0 && selectedTags.length === 0) return [];
    } else {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return [];
      result = result.filter(k =>
        k.name.toLowerCase().includes(q) ||
        k.description.toLowerCase().includes(q) ||
        k.generalTags.some(t => t.toLowerCase().includes(q)) ||
        k.category.toLowerCase().includes(q)
      );
    }
    return [...result].sort((a, b) => a.name.localeCompare(b.name));
  }, [mode, selectedCategories, selectedTags, searchQuery]);

  const toggleCategory = cat => {
    setShowAll(false);
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const toggleTag = tag => {
    setShowAll(false);
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const toggleCompare = kpi =>
    setCompareList(prev => {
      const exists = prev.find(k => k.id === kpi.id);
      if (exists) return prev.filter(k => k.id !== kpi.id);
      if (prev.length >= 3) return [...prev.slice(1), kpi];
      return [...prev, kpi];
    });

  // Clicking a tag on a card/modal: switch to tag-browse mode and filter by that tag
  const handleTagClick = (tag) => {
    setMode('tags');
    setShowAll(false);
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    setSelectedKPI(null);
  };

  const handleCategoryClick = (cat) => {
    setMode('tags');
    setShowAll(false);
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    setSelectedKPI(null);
  };

  const isComparing = kpi => compareList.some(k => k.id === kpi.id);
  const totalFilters = selectedCategories.length + selectedTags.length;
  const hasResults = filteredKPIs.length > 0;
  const showEmptyState = mode === 'tags' ? (!showAll && totalFilters === 0) : !searchQuery.trim();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e' }}>

      {/* ── Nav ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        backgroundColor: 'rgba(10,15,30,0.97)',
        borderBottom: '1px solid rgba(51,65,85,0.35)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ ...CONTAINER, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#818cf8" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 14 }}>KPI Finder</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => compareList.length > 0 && setShowCompare(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                border: '1px solid', cursor: compareList.length > 0 ? 'pointer' : 'not-allowed', transition: 'all 0.15s',
                ...(compareList.length > 0
                  ? { background: 'rgba(109,40,217,0.15)', borderColor: 'rgba(139,92,246,0.4)', color: '#c4b5fd' }
                  : { background: 'rgba(30,41,59,0.4)', borderColor: 'rgba(71,85,105,0.3)', color: '#475569' })
              }}
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0v10" />
              </svg>
              Compare
              {compareList.length > 0 && (
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#7c3aed', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {compareList.length}
                </span>
              )}
            </button>
            {compareList.length > 0 && (
              <button
                onClick={() => setCompareList([])}
                title="Clear all comparisons"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 30, height: 30, borderRadius: 8, fontSize: 13,
                  border: '1px solid rgba(139,92,246,0.3)', cursor: 'pointer', transition: 'all 0.15s',
                  background: 'rgba(109,40,217,0.1)', color: '#94a3b8',
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; e.currentTarget.style.color = '#fca5a5'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(109,40,217,0.1)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'; e.currentTarget.style.color = '#94a3b8'; }}
              >
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero / Filters ── */}
      <div style={{ borderBottom: '1px solid rgba(51,65,85,0.2)', paddingBottom: 32 }}>
        <div style={{ ...CONTAINER, paddingTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>

          {/* Title */}
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>Find the right KPI</h1>
            <p style={{ fontSize: 13, color: '#64748b' }}>Browse by department & focus area, or search by name</p>
          </div>

          {/* Mode toggle */}
          <div style={{ display: 'flex', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(51,65,85,0.4)', borderRadius: 10, padding: 4, gap: 4 }}>
            {[{ id: 'tags', label: 'Browse by Tags' }, { id: 'search', label: 'Search by Name' }].map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                style={{
                  padding: '7px 20px', borderRadius: 7, fontSize: 13, fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.15s',
                  ...(mode === m.id
                    ? { background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.35)' }
                    : { background: 'transparent', color: '#64748b', border: '1px solid transparent' })
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* ── Search mode ── */}
          {mode === 'search' && (
            <div style={{ position: 'relative', width: '100%', maxWidth: 500 }}>
              <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#64748b" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                autoFocus
                type="text"
                placeholder="e.g. Revenue Growth, Churn Rate, NPS..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  paddingLeft: 42, paddingRight: 16, paddingTop: 11, paddingBottom: 11,
                  borderRadius: 10, fontSize: 13, outline: 'none',
                  background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(71,85,105,0.5)', color: '#e2e8f0',
                }}
              />
            </div>
          )}

          {/* ── Tags mode ── */}
          {mode === 'tags' && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>

              {/* Department pills */}
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Department</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
                  {/* All button */}
                  <button
                    onClick={() => { setShowAll(true); setSelectedCategories([]); setSelectedTags([]); }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                      cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
                      ...(showAll
                        ? { background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.5)', color: '#a5b4fc' }
                        : { background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(71,85,105,0.35)', color: '#64748b' })
                    }}
                  >
                    {showAll && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#818cf8', display: 'inline-block' }} />}
                    All
                  </button>
                  {categories.map(cat => {
                    const active = selectedCategories.includes(cat);
                    const c = categoryColors[cat];
                    return (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                          cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
                          ...(active
                            ? { background: 'rgba(99,102,241,0.12)', borderColor: 'rgba(99,102,241,0.4)', border: '1px solid', color: '#a5b4fc' }
                            : { background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(71,85,105,0.35)', color: '#64748b' })
                        }}
                      >
                        {active && <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />}
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Focus area toggle */}
              <button
                onClick={() => setShowTagsPanel(v => !v)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseOver={e => e.currentTarget.style.color = '#94a3b8'}
                onMouseOut={e => e.currentTarget.style.color = '#64748b'}
              >
                <svg style={{ transform: showTagsPanel ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                {showTagsPanel ? 'Hide' : 'Show'} focus areas
                {selectedTags.length > 0 && (
                  <span style={{ padding: '1px 7px', borderRadius: 6, background: 'rgba(109,40,217,0.2)', color: '#c4b5fd', fontSize: 11, fontWeight: 600 }}>
                    {selectedTags.length}
                  </span>
                )}
              </button>

              {showTagsPanel && (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Focus Area</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
                    {generalTags.map(tag => {
                      const active = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          style={{
                            padding: '6px 14px', borderRadius: 8, fontSize: 13,
                            cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
                            ...(active
                              ? { background: 'rgba(109,40,217,0.15)', border: '1px solid rgba(139,92,246,0.45)', color: '#c4b5fd' }
                              : { background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(71,85,105,0.35)', color: '#64748b' })
                          }}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {totalFilters > 0 && (
                <button
                  onClick={() => { setSelectedCategories([]); setSelectedTags([]); }}
                  style={{ fontSize: 12, color: '#475569', background: 'none', border: 'none', cursor: 'pointer' }}
                  onMouseOver={e => e.currentTarget.style.color = '#94a3b8'}
                  onMouseOut={e => e.currentTarget.style.color = '#475569'}
                >
                  × Clear {totalFilters} filter{totalFilters > 1 ? 's' : ''}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Results ── */}
      <div style={{ ...CONTAINER, paddingTop: 28, paddingBottom: 48 }}>
        {showEmptyState ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 80, textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(71,85,105,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#475569" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d={mode === 'tags'
                  ? 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z'
                  : 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'} />
              </svg>
            </div>
            <p style={{ color: '#64748b', fontSize: 14 }}>
              {mode === 'tags' ? 'Select a department or focus area to see matching KPIs' : 'Type a KPI name or keyword above'}
            </p>
          </div>
        ) : !hasResults ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80, textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontSize: 14 }}>No KPIs match your {mode === 'tags' ? 'filters' : 'search'}</p>
            <button
              onClick={() => mode === 'tags' ? (setSelectedCategories([]), setSelectedTags([])) : setSearchQuery('')}
              style={{ marginTop: 8, fontSize: 13, color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Clear and try again
            </button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{filteredKPIs.length}</span> KPI{filteredKPIs.length !== 1 ? 's' : ''} found
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
            }}>
              {filteredKPIs.map(kpi => (
                <KPICard
                  key={kpi.id}
                  kpi={kpi}
                  isComparing={isComparing(kpi)}
                  onCompareToggle={toggleCompare}
                  onSelect={setSelectedKPI}
                  onTagClick={handleTagClick}
                  onCategoryClick={handleCategoryClick}
                  onCalculate={setCalculatorKPI}
                  selectedTags={selectedTags}
                  selectedCategories={selectedCategories}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {selectedKPI && (
        <KPIDetail
          kpi={selectedKPI}
          onClose={() => setSelectedKPI(null)}
          onCompareToggle={kpi => { toggleCompare(kpi); setSelectedKPI(null); }}
          isComparing={isComparing(selectedKPI)}
          onTagClick={handleTagClick}
          onCategoryClick={handleCategoryClick}
          onCalculate={kpi => { setSelectedKPI(null); setCalculatorKPI(kpi); }}
        />
      )}

      {showCompare && compareList.length > 0 && (
        <CompareView
          compareList={compareList}
          onRemove={toggleCompare}
          onClose={() => setShowCompare(false)}
        />
      )}

      {calculatorKPI && (
        <KPICalculator
          kpi={calculatorKPI}
          onClose={() => setCalculatorKPI(null)}
        />
      )}
    </div>
  );
}
