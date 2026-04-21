import type { ActivityLevel, CommonFood, Profile } from "../types";

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

/** CG = (IG * ((Carbs - Fiber) * (grams / 100))) / 100 */
export function calculateGlycemicLoad(ig: number, carbs: number, fiber: number, grams: number): number {
  const availableCarbs = Math.max(0, carbs - fiber);
  return (ig * (availableCarbs * (grams / 100))) / 100;
}

/** Normaliza macros base 100g a la porción real en gramos */
export function calculateMacrosForPortion(food: CommonFood, grams: number) {
  const factor = grams / 100;
  return {
    calories: Math.round(food.calories * factor),
    protein: Math.round(food.protein * factor * 10) / 10,
    carbs: Math.round(food.carbs * factor * 10) / 10,
    fat: Math.round(food.fat * factor * 10) / 10,
    fiber: Math.round(food.fiber * factor * 10) / 10,
  };
}

/** Objetivo diario de hidratación en ml: (peso * 35) + (min ejercicio * 15) */
export function dailyWaterTarget(p: Pick<Profile, "weightKg">, workoutMinutes: number = 0): number {
  return Math.round(p.weightKg * 35 + workoutMinutes * 15);
}

