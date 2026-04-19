import { useMemo, useState } from "react";
import { Plus, Apple, RefreshCw } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { generateDailyMenu, SuggestedMeal } from "../lib/dietEngine";
import { dailyTarget, todayISO } from "../lib/calc";

export function DietTab() {
  const account = useAppStore(s => s.accounts[s.activeAccountId!]);
  const profile = account.profile;
  const setProfile = useAppStore(s => s.setProfile);
  const setFoods = useAppStore(s => s.setFoods);

  const preference = profile.dietPreference || "mediterranea";
  const target = dailyTarget(profile);
  
  const [refreshKey, setRefreshKey] = useState(0);

  const menu = useMemo(
    () => generateDailyMenu(target, preference, profile.goal),
    [target, preference, profile.goal, refreshKey]
  );

  const handleAdd = (mealSlot: SuggestedMeal, itm: { name: string; calories: number }) => {
    const newFood = {
      id: crypto.randomUUID(),
      name: itm.name,
      calories: itm.calories,
      meal: mealSlot.meal,
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }),
      date: todayISO(),
    };
    setFoods((prev) => [...prev, newFood]);
  };

  const handleAddAll = (mealSlot: SuggestedMeal) => {
    const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
    const newFoods = mealSlot.items.map((itm) => ({
      id: crypto.randomUUID(),
      name: itm.name,
      calories: itm.calories,
      meal: mealSlot.meal,
      time,
      date: todayISO(),
    }));
    setFoods((prev) => [...prev, ...newFoods]);
  };

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Apple className="text-emerald-500" />
            Diet Engine
          </h1>
          <p className="text-sm text-slate-500">Planificador de menús inteligente</p>
        </div>
        <button 
          onClick={() => setRefreshKey(k => k + 1)}
          className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 active:scale-95 transition"
        >
          <RefreshCw size={18} className="text-slate-600" />
        </button>
      </header>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm">
        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300 flex justify-between">
          <span>Preferencia Alimenticia</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">{Math.round(target)} kcal</span>
        </label>
        <select
          value={preference}
          onChange={(e) => setProfile({ dietPreference: e.target.value as any })}
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-emerald-500/20 transition"
        >
          <option value="mediterranea">Dieta Mediterránea</option>
          <option value="low-carb">Baja en Carbohidratos (Low-Carb)</option>
          <option value="vegetariana">Vegetariana</option>
        </select>
      </div>

      <div className="space-y-4">
        {menu.map((m, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg">{m.meal}</h3>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                ~ {m.totalCalories} kcal
              </span>
            </div>
            
            <ul className="space-y-3 mb-4">
              {m.items.map((itm, i) => (
                <li key={i} className="flex justify-between text-sm items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-xl -mx-2 transition">
                  <span className="text-slate-700 dark:text-slate-300 pr-2">{itm.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-500 whitespace-nowrap">{itm.calories} <span className="text-[10px]">kcal</span></span>
                    <button 
                      onClick={() => handleAdd(m, itm)}
                      className="text-emerald-500 p-1.5 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition active:scale-95"
                      aria-label="Añadir alimento"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleAddAll(m)}
              className="w-full py-2.5 rounded-xl border border-emerald-500 text-emerald-600 dark:text-emerald-400 font-medium text-sm hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition flex justify-center items-center gap-2 active:scale-95"
            >
              <Plus size={16} />
              Añadir menú al Diario
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
