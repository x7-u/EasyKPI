import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Dashboard, DashboardTile } from "@easykpi/shared/types";
import { idbStorage } from "./idbStorage";

function mkId(): string {
  return Math.random().toString(36).slice(2, 10);
}

interface DashboardState {
  dashboards: Record<string, Dashboard>;
  activeId: string | null;
  create: (name: string) => string;
  remove: (id: string) => void;
  rename: (id: string, name: string) => void;
  setActive: (id: string) => void;
  addTile: (dashboardId: string, tile: Omit<DashboardTile, "id">) => void;
  removeTile: (dashboardId: string, tileId: string) => void;
  setLayout: (
    dashboardId: string,
    layout: { id: string; x: number; y: number; w: number; h: number }[],
  ) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      dashboards: {},
      activeId: null,
      create: (name) => {
        const id = mkId();
        const now = new Date().toISOString();
        set((s) => ({
          activeId: id,
          dashboards: {
            ...s.dashboards,
            [id]: { id, name, tiles: [], createdAt: now, updatedAt: now },
          },
        }));
        return id;
      },
      remove: (id) =>
        set((s) => {
          const { [id]: _, ...rest } = s.dashboards;
          return {
            dashboards: rest,
            activeId: s.activeId === id ? null : s.activeId,
          };
        }),
      rename: (id, name) =>
        set((s) => {
          const d = s.dashboards[id];
          if (!d) return s;
          return {
            dashboards: {
              ...s.dashboards,
              [id]: { ...d, name, updatedAt: new Date().toISOString() },
            },
          };
        }),
      setActive: (id) => set({ activeId: id }),
      addTile: (dashboardId, tile) =>
        set((s) => {
          const d = s.dashboards[dashboardId];
          if (!d) return s;
          if (d.tiles.length >= 12) return s;
          const newTile: DashboardTile = { ...tile, id: mkId() };
          return {
            dashboards: {
              ...s.dashboards,
              [dashboardId]: {
                ...d,
                tiles: [...d.tiles, newTile],
                updatedAt: new Date().toISOString(),
              },
            },
          };
        }),
      removeTile: (dashboardId, tileId) =>
        set((s) => {
          const d = s.dashboards[dashboardId];
          if (!d) return s;
          return {
            dashboards: {
              ...s.dashboards,
              [dashboardId]: {
                ...d,
                tiles: d.tiles.filter((t) => t.id !== tileId),
                updatedAt: new Date().toISOString(),
              },
            },
          };
        }),
      setLayout: (dashboardId, layout) =>
        set((s) => {
          const d = s.dashboards[dashboardId];
          if (!d) return s;
          const layoutById = new Map(layout.map((l) => [l.id, l]));
          return {
            dashboards: {
              ...s.dashboards,
              [dashboardId]: {
                ...d,
                tiles: d.tiles.map((t) => {
                  const l = layoutById.get(t.id);
                  return l ? { ...t, layout: { x: l.x, y: l.y, w: l.w, h: l.h } } : t;
                }),
                updatedAt: new Date().toISOString(),
              },
            },
          };
        }),
    }),
    { name: "easykpi-dashboards", storage: idbStorage<DashboardState>() },
  ),
);
