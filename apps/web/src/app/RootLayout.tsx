import { NavLink, Outlet } from "react-router-dom";
import { useCompareStore } from "../stores/useCompareStore";
import { useExportBatchStore } from "../stores/useExportBatchStore";

const navItems = [
  { to: "/catalog", label: "Catalog" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/calculator", label: "Calculator" },
  { to: "/compare", label: "Compare" },
  { to: "/upload", label: "Upload" },
  { to: "/settings", label: "Settings" },
];

export function RootLayout() {
  const compareCount = useCompareStore((s) => s.items.length);
  const batchCount = useExportBatchStore((s) => s.items.length);
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <NavLink to="/catalog" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-sky-500 to-violet-500 text-sm font-bold">
              K
            </span>
            <span className="text-lg font-semibold tracking-tight">EasyKPI</span>
            <span className="hidden text-xs text-slate-400 sm:inline">Analyst Workbench</span>
          </NavLink>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative rounded-md px-3 py-1.5 text-sm transition ${
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                  }`
                }
              >
                {item.label}
                {item.to === "/compare" && compareCount > 0 && (
                  <span className="ml-2 inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-sky-500 px-1.5 py-0.5 text-xs font-semibold text-white">
                    {compareCount}
                  </span>
                )}
                {item.to === "/calculator" && batchCount > 0 && (
                  <span className="ml-2 inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-emerald-500 px-1.5 py-0.5 text-xs font-semibold text-white" title={`${batchCount} calculation(s) queued for batch export`}>
                    {batchCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        EasyKPI &middot; 95 KPIs &middot; Data Analyst Workbench
      </footer>
    </div>
  );
}
