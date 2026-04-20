import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import type { Dataset } from "@easykpi/shared/types";
import { useDatasetStore } from "../../stores/useDatasetStore";
import { ColumnMapper } from "./ColumnMapper";

function mkId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function UploadPage() {
  const datasets = useDatasetStore((s) => s.datasets);
  const addDataset = useDatasetStore((s) => s.addDataset);
  const removeDataset = useDatasetStore((s) => s.removeDataset);
  const [activeDatasetId, setActiveDatasetId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    const name = file.name;
    try {
      if (name.endsWith(".csv") || name.endsWith(".tsv")) {
        await new Promise<void>((resolve, reject) => {
          Papa.parse<Record<string, string | number>>(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (result) => {
              const rows = result.data as Record<string, string | number | null>[];
              const columns = result.meta.fields ?? [];
              const d: Dataset = {
                id: mkId(),
                name,
                source: "csv",
                uploadedAt: new Date().toISOString(),
                columns,
                rows,
              };
              addDataset(d);
              setActiveDatasetId(d.id);
              resolve();
            },
            error: (err) => reject(err),
          });
        });
      } else if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const sheetName = wb.SheetNames[0]!;
        const ws = wb.Sheets[sheetName]!;
        const rows = XLSX.utils.sheet_to_json<Record<string, string | number | null>>(ws, {
          raw: true,
        });
        const columns = rows[0] ? Object.keys(rows[0]) : [];
        const d: Dataset = {
          id: mkId(),
          name,
          source: "xlsx",
          uploadedAt: new Date().toISOString(),
          columns,
          rows,
        };
        addDataset(d);
        setActiveDatasetId(d.id);
      } else {
        setError("Unsupported file type. Please upload CSV, TSV, or XLSX.");
      }
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const active = activeDatasetId ? datasets[activeDatasetId] : undefined;
  const list = Object.values(datasets).sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Upload data</h1>
        <p className="text-sm text-slate-400">
          CSV, TSV, or XLSX. Files are parsed in-browser and stored locally in IndexedDB — they
          never leave your machine until a backend connector is configured.
        </p>
      </header>

      <div className="rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/30 p-10 text-center">
        <input
          type="file"
          accept=".csv,.tsv,.xlsx,.xls"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }}
          className="block w-full cursor-pointer text-center text-sm text-slate-300 file:mr-4 file:rounded file:border-0 file:bg-sky-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-sky-400"
        />
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>

      {list.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">
            Datasets
          </h2>
          <div className="space-y-2">
            {list.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between rounded border border-slate-800 bg-slate-900/40 p-3 text-sm"
              >
                <div>
                  <p className="font-medium">{d.name}</p>
                  <p className="text-xs text-slate-400">
                    {d.rows.length} rows &middot; {d.columns.length} columns &middot;{" "}
                    {new Date(d.uploadedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveDatasetId(d.id)}
                    className="rounded bg-slate-800 px-3 py-1 text-xs hover:bg-slate-700"
                  >
                    Map to KPI
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove ${d.name}?`)) {
                        removeDataset(d.id);
                        if (activeDatasetId === d.id) setActiveDatasetId(null);
                      }
                    }}
                    className="rounded bg-slate-800 px-3 py-1 text-xs text-red-300 hover:bg-slate-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {active && <ColumnMapper dataset={active} />}
    </div>
  );
}
