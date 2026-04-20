import { get, set, del } from "idb-keyval";
import type { PersistStorage, StorageValue } from "zustand/middleware";

/** Zustand persist storage backed by IndexedDB via idb-keyval. */
export function idbStorage<T>(): PersistStorage<T> {
  return {
    getItem: async (name) => {
      const raw = await get<string>(name);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as StorageValue<T>;
      } catch {
        return null;
      }
    },
    setItem: async (name, value) => {
      await set(name, JSON.stringify(value));
    },
    removeItem: async (name) => {
      await del(name);
    },
  };
}
