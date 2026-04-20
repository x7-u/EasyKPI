import { useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE ?? "/api";

interface SemanticHit {
  id: string;
  name: string;
  category: string;
  score: number;
}

export function SemanticSearch() {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SemanticHit[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/semantic/search`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query, topK: 8 }),
      });
      const json = (await resp.json()) as SemanticHit[];
      setHits(json);
    } catch {
      setHits([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">
        Ask in plain English
      </h3>
      <div className="flex gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder='Try: "are we losing our best customers?"'
          className="flex-1 rounded border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={search}
          disabled={loading}
          className="rounded bg-sky-500 px-3 py-2 text-sm font-medium text-white hover:bg-sky-400 disabled:opacity-50"
        >
          {loading ? "…" : "Search"}
        </button>
      </div>
      {hits.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm">
          {hits.map((h) => (
            <li key={h.id}>
              <Link to={`/kpis/${h.id}`} className="flex items-center justify-between rounded border border-slate-800 bg-slate-950/40 px-3 py-2 hover:border-sky-500/40">
                <span>
                  <span className="text-[10px] text-slate-500">{h.category}</span>
                  <span className="ml-2 text-slate-100">{h.name}</span>
                </span>
                <span className="text-xs text-slate-400">score {h.score}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
