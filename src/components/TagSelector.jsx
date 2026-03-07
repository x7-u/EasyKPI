import { categories, generalTags, categoryColors } from '../data/kpis';

const tagGroupColors = {
  category: 'bg-slate-800/60 hover:bg-slate-700/60 border-slate-600/40 data-[active=true]:bg-indigo-600/30 data-[active=true]:border-indigo-500/60 data-[active=true]:text-indigo-300',
  general: 'bg-slate-800/60 hover:bg-slate-700/60 border-slate-600/40 data-[active=true]:bg-violet-600/30 data-[active=true]:border-violet-500/60 data-[active=true]:text-violet-300',
};

export default function TagSelector({ selectedCategories, selectedTags, onCategoryToggle, onTagToggle, onReset }) {
  const totalSelected = selectedCategories.length + selectedTags.length;

  return (
    <div className="space-y-6">
      {/* Category filter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
            Department / Category
          </h3>
          <span className="text-xs text-slate-500">{selectedCategories.length} selected</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
            const active = selectedCategories.includes(cat);
            const colors = categoryColors[cat];
            return (
              <button
                key={cat}
                onClick={() => onCategoryToggle(cat)}
                data-active={active}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150 cursor-pointer
                  ${active
                    ? `${colors.bg} ${colors.border} ${colors.text}`
                    : 'bg-slate-800/60 border-slate-700/40 text-slate-400 hover:border-slate-500/60 hover:text-slate-300'
                  }
                `}
              >
                {active && <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* General tags filter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
            Focus Area
          </h3>
          <span className="text-xs text-slate-500">{selectedTags.length} selected</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {generalTags.map(tag => {
            const active = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm border transition-all duration-150 cursor-pointer
                  ${active
                    ? 'bg-violet-600/20 border-violet-500/50 text-violet-300'
                    : 'bg-slate-800/60 border-slate-700/40 text-slate-400 hover:border-slate-500/60 hover:text-slate-300'
                  }
                `}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset */}
      {totalSelected > 0 && (
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear all filters ({totalSelected})
        </button>
      )}
    </div>
  );
}
