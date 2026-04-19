import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return initial;
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* noop */
    }
  }, [key, value]);

  return [value, setValue] as const;
}

export const STORAGE_KEYS = {
  profile: "vt.profile.v1",
  foods: "vt.foods.v1",
  weights: "vt.weights.v1",
  workouts: "vt.workouts.v1",
  theme: "vt.theme.v1",
  planStartDate: "vt.plan.v1",
} as const;
