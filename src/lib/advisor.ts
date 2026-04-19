import type { FoodEntry } from "../types";
import { todayISO } from "./calc";

export function getSmartAdvice(foods: FoodEntry[], targetCalories: number): string {
  if (targetCalories <= 0) return "Configura tu perfil para obtener consejos personalizados.";

  const today = todayISO();
  const todayFoods = foods.filter((f) => f.date === today);
  
  const consumed = todayFoods.reduce((sum, f) => sum + f.calories, 0);
  const hour = new Date().getHours();
  
  // Si se supera el límite diario
  if (consumed > targetCalories) {
    return "Has superado el límite diario de calorías. Te aconsejamos una hidratación extra hoy y una reducción moderada de carbohidratos mañana para compensar.";
  }
  
  // Si son antes de las 15:00 y se ha consumido >70% de las calorías
  if (hour < 15 && consumed > targetCalories * 0.7) {
    return "Has consumido más del 70% de tus calorías muy temprano. Intenta programar una cena ligera que sea alta en proteínas.";
  }
  
  // Si las calorías del almuerzo fueron <20% del total
  const lunchCalories = todayFoods
    .filter((f) => f.meal === "Almuerzo")
    .reduce((sum, f) => sum + f.calories, 0);
    
  if (hour >= 14 && lunchCalories < targetCalories * 0.2) {
    return "Tu almuerzo fue bastante ligero (<20% de tus calorías). Procura hacer una merienda nutritiva y densa o aumentar un poco tu cena.";
  }

  // Default
  return "Vas por buen camino. Trata de mantener tus raciones balanceadas y continúa hidratándote.";
}
