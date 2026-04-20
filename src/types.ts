export type Gender = "male" | "female";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active";

export interface Profile {
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  activity: ActivityLevel;
  goal: "lose" | "maintain" | "gain";
  dietPreference?: "mediterranea" | "low-carb" | "vegetariana";
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  grams: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ig: number | null;
  sodiumLevel: "Bajo" | "Medio" | "Alto" | null;
  meal: MealSlot;
  time: string; // HH:MM
  date: string; // YYYY-MM-DD
}

export type MealSlot =
  | "Desayuno"
  | "Media Mañana"
  | "Almuerzo"
  | "Merienda"
  | "Cena";

export interface WeightEntry {
  date: string; // YYYY-MM-DD
  weight: number;
}

export interface WorkoutSession {
  id: string;
  date: string;
  exercise: string;
  durationSec: number;
  caloriesBurned?: number;
  notes?: string;
}

export interface CommonFood {
  translationKey: string;
  calories: number; // per 100g
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ig: number | null;
  sodiumLevel: "Bajo" | "Medio" | "Alto";
}

export interface AccountData {
  id: string;
  profile: Profile;
  foods: FoodEntry[];
  weights: WeightEntry[];
  workouts: WorkoutSession[];
  planStartDate: string | null;
}
