import { useMemo, useState } from "react";
import { Plus, Trash2, Clock, X, Search } from "lucide-react";
import type { FoodEntry, MealSlot } from "../types";
import { COMMON_FOODS } from "../lib/data";
import { dailyTarget, nowHHMM, todayISO } from "../lib/calc";
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
  const t = h * 60 + m;
  if (t < 9 * 60) return "Desayuno";
  if (t < 12 * 60) return "Media Mañana";
  if (t < 16 * 60) return "Almuerzo";
  if (t < 19 * 60) return "Merienda";
  return "Cena";
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
  const [name, setName] = useState("");
  const [calories, setCalories] = useState<string>("");
  const [search, setSearch] = useState("");

  const todayFoods = useMemo(
    () => foods.filter((f) => f.date === today).sort((a, b) => a.time.localeCompare(b.time)),
    [foods, today]
  );

  const consumed = todayFoods.reduce((s, f) => s + f.calories, 0);
  const target = dailyTarget(profile);
  const over = consumed > target;

  const filtered = COMMON_FOODS.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd(presetMeal?: MealSlot, presetHour?: string) {
    const t = presetHour || nowHHMM();
    setTime(t);
    setMeal(presetMeal || detectMealFromHour(t));
    setName("");
    setCalories("");
    setSearch("");
    setOpen(true);
  }

  function quickAdd(food: { name: string; calories: number }) {
    setName(food.name);
    setCalories(String(food.calories));
  }

  function save() {
    const cal = Number(calories);
    if (!name.trim() || !cal || isNaN(cal)) return;
    const entry: FoodEntry = {
      id: crypto.randomUUID(),
      name: name.trim(),
      calories: Math.round(cal),
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
             {over ? `+${consumed - target}` : t("dashboard.kcalRemain", { amount: target - consumed })}
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
            <span className="text-sm font-medium">{t(`meals.${m.meal === "Media Mañana" ? "mediaManana" : m.meal.toLowerCase()}`, { defaultValue: m.meal })}</span>
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
                  <h3 className="font-semibold">{t(`meals.${slot === "Media Mañana" ? "mediaManana" : slot.toLowerCase()}`, { defaultValue: slot })}</h3>
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
                    <li key={f.id} className="flex items-center justify-between px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{t(`foodDb.${f.name}`, { defaultValue: f.name })}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock size={12} /> {f.time}
                        </p>
                      </div>
                      <span className="tabular-nums font-semibold mr-3">{f.calories} {t("common.kcal")}</span>
                      <button
                        onClick={() => remove(f.id)}
                        className="p-2 text-slate-400 active:text-rose-500"
                        aria-label={t("common.delete")}
                      >
                        <Trash2 size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      {/* Add modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto safe-bottom">
            <div className="sticky top-0 bg-white dark:bg-slate-900 px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="font-semibold text-lg">{t("mealDiary.addFood")}</h2>
              <button onClick={() => setOpen(false)} className="p-1 -mr-1">
                <X size={22} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs text-slate-500">{t("mealDiary.hour")}</span>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => {
                      setTime(e.target.value);
                      setMeal(detectMealFromHour(e.target.value));
                    }}
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-slate-500">{t("mealDiary.meal")}</span>
                  <select
                    value={meal}
                    onChange={(e) => setMeal(e.target.value as MealSlot)}
                    className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {(["Desayuno", "Media Mañana", "Almuerzo", "Merienda", "Cena"] as MealSlot[]).map((m) => (
                      <option key={m} value={m}>{t(`meals.${m === "Media Mañana" ? "mediaManana" : m.toLowerCase()}`)}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-xs text-slate-500">{t("mealDiary.food")}</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("mealDiary.foodPlaceholder")}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </label>

              <label className="block">
                <span className="text-xs text-slate-500">{t("mealDiary.calories")}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="0"
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </label>

              <div>
                <p className="text-xs text-slate-500 mb-2">{t("mealDiary.commonFoods")}</p>
                <div className="relative mb-2">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("common.search")}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  />
                </div>
                <div className="max-h-52 overflow-y-auto -mx-1 px-1 space-y-1.5">
                  {filtered.map((f) => (
                    <button
                      key={f.name}
                      onClick={() => quickAdd(f)}
                      className="w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 active:bg-emerald-50 dark:active:bg-emerald-900/30"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{t(`foodDb.${f.name}`, { defaultValue: f.name })}</p>
                        <p className="text-xs text-slate-500">{t(`unitsDb.${f.serving}`, { defaultValue: f.serving })}</p>
                      </div>
                      <span className="text-sm font-semibold tabular-nums shrink-0">{f.calories} {t("common.kcal")}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={save}
                disabled={!name.trim() || !Number(calories)}
                className="w-full bg-emerald-500 active:bg-emerald-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-semibold py-3.5 rounded-2xl"
              >
                {t("common.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
