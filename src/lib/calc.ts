import type { ActivityLevel, Profile } from "../types";

export const ACTIVITY_FACTOR: Record<ActivityLevel, number> = {
  sedentary: 1.2, // Oficina / sedentario
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

export const ACTIVITY_LABEL: Record<ActivityLevel, string> = {
  sedentary: "Oficina / Sedentario",
  light: "Ligero (1-3 días/sem)",
  moderate: "Moderado (3-5 días/sem)",
  active: "Activo (6-7 días/sem)",
};

// Mifflin-St Jeor
export function bmr(p: Pick<Profile, "weightKg" | "heightCm" | "age" | "gender">) {
  const base = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age;
  return p.gender === "male" ? base + 5 : base - 161;
}

export function tdee(p: Profile) {
  return bmr(p) * ACTIVITY_FACTOR[p.activity];
}

export function dailyTarget(p: Profile) {
  const t = tdee(p);
  if (p.goal === "lose") return Math.round(t - 500);
  if (p.goal === "gain") return Math.round(t + 300);
  return Math.round(t);
}

export function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function nowHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
