import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Target } from "@easykpi/shared/types";
import { idbStorage } from "./idbStorage";

interface TargetState {
  targets: Record<string, Target>;
  setTarget: (t: Target) => void;
  removeTarget: (kpiId: string) => void;
  status: (kpiId: string, actual: number) => "ok" | "warn" | "critical" | "none";
}

export const useTargetStore = create<TargetState>()(
  persist(
    (set, get) => ({
      targets: {},
      setTarget: (t) => set((s) => ({ targets: { ...s.targets, [t.kpiId]: t } })),
      removeTarget: (kpiId) =>
        set((s) => {
          const { [kpiId]: _, ...rest } = s.targets;
          return { targets: rest };
        }),
      status: (kpiId, actual) => {
        const t = get().targets[kpiId];
        if (!t) return "none";
        const warnThreshold = t.value * (1 - t.warnAtPct / 100);
        if (t.direction === "higher-is-better") {
          if (actual >= t.value) return "ok";
          if (actual >= warnThreshold) return "warn";
          return "critical";
        }
        if (actual <= t.value) return "ok";
        if (actual <= t.value * (1 + t.warnAtPct / 100)) return "warn";
        return "critical";
      },
    }),
    { name: "easykpi-targets", storage: idbStorage<TargetState>() },
  ),
);
