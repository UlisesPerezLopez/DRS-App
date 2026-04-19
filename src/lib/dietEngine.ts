import { COMMON_FOODS, RECIPES } from "./data";
import { MealSlot } from "../types";

export interface SuggestedMeal {
  meal: MealSlot;
  items: { name: string; calories: number }[];
  totalCalories: number;
}

export function generateDailyMenu(targetCalories: number, dietPreference: string, _goal: string): SuggestedMeal[] {
  // Proporciones calóricas teóricas
  const ratios: Record<MealSlot, number> = {
    Desayuno: 0.20,
    "Media Mañana": 0.10,
    Almuerzo: 0.35,
    Merienda: 0.10,
    Cena: 0.25,
  };

  const vegKeywords = ["Pollo", "Pavo", "Atún", "Salmón", "Merluza", "Mortadela", "Carne"];
  const lowCarbKeywords = ["Arroz", "Pan", "Pasta", "Boniato", "Patata", "Avena", "Cuscús", "Maiswaffel", "Miel", "Azúcar", "Plátano", "Lentejas", "Garbanzos", "Manzana", "Peras", "Uvas"];

  function isAllowed(name: string) {
    if (dietPreference === "vegetariana") {
      return !vegKeywords.some(k => name.toLowerCase().includes(k.toLowerCase()));
    }
    if (dietPreference === "low-carb") {
      return !lowCarbKeywords.some(k => name.toLowerCase().includes(k.toLowerCase()));
    }
    return true; // mediterranea
  }

  const allowedCommon = COMMON_FOODS.filter(f => isAllowed(f.name));
  const allowedRecipes = RECIPES.filter(r => isAllowed(r.name));

  const slots: MealSlot[] = ["Desayuno", "Media Mañana", "Almuerzo", "Merienda", "Cena"];
  const suggestions: SuggestedMeal[] = [];

  // Helper
  const getRandom = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

  for (const slot of slots) {
    const targetKcal = targetCalories * ratios[slot];
    const items: { name: string; calories: number }[] = [];
    let currentKcal = 0;

    // Almuerzo o Cena -> priorizar receta fuerte
    if ((slot === "Almuerzo" || slot === "Cena") && allowedRecipes.length > 0) {
      const bestFits = allowedRecipes.filter(r => r.kcal <= targetKcal + 100);
      const candidates = bestFits.length > 0 ? bestFits : allowedRecipes;
      const r = getRandom(candidates);
      items.push({ name: r.name, calories: r.kcal });
      currentKcal += r.kcal;
    }

    // Rellenar hasta acercarnos al targetKcal (con margen de 30-50kcal)
    let maxAttempts = 15;
    while (currentKcal < targetKcal - 50 && maxAttempts > 0) {
      const food = getRandom(allowedCommon);
      if (food && !items.find(i => i.name === food.name)) {
        // En low-carb, no añadir frutas ni nada proscrito ya filtrado
        items.push({ name: food.name, calories: food.calories });
        currentKcal += food.calories;
      }
      maxAttempts--;
    }

    // Fallback de seguridad pura
    if (items.length === 0 && allowedCommon.length > 0) {
      const fallback = getRandom(allowedCommon);
      items.push({ name: fallback.name, calories: fallback.calories });
      currentKcal += fallback.calories;
    }

    suggestions.push({
      meal: slot,
      items,
      totalCalories: currentKcal,
    });
  }

  return suggestions;
}
