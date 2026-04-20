import { useMemo, useState } from "react";
import { Plus, Trash2, Clock, X, Search, AlertTriangle } from "lucide-react";
import type { FoodEntry, MealSlot, CommonFood } from "../types";
import { COMMON_FOODS } from "../lib/data";
import { calculateGlycemicLoad, calculateMacrosForPortion, dailyTarget, nowHHMM, todayISO } from "../lib/calc";
import { ProgressBar } from "./ProgressBar";
import { useAppStore } from "../store/useAppStore";
import { useTranslation } from "react-i18next";

const MEAL_HOURS: { meal: MealSlot; hour: string }[] = [
  { meal: "Desayuno", hour: "07:00" },
  { meal: "Media Mañana", hour: "10:00" },
  { meal: "Almuerzo", hour: "13:30" },
  { meal: "Merienda", hour: "17:00" },
  { meal: "Cena", hour: "20:30" },
];

function detectMealFromHour(hhmm: string): MealSlot {
  const [h, m] = hhmm.split(":").map(Number);
  const mins = h * 60 + m;
  if (mins < 9 * 60) return "Desayuno";
  if (mins < 12 * 60) return "Media Mañana";
  if (mins < 16 * 60) return "Almuerzo";
  if (mins < 19 * 60) return "Merienda";
  return "Cena";
}

function cgBadgeClass(cg: number | null | undefined): string {
  if (cg === null || cg === undefined) return "";
  if (cg < 10) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400";
  if (cg < 20) return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400";
  return "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400";
}

