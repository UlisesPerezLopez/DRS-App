import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import type { FoodEntry, MealSlot, SearchableFood, CommonFood } from "../types";
import {
  calculateGlycemicLoad,
  calculateMacrosForPortion,
  dailyTarget,
  nowHHMM,
  todayISO,
} from "../lib/calc";
import { ProgressBar } from "./ProgressBar";
import { useAppStore } from "../store/useAppStore";
import { useTranslation } from "react-i18next";
import { FoodItemCard } from "./FoodItemCard";
import { AddFoodModal } from "./AddFoodModal";

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

export function MealDiary() {
  const { t } = useTranslation();
  const account = useAppStore((s) => s.accounts[s.activeAccountId!]);
  const { profile, foods } = account;
  const setFoods = useAppStore((s) => s.setFoods);
  const today = todayISO();

  const [open, setOpen] = useState(false);
  const [meal, setMeal] = useState<MealSlot>("Desayuno");
  const [time, setTime] = useState(nowHHMM());

  const todayFoods = useMemo(
    () =>
      foods
        .filter((f) => f.date === today)
        .sort((a, b) => a.time.localeCompare(b.time)),
    [foods, today],
  );

  const consumed = todayFoods.reduce((s, f) => s + f.calories, 0);
  const target = dailyTarget(profile);
  const over = consumed > target;

  function openAdd(presetMeal?: MealSlot, presetHour?: string) {
    const now = presetHour || nowHHMM();
    setTime(now);
    setMeal(presetMeal || detectMealFromHour(now));
    setOpen(true);
  }

  function save(
    selectedFood: SearchableFood,
    gr: number,
    selectedMeal: MealSlot,
    selectedTime: string,
  ) {
    // Extract CommonFood-compatible shape for macro calculation
    const foodData: CommonFood = {
      translationKey:
        selectedFood._type === "common"
          ? selectedFood.translationKey
          : selectedFood.name,
      calories: selectedFood.calories,
      protein: selectedFood.protein,
      carbs: selectedFood.carbs,
      fat: selectedFood.fat,
      fiber: selectedFood.fiber,
      ig: selectedFood.ig,
      sodiumLevel: selectedFood.sodiumLevel,
    };
    const macros = calculateMacrosForPortion(foodData, gr);
    const ig = selectedFood.ig;
    const cg =
      ig !== null && ig > 0
        ? Math.round(
            calculateGlycemicLoad(ig, macros.carbs, macros.fiber, gr) * 10,
          ) / 10
        : null;

    const entry: FoodEntry = {
      id: crypto.randomUUID(),
      foodId:
        selectedFood._type === "common"
          ? selectedFood.translationKey
          : selectedFood.id,
      type: selectedFood._type,
      name:
        selectedFood._type === "common"
          ? selectedFood.translationKey
          : selectedFood.name,
      calories: macros.calories,
      grams: gr,
      protein: macros.protein,
      carbs: macros.carbs,
      fat: macros.fat,
      fiber: macros.fiber,
      ig: cg,
      sodiumLevel: selectedFood.sodiumLevel,
      meal: selectedMeal,
      time: selectedTime,
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

      <section className="rounded-2xl bg-[#FAF7F2] dark:bg-slate-900 border border-[#E5DFD3] dark:border-slate-800 p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold tabular-nums">
            {consumed} / {target} {t("common.kcal")}
          </span>
          <span
            className={over ? "text-rose-500 font-medium" : "text-slate-500"}
          >
            {over
              ? "+" + (consumed - target)
              : t("dashboard.kcalRemain", { amount: target - consumed })}
          </span>
        </div>
        <ProgressBar value={consumed} max={target} over={over} />
      </section>

      {/* Hour selector quick access */}
      <div className="grid grid-cols-2 gap-3">
        {MEAL_HOURS.map((m) => (
          <button
            key={m.meal}
            onClick={() => openAdd(m.meal, m.hour)}
            className="flex flex-col items-center gap-0.5 bg-[#FAF7F2] dark:bg-slate-900 border border-[#E5DFD3] dark:border-slate-700 px-4 py-2.5 rounded-2xl active:scale-95 transition"
          >
            <span className="text-xs text-slate-500">{m.hour}</span>
            <span className="text-sm font-medium">
              {t(
                "meals." +
                  (m.meal === "Media Mañana"
                    ? "mediaManana"
                    : m.meal.toLowerCase()),
                {
                  defaultValue: m.meal,
                },
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Meals grouped */}
      <div className="space-y-3">
        {(
          [
            "Desayuno",
            "Media Mañana",
            "Almuerzo",
            "Merienda",
            "Cena",
          ] as MealSlot[]
        ).map((slot) => {
          const items = todayFoods.filter((f) => f.meal === slot);
          const total = items.reduce((s, f) => s + f.calories, 0);
          return (
            <section
              key={slot}
              className="rounded-2xl bg-[#FAF7F2] dark:bg-slate-900 border border-[#E5DFD3] dark:border-slate-800 overflow-hidden"
            >
              <header className="flex items-center justify-between px-4 py-3">
                <div>
                  <h3 className="font-semibold">
                    {t(
                      "meals." +
                        (slot === "Media Mañana"
                          ? "mediaManana"
                          : slot.toLowerCase()),
                      {
                        defaultValue: slot,
                      },
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 tabular-nums">
                    {total} {t("common.kcal")} · {items.length}{" "}
                    {t("mealDiary.itemsCount")}
                    {items.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={() => openAdd(slot)}
                  className="text-emerald-600 dark:text-emerald-400 font-medium text-sm flex items-center gap-1"
                >
                  <Plus size={16} /> {t("common.add")}
                </button>
              </header>
              {items.length > 0 && (
                <ul className="border-t border-[#E5DFD3] dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                  {items.map((f) => (
                    <FoodItemCard key={f.id} entry={f} onRemove={remove} />
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      <AddFoodModal
        isOpen={open}
        onClose={() => setOpen(false)}
        initialMeal={meal}
        initialTime={time}
        onSave={save}
      />
    </div>
  );
}
