import type { AccountData } from "../types";

/**
 * Genera y descarga un CSV con el historial completo del perfil:
 * Fecha, Peso_Kg, Calorias_Ingeridas, Agua_ml, Minutos_Entreno
 */
export function exportProfileDataToCSV(accountData: AccountData, profileName: string) {
  // 1. Recopilar todas las fechas únicas
  const dateSet = new Set<string>();

  accountData.weights.forEach(w => dateSet.add(w.date));
  accountData.foods.forEach(f => dateSet.add(f.date));
  accountData.workouts.forEach(w => dateSet.add(w.date));
  if (accountData.waterLogs) {
    Object.keys(accountData.waterLogs).forEach(d => dateSet.add(d));
  }

  const dates = Array.from(dateSet).sort();
  if (dates.length === 0) return;

  // 2. Crear mapas de búsqueda rápida
  const weightMap = new Map<string, number>();
  accountData.weights.forEach(w => weightMap.set(w.date, w.weight));

  const caloriesMap = new Map<string, number>();
  accountData.foods.forEach(f => {
    caloriesMap.set(f.date, (caloriesMap.get(f.date) || 0) + f.calories);
  });

  const waterMap = accountData.waterLogs || {};

  const workoutMap = new Map<string, number>();
  accountData.workouts.forEach(w => {
    workoutMap.set(w.date, (workoutMap.get(w.date) || 0) + Math.round(w.durationSec / 60));
  });

  // 3. Construir CSV
  const header = "Fecha,Peso_Kg,Calorias_Ingeridas,Agua_ml,Minutos_Entreno";
  const rows = dates.map(date => {
    const peso = weightMap.get(date) ?? "";
    const cal = caloriesMap.get(date) ?? 0;
    const agua = waterMap[date] ?? 0;
    const min = workoutMap.get(date) ?? 0;
    return `${date},${peso},${cal},${agua},${min}`;
  });

  const csvContent = [header, ...rows].join("\n");

  // 4. Descargar
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeName = profileName.replace(/[^a-zA-Z0-9]/g, "_") || "DRS";
  link.href = url;
  link.download = `DRS_${safeName}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
