import { COMMON_FOODS, RECIPES } from "./data";
import { MealSlot } from "../types";

export interface SuggestedItem {
  translationKey: string;
  name: string;
  calories: number;
  grams: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ig: number | null;
  sodiumLevel: "Bajo" | "Medio" | "Alto" | null;
}

export interface SuggestedMeal {
  meal: MealSlot;
  items: SuggestedItem[];
  totalCalories: number;
}

// Mapeo de slots a mealTags
const SLOT_TAG_MAP: Record<MealSlot, 'breakfast' | 'lunch' | 'dinner' | 'snack'> = {
  "Desayuno": "breakfast",
  "Media Mañana": "snack",
  "Almuerzo": "lunch",
  "Merienda": "snack",
  "Cena": "dinner",
};

export function generateDailyMenu(targetCalories: number, dietPreference: string, _goal: string): SuggestedMeal[] {
  const ratios: Record<MealSlot, number> = {
    Desayuno: 0.20,
    "Media Mañana": 0.10,
    Almuerzo: 0.35,
    Merienda: 0.10,
    Cena: 0.25,
  };

  // Filtros por translationKey para preferencia dietética
  const vegKeys = ["chicken", "turkey", "salmon", "hake", "canned_tuna", "pork_loin", "beef_lean", "cod", "sardines", "rabbit", "octopus", "prawns", "egg"];
  const lowCarbKeys = ["oats", "lentils", "chickpeas", "quinoa", "potato", "sweet_potato", "brown_rice", "rye_bread", "whole_pasta", "black_beans", "couscous", "buckwheat", "millet", "peas", "broad_beans", "corn_cakes", "cassava", "bulgur", "corn", "amaranth", "banana", "apple", "pineapple", "watermelon"];
  const vegRecipeKeys = ["Pollo", "Pavo", "Atún", "Salmón", "Merluza", "Mortadela", "Carne"];
  const lcRecipeKeys = ["Arroz", "Pan", "Pasta", "Boniato", "Patata", "Avena", "Cuscús"];

  function isDietAllowed(key: string) {
    if (dietPreference === "vegetariana") return !vegKeys.includes(key);
    if (dietPreference === "low-carb") return !lowCarbKeys.includes(key);
    return true;
  }
  function isRecipeAllowed(name: string) {
    if (dietPreference === "vegetariana") return !vegRecipeKeys.some(k => name.includes(k));
    if (dietPreference === "low-carb") return !lcRecipeKeys.some(k => name.includes(k));
    return true;
  }

  const dietFiltered = COMMON_FOODS.filter(f => isDietAllowed(f.translationKey));
  const allowedRecipes = RECIPES.filter(r => isRecipeAllowed(r.translationKey));
  const slots: MealSlot[] = ["Desayuno", "Media Mañana", "Almuerzo", "Merienda", "Cena"];
  const suggestions: SuggestedMeal[] = [];
  const getRandom = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

  for (const slot of slots) {
    const targetKcal = targetCalories * ratios[slot];
    const items: SuggestedItem[] = [];
    let currentKcal = 0;
    const tag = SLOT_TAG_MAP[slot];

    // Filtrar por mealTag para este slot (fallback a todos si no hay coincidencias)
    const tagFiltered = dietFiltered.filter(f => f.mealTags?.includes(tag));
    const allowedCommon = tagFiltered.length >= 5 ? tagFiltered : dietFiltered;

    // Almuerzo o Cena -> priorizar receta
    if ((slot === "Almuerzo" || slot === "Cena") && allowedRecipes.length > 0) {
      const bestFits = allowedRecipes.filter(r => (r.calories || r.kcal || 0) <= targetKcal + 100);
      const candidates = bestFits.length > 0 ? bestFits : allowedRecipes;
      const r = getRandom(candidates);
      items.push({
        translationKey: r.translationKey, name: r.translationKey, calories: r.calories || r.kcal || 0, grams: 100,
        protein: r.protein, carbs: r.carbs, fat: r.fat, fiber: 0, ig: null, sodiumLevel: null,
      });
      currentKcal += r.calories || r.kcal || 0;
    }

    // Rellenar con alimentos filtrados por tag (ración inteligente)
    let maxAttempts = 15;
    while (currentKcal < targetKcal - 50 && maxAttempts > 0) {
      const food = getRandom(allowedCommon);
      if (food && !items.find(i => i.translationKey === food.translationKey)) {
        const grams = food.calories > 400 ? 30 : 100;
        const factor = grams / 100;
        const cals = Math.round(food.calories * factor);
        items.push({
          translationKey: food.translationKey, name: food.translationKey,
          calories: cals, grams,
          protein: Math.round(food.protein * factor * 10) / 10,
          carbs: Math.round(food.carbs * factor * 10) / 10,
          fat: Math.round(food.fat * factor * 10) / 10,
          fiber: Math.round(food.fiber * factor * 10) / 10,
          ig: food.ig, sodiumLevel: food.sodiumLevel,
        });
        currentKcal += cals;
      }
      maxAttempts--;
    }

    // Fallback
    if (items.length === 0 && allowedCommon.length > 0) {
      const fb = getRandom(allowedCommon);
      items.push({
        translationKey: fb.translationKey, name: fb.translationKey,
        calories: fb.calories, grams: 100,
        protein: fb.protein, carbs: fb.carbs, fat: fb.fat, fiber: fb.fiber,
        ig: fb.ig, sodiumLevel: fb.sodiumLevel,
      });
      currentKcal += fb.calories;
    }

    suggestions.push({ meal: slot, items, totalCalories: currentKcal });
  }

  return suggestions;
}
