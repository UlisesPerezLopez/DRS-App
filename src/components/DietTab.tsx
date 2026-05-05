import { useMemo, useState, useCallback } from "react";
import { Apple, RefreshCw, AlertTriangle, Eye } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { generateDailyMenu, SuggestedItem } from "../lib/dietEngine";
import { useTranslation } from "react-i18next";
import { dailyTarget } from "../lib/calc";

export function DietTab() {
  const { t } = useTranslation();
  const account = useAppStore(s => s.accounts[s.activeAccountId!]);
  const profile = account.profile;
  const setProfile = useAppStore(s => s.setProfile);

  const preference = profile.dietPreference || "mediterranea";
  const target = dailyTarget(profile);
  
  const [refreshKey, setRefreshKey] = useState(0);

  /** Safely resolve an item display name – handles both foodDb keys and recipe keys */
  const getItemDisplayName = useCallback((itm: SuggestedItem): string => {
    const key = itm.translationKey;

    // Recipe keys start with "recipes." (e.g. recipes.med.w3_l1)
    if (key.startsWith("recipes.")) {
      const resolved = t(`${key}.name`, { defaultValue: "" });
      if (resolved && resolved !== `${key}.name`) return resolved;
      // Fallback: also try under recipeDb namespace
      const altResolved = t(`recipeDb.${key}.name`, { defaultValue: "" });
      if (altResolved && altResolved !== `recipeDb.${key}.name`) return altResolved;
      // Ultimate fallback: derive a readable name from the key
      const lastSegment = key.split(".").pop() || key;
      return lastSegment
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    // RecipeDb keys (e.g. recipeDb.chicken_rice)
    if (key.startsWith("recipeDb.")) {
      const resolved = t(`${key}.name`, { defaultValue: "" });
      if (resolved && resolved !== `${key}.name`) return resolved;
      const lastSegment = key.split(".").pop() || key;
      return lastSegment
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    // Standard food key → try foodDb namespace
    const resolved = t(`foodDb.${key}`, { defaultValue: "" });
    if (resolved && resolved !== `foodDb.${key}`) return resolved;

    // Fallback: humanize the key
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }, [t]);

  const menu = useMemo(
    () => generateDailyMenu(target, preference, profile.goal),
    [target, preference, profile.goal, refreshKey]
  );

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Apple className="text-emerald-500" />
            {t("dietTab.title")}
          </h1>
          <p className="text-sm text-slate-500">{t("dietTab.menuOptimal")}</p>
        </div>
        <button 
          onClick={() => setRefreshKey(k => k + 1)}
          className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 active:scale-95 transition"
        >
          <RefreshCw size={18} className="text-slate-600" />
        </button>
      </header>

      {/* Visual-only info banner */}
      <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl text-sm text-emerald-700 dark:text-emerald-400">
        <Eye size={16} className="shrink-0" />
        <span>{t("dietTab.viewOnly", { defaultValue: "Vista de sugerencia. Para registrar alimentos, usa el Diario." })}</span>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm">
        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300 flex justify-between">
          <span>{t("dietTab.title")}</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">{Math.round(target)} kcal</span>
        </label>
        <select
          value={preference}
          onChange={(e) => setProfile({ dietPreference: e.target.value as "mediterranea" | "low-carb" | "vegetariana" })}
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
              <h3 className="font-bold text-lg">{t(`meals.${m.meal === "Media Mañana" ? "mediaManana" : m.meal.toLowerCase()}`, { defaultValue: m.meal })}</h3>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                ~ {m.totalCalories} kcal
              </span>
            </div>
            
            <ul className="space-y-3">
              {m.items.map((itm, i) => (
                <li key={i} className="flex justify-between text-sm items-start hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-xl -mx-2 transition">
                  <div className="flex-1 pr-2">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      {getItemDisplayName(itm)}
                      <span className="text-xs text-slate-400">({itm.grams}g)</span>
                      {itm.sodiumLevel === "Alto" && (
                        <AlertTriangle size={13} className="text-rose-500" />
                      )}
                    </span>
                    <div className="flex gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>P:{itm.protein}g</span>
                      <span>C:{itm.carbs}g</span>
                      <span>G:{itm.fat}g</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="font-mono text-slate-500 whitespace-nowrap">{itm.calories} <span className="text-[10px]">kcal</span></span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