export function MealDiary() {
  const { t } = useTranslation();
  const account = useAppStore(s => s.accounts[s.activeAccountId!]);
  const { profile, foods } = account;
  const setFoods = useAppStore(s => s.setFoods);
  const today = todayISO();
  const [open, setOpen] = useState(false);
  const [meal, setMeal] = useState<MealSlot>("Desayuno");
  const [time, setTime] = useState(nowHHMM());
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState<CommonFood | null>(null);
  const [gramsInput, setGramsInput] = useState("100");

  const todayFoods = useMemo(
    () => foods.filter((f) => f.date === today).sort((a, b) => a.time.localeCompare(b.time)),
    [foods, today]
  );

  const consumed = todayFoods.reduce((s, f) => s + f.calories, 0);
  const target = dailyTarget(profile);
  const over = consumed > target;

  const filtered = COMMON_FOODS.filter((f) => {
    const term = search.toLowerCase();
    const translated = t("foodDb." + f.translationKey, { defaultValue: f.translationKey }).toLowerCase();
    return translated.includes(term) || f.translationKey.includes(term);
  });

  function openAdd(presetMeal?: MealSlot, presetHour?: string) {
    const now = presetHour || nowHHMM();
    setTime(now);
    setMeal(presetMeal || detectMealFromHour(now));
    setSelectedFood(null);
    setGramsInput("100");
    setSearch("");
    setOpen(true);
  }

  function save() {
    const gr = Number(gramsInput);
    if (!selectedFood || !gr || isNaN(gr)) return;
    const macros = calculateMacrosForPortion(selectedFood, gr);
    const cg = selectedFood.ig !== null && selectedFood.ig > 0
      ? Math.round(calculateGlycemicLoad(selectedFood.ig, macros.carbs, macros.fiber, gr) * 10) / 10
      : null;

    const entry: FoodEntry = {
      id: crypto.randomUUID(),
      name: selectedFood.translationKey,
      calories: macros.calories,
      grams: gr,
      protein: macros.protein,
      carbs: macros.carbs,
      fat: macros.fat,
      fiber: macros.fiber,
      ig: cg,
      sodiumLevel: selectedFood.sodiumLevel,
      meal,
      time,
      date: today,
    };
    setFoods((prev) => [...prev, entry]);
    setOpen(false);
  }

  function remove(id: string) {
    setFoods((prev) => prev.filter((f) => f.id !== id));
  }

  // Preview macros for selected food
  const previewGrams = Number(gramsInput) || 0;
  const preview = selectedFood && previewGrams > 0 ? calculateMacrosForPortion(selectedFood, previewGrams) : null;
  const previewCG = selectedFood && preview && selectedFood.ig !== null && selectedFood.ig > 0
    ? Math.round(calculateGlycemicLoad(selectedFood.ig, preview.carbs, preview.fiber, previewGrams) * 10) / 10
    : null;

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("tabs.diary")}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{today}</p>
        </div>
        <button
          onClick={() => openAdd()}
          className="flex items-center gap-1.5 bg-emerald-500 active:bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow"
        >
          <Plus size={18} /> {t("common.add")}
        </button>
      </header>

      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold tabular-nums">{consumed} / {target} {t("common.kcal")}</span>
          <span className={over ? "text-rose-500 font-medium" : "text-slate-500"}>
             {over ? "+" + (consumed - target) : t("dashboard.kcalRemain", { amount: target - consumed })}
          </span>
        </div>
        <ProgressBar value={consumed} max={target} over={over} />
      </section>

      {/* Hour selector quick access */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4">
        {MEAL_HOURS.map((m) => (
          <button
            key={m.meal}
            onClick={() => openAdd(m.meal, m.hour)}
            className="shrink-0 flex flex-col items-center gap-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-2xl active:scale-95 transition"
          >
            <span className="text-xs text-slate-500">{m.hour}</span>
            <span className="text-sm font-medium">{t("meals." + (m.meal === "Media Mañana" ? "mediaManana" : m.meal.toLowerCase()), { defaultValue: m.meal })}</span>
          </button>
        ))}
      </div>

      {/* Meals grouped */}
      <div className="space-y-3">
        {(["Desayuno", "Media Mañana", "Almuerzo", "Merienda", "Cena"] as MealSlot[]).map((slot) => {
          const items = todayFoods.filter((f) => f.meal === slot);
          const total = items.reduce((s, f) => s + f.calories, 0);
          return (
            <section
              key={slot}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden"
            >
              <header className="flex items-center justify-between px-4 py-3">
                <div>
                  <h3 className="font-semibold">{t("meals." + (slot === "Media Mañana" ? "mediaManana" : slot.toLowerCase()), { defaultValue: slot })}</h3>
                  <p className="text-xs text-slate-500 tabular-nums">{total} {t("common.kcal")} · {items.length} {t("mealDiary.itemsCount")}{items.length !== 1 ? "s" : ""}</p>
                </div>
                <button
                  onClick={() => openAdd(slot)}
                  className="text-emerald-600 dark:text-emerald-400 font-medium text-sm flex items-center gap-1"
                >
                  <Plus size={16} /> {t("common.add")}
                </button>
              </header>
              {items.length > 0 && (
                <ul className="border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                  {items.map((f) => (
                    <li key={f.id} className="px-4 py-3">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate flex items-center gap-1.5">
                            {t("foodDb." + f.name, { defaultValue: f.name })}
                            <span className="text-xs font-normal text-slate-400">({f.grams || 0}g)</span>
                            {f.sodiumLevel === "Alto" && (
                              <span title={t("warnings.high_sodium")} className="text-rose-500">
                                <AlertTriangle size={13} />
                              </span>
                            )}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                            <span className="flex items-center gap-0.5"><Clock size={10} /> {f.time}</span>
                            <span>P:{f.protein}g</span>
                            <span>C:{f.carbs}g</span>
                            <span>G:{f.fat}g</span>
                            {f.ig !== null && f.ig !== undefined && (
                              <span className={"px-1.5 py-0.5 rounded-md text-[10px] font-bold " + cgBadgeClass(f.ig)}>
                                CG {f.ig}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center shrink-0">
                          <span className="tabular-nums font-semibold mr-3 text-sm">{f.calories} kcal</span>
                          <button
                            onClick={() => remove(f.id)}
                            className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg active:text-rose-500"
                            aria-label={t("common.delete")}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      {/* ============ ADD MODAL ============ */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
          <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl overflow-hidden flex flex-col max-h-[85vh] shadow-2xl">
            {/* Header */}
            <div className="shrink-0 px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="font-semibold text-lg">{t("mealDiary.addFood")}</h2>
              <button onClick={() => setOpen(false)} className="p-1 -mr-1"><X size={22} /></button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Time + Meal */}
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs text-slate-500">{t("mealDiary.hour")}</span>
                  <input type="time" value={time}
                    onChange={(e) => { setTime(e.target.value); setMeal(detectMealFromHour(e.target.value)); }}
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
                </label>
                <label className="block">
                  <span className="text-xs text-slate-500">{t("mealDiary.meal")}</span>
                  <select value={meal} onChange={(e) => setMeal(e.target.value as MealSlot)}
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
                    {(["Desayuno", "Media Mañana", "Almuerzo", "Merienda", "Cena"] as MealSlot[]).map((m) => (
                      <option key={m} value={m}>{t("meals." + (m === "Media Mañana" ? "mediaManana" : m.toLowerCase()))}</option>
                    ))}
                  </select>
                </label>
              </div>

              {selectedFood ? (
                /* ===== SELECTED FOOD: Gram input + macros preview ===== */
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-2xl relative">
                  <button onClick={() => setSelectedFood(null)}
                    className="absolute top-2 right-2 p-2 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-full">
                    <X size={16} />
                  </button>
                  <p className="font-bold text-lg mb-3 pr-8">{t("foodDb." + selectedFood.translationKey)}</p>

                  <label className="block">
                    <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                      {t("mealDiary.grams", { defaultValue: "Gramos" })}
                    </span>
                    <input type="number" inputMode="numeric" value={gramsInput}
                      onChange={(e) => setGramsInput(e.target.value)} placeholder="100"
                      className="w-full mt-1.5 px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 text-lg font-bold" />
                  </label>

                  {preview && (
                    <div className="mt-3 grid grid-cols-4 gap-2 text-center text-sm">
                      <div className="bg-white dark:bg-slate-900 p-2 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Kcal</p>
                        <p className="font-bold">{preview.calories}</p>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-2 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] text-blue-500 uppercase font-bold">P(g)</p>
                        <p className="font-medium text-blue-600">{preview.protein}</p>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-2 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] text-amber-500 uppercase font-bold">CH(g)</p>
                        <p className="font-medium text-amber-600">{preview.carbs}</p>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-2 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] text-rose-500 uppercase font-bold">G(g)</p>
                        <p className="font-medium text-rose-600">{preview.fat}</p>
                      </div>
                    </div>
                  )}

                  {selectedFood.sodiumLevel === "Alto" && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-rose-600 bg-rose-100 dark:bg-rose-950/30 p-2.5 rounded-lg">
                      <AlertTriangle size={14} />
                      {t("warnings.high_sodium")}
                    </div>
                  )}

                  {previewCG !== null && (
                    <div className="mt-2 flex items-center justify-between text-xs p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">Carga Glucémica (CG):</span>
                      <span className={"px-2 py-1 rounded-md font-bold " + cgBadgeClass(previewCG)}>
                        {previewCG}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* ===== FOOD SEARCH LIST ===== */
                <div>
                  <p className="text-xs text-slate-500 mb-2">{t("mealDiary.searchFood", { defaultValue: "Buscar alimento base" })}</p>
                  <div className="relative mb-3">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                      placeholder={t("common.search")}
                      className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 ring-emerald-500/20 outline-none transition" />
                  </div>
                  <div className="space-y-1.5 max-h-60 overflow-y-auto">
                    {filtered.map((f) => (
                      <button key={f.translationKey} onClick={() => setSelectedFood(f)}
                        className="w-full flex items-center justify-between text-left px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition group">
                        <div className="min-w-0 pr-4">
                          <p className="text-sm font-medium truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                            {t("foodDb." + f.translationKey)}
                          </p>
                          <div className="flex gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span>{f.calories} kcal/100g</span>
                            <span>P:{f.protein}g</span>
                            <span>C:{f.carbs}g</span>
                          </div>
                        </div>
                        <Plus size={16} className="shrink-0 text-slate-400 group-hover:text-emerald-500" />
                      </button>
                    ))}
                    {filtered.length === 0 && search && (
                      <p className="text-center text-sm text-slate-400 py-4">No results</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 p-4 border-t border-slate-100 dark:border-slate-800">
              <button onClick={save} disabled={!selectedFood || !Number(gramsInput)}
                className="w-full bg-emerald-500 active:bg-emerald-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-semibold py-3.5 rounded-2xl transition">
                {t("common.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
