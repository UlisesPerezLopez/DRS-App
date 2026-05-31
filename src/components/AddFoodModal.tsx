import { useState, useMemo, useEffect } from "react";
import { X, Star, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { MealSlot, SearchableFood, CustomFood } from "../types";
import { COMMON_FOODS } from "../lib/data";
import { FOOD_DB } from "../lib/foodData";
import { calculateGlycemicLoad, calculateMacrosForPortion } from "../lib/calc";
import { FoodSearchList } from "./FoodSearchList";
import { useAppStore } from "../store/useAppStore";
import { hapticTap } from "../lib/haptics";

export interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMeal: MealSlot;
  initialTime: string;
  onSave: (
    selected: SearchableFood,
    grams: number,
    meal: MealSlot,
    time: string,
  ) => void;
}

const MEAL_SLOT_TO_TAG: Record<MealSlot, string[]> = {
  Desayuno: ["breakfast"],
  "Media Mañana": ["breakfast", "snack"],
  Almuerzo: ["lunch"],
  Merienda: ["snack"],
  Cena: ["dinner"],
};

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
  if (cg < 10)
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400";
  if (cg < 20)
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400";
  return "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400";
}

export function AddFoodModal({
  isOpen,
  onClose,
  initialMeal,
  initialTime,
  onSave,
}: AddFoodModalProps) {
  const { t } = useTranslation();

  const account = useAppStore((s) => s.accounts[s.activeAccountId!]);
  const customFoods = account?.customFoods || [];
  const addCustomFood = useAppStore((s) => s.addCustomFood);

  const [meal, setMeal] = useState<MealSlot>(initialMeal);
  const [time, setTime] = useState<string>(initialTime);
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState<SearchableFood | null>(null);
  const [gramsInput, setGramsInput] = useState("100");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Custom Food form state
  const [cfName, setCfName] = useState("");
  const [cfKcal, setCfKcal] = useState("");
  const [cfProtein, setCfProtein] = useState("");
  const [cfCarbs, setCfCarbs] = useState("");
  const [cfFat, setCfFat] = useState("");
  const [cfFiber, setCfFiber] = useState("");
  const [cfSodium, setCfSodium] = useState<"Bajo" | "Medio" | "Alto">("Bajo");

  // Reset inputs when modal opens or initial values change
  useEffect(() => {
    if (isOpen) {
      setMeal(initialMeal);
      setTime(initialTime);
      setSearch("");
      setSelectedFood(null);
      setGramsInput("100");
      setShowCreateForm(false);
    }
  }, [isOpen, initialMeal, initialTime]);

  // Fused search: COMMON_FOODS + FOOD_DB (deduped) + customFoods
  const allFoods = useMemo(() => {
    const commons: SearchableFood[] = COMMON_FOODS.map((f) => ({
      ...f,
      _type: "common" as const,
    }));
    const existingKeys = new Set(COMMON_FOODS.map((f) => f.translationKey));
    const foodDbItems: SearchableFood[] = FOOD_DB.filter(
      (f) => !existingKeys.has(f.translationKey),
    ).map((f) => ({
      translationKey: f.translationKey,
      calories: f.kcal,
      protein: f.protein,
      carbs: f.carbs,
      fat: f.fat,
      fiber: 0,
      ig: null,
      sodiumLevel: "Bajo" as const,
      mealTags: f.suitableFor
        ? (f.suitableFor.flatMap((slot) => MEAL_SLOT_TO_TAG[slot] || []) as (
            | "breakfast"
            | "lunch"
            | "dinner"
            | "snack"
          )[])
        : undefined,
      _type: "common" as const,
    }));
    const customs: SearchableFood[] = (customFoods || []).map((f) => ({
      ...f,
      _type: "custom" as const,
    }));
    return [...commons, ...foodDbItems, ...customs];
  }, [customFoods]);

  // Filter by search term, then sort: suitable-for-meal first
  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    const textFiltered = allFoods.filter((f) => {
      if (f._type === "common") {
        const translated = t("foodDb." + f.translationKey, {
          defaultValue: f.translationKey,
        }).toLowerCase();
        return translated.includes(term) || f.translationKey.includes(term);
      }
      return f.name.toLowerCase().includes(term);
    });

    const relevantTags = MEAL_SLOT_TO_TAG[meal] || [];
    return textFiltered.sort((a, b) => {
      const aMatch =
        a._type === "common" && a.mealTags
          ? a.mealTags.some((tag) => relevantTags.includes(tag))
            ? 0
            : 1
          : 0.5;
      const bMatch =
        b._type === "common" && b.mealTags
          ? b.mealTags.some((tag) => relevantTags.includes(tag))
            ? 0
            : 1
          : 0.5;
      return aMatch - bMatch;
    });
  }, [allFoods, search, meal, t]);

  function getFoodDisplayName(f: SearchableFood): string {
    if (f._type === "common") return t("foodDb." + f.translationKey);
    return f.name;
  }

  function handleSave() {
    const gr = Number(gramsInput);
    if (!selectedFood || !gr || isNaN(gr)) return;
    hapticTap();
    onSave(selectedFood, gr, meal, time);
  }

  function openCreateForm() {
    setCfName("");
    setCfKcal("");
    setCfProtein("");
    setCfCarbs("");
    setCfFat("");
    setCfFiber("");
    setCfSodium("Bajo");
    setShowCreateForm(true);
  }

  function saveCustomFood() {
    const kcal = Number(cfKcal);
    if (!cfName.trim() || isNaN(kcal) || kcal <= 0) return;
    hapticTap();
    const newFood: CustomFood = {
      id: crypto.randomUUID(),
      name: cfName.trim(),
      calories: kcal,
      protein: Number(cfProtein) || 0,
      carbs: Number(cfCarbs) || 0,
      fat: Number(cfFat) || 0,
      fiber: Number(cfFiber) || 0,
      ig: null,
      sodiumLevel: cfSodium,
    };
    addCustomFood(newFood);
    setShowCreateForm(false);
    setSelectedFood({ ...newFood, _type: "custom" });
  }

  const previewGrams = Number(gramsInput) || 0;
  const preview =
    selectedFood && previewGrams > 0
      ? calculateMacrosForPortion(
          {
            translationKey: "",
            calories: selectedFood.calories,
            protein: selectedFood.protein,
            carbs: selectedFood.carbs,
            fat: selectedFood.fat,
            fiber: selectedFood.fiber,
            ig: selectedFood.ig,
            sodiumLevel: selectedFood.sodiumLevel,
          },
          previewGrams,
        )
      : null;

  const previewCG =
    selectedFood && preview && selectedFood.ig !== null && selectedFood.ig > 0
      ? Math.round(
          calculateGlycemicLoad(
            selectedFood.ig,
            preview.carbs,
            preview.fiber,
            previewGrams,
          ) * 10,
        ) / 10
      : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 animate-fade-in">
      <div className="w-full sm:max-w-md bg-[#FAF7F2] dark:bg-slate-900 rounded-3xl overflow-hidden flex flex-col max-h-[85vh] shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="shrink-0 px-5 py-4 border-b border-[#E5DFD3] dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-semibold text-lg">{t("mealDiary.addFood")}</h2>
          <button
            onClick={onClose}
            className="p-1 -mr-1"
            aria-label={t("common.close")}
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Time + Meal */}
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs text-slate-500">
                {t("mealDiary.hour")}
              </span>
              <input
                type="time"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  setMeal(detectMealFromHour(e.target.value));
                }}
                className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[#E5DFD3] dark:border-slate-700 bg-[#F0EBE1] dark:bg-slate-950"
              />
            </label>
            <label className="block">
              <span className="text-xs text-slate-500">
                {t("mealDiary.meal")}
              </span>
              <select
                value={meal}
                onChange={(e) => setMeal(e.target.value as MealSlot)}
                className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[#E5DFD3] dark:border-slate-700 bg-[#F0EBE1] dark:bg-slate-950"
              >
                {(
                  [
                    "Desayuno",
                    "Media Mañana",
                    "Almuerzo",
                    "Merienda",
                    "Cena",
                  ] as MealSlot[]
                ).map((m) => (
                  <option key={m} value={m}>
                    {t(
                      "meals." +
                        (m === "Media Mañana"
                          ? "mediaManana"
                          : m.toLowerCase()),
                    )}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {showCreateForm ? (
            /* ===== CREATE CUSTOM FOOD FORM ===== */
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Star size={16} /> {t("customFood.createTitle")}
                </h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="p-1 text-amber-600"
                >
                  <X size={16} />
                </button>
              </div>
              <input
                type="text"
                value={cfName}
                onChange={(e) => setCfName(e.target.value)}
                placeholder={t("customFood.namePlaceholder")}
                className="w-full px-3 py-2.5 rounded-xl border border-amber-200 dark:border-amber-700 bg-[#FAF7F2] dark:bg-slate-900 text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase">
                    Kcal/100g *
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={cfKcal}
                    onChange={(e) => setCfKcal(e.target.value)}
                    className="w-full mt-0.5 px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-700 bg-[#FAF7F2] dark:bg-slate-900 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] text-blue-600 font-bold uppercase">
                    {t("customFood.protein")}
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={cfProtein}
                    onChange={(e) => setCfProtein(e.target.value)}
                    className="w-full mt-0.5 px-3 py-2 rounded-xl border border-[#E5DFD3] dark:border-slate-700 bg-[#FAF7F2] dark:bg-slate-900 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] text-amber-600 font-bold uppercase">
                    {t("customFood.carbs")}
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={cfCarbs}
                    onChange={(e) => setCfCarbs(e.target.value)}
                    className="w-full mt-0.5 px-3 py-2 rounded-xl border border-[#E5DFD3] dark:border-slate-700 bg-[#FAF7F2] dark:bg-slate-900 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] text-rose-600 font-bold uppercase">
                    {t("customFood.fat")}
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={cfFat}
                    onChange={(e) => setCfFat(e.target.value)}
                    className="w-full mt-0.5 px-3 py-2 rounded-xl border border-[#E5DFD3] dark:border-slate-700 bg-[#FAF7F2] dark:bg-slate-900 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase">
                    {t("customFood.fiber")}
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={cfFiber}
                    onChange={(e) => setCfFiber(e.target.value)}
                    className="w-full mt-0.5 px-3 py-2 rounded-xl border border-[#E5DFD3] dark:border-slate-700 bg-[#FAF7F2] dark:bg-slate-900 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] text-slate-600 font-bold uppercase">
                    {t("customFood.sodium")}
                  </span>
                  <select
                    value={cfSodium}
                    onChange={(e) =>
                      setCfSodium(e.target.value as "Bajo" | "Medio" | "Alto")
                    }
                    className="w-full mt-0.5 px-3 py-2 rounded-xl border border-[#E5DFD3] dark:border-slate-700 bg-[#FAF7F2] dark:bg-slate-900 text-sm"
                  >
                    <option value="Bajo">{t("customFood.sodiumLow")}</option>
                    <option value="Medio">{t("customFood.sodiumMed")}</option>
                    <option value="Alto">{t("customFood.sodiumHigh")}</option>
                  </select>
                </label>
              </div>
              <button
                onClick={saveCustomFood}
                disabled={!cfName.trim() || !Number(cfKcal)}
                className="w-full bg-amber-500 active:bg-amber-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-semibold py-3 rounded-xl transition"
              >
                {t("customFood.saveBtn")}
              </button>
            </div>
          ) : selectedFood ? (
            /* ===== SELECTED FOOD: Gram input + macros preview ===== */
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-2xl relative">
              <button
                onClick={() => setSelectedFood(null)}
                className="absolute top-2 right-2 p-2 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-full"
              >
                <X size={16} />
              </button>
              <p className="font-bold text-lg mb-3 pr-8 flex items-center gap-1.5">
                {selectedFood._type === "custom" && (
                  <Star size={14} className="text-amber-500" />
                )}
                {getFoodDisplayName(selectedFood)}
              </p>

              <label className="block">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                  {t("mealDiary.grams", { defaultValue: "Gramos" })}
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={gramsInput}
                  onChange={(e) => setGramsInput(e.target.value)}
                  placeholder="100"
                  className="w-full mt-1.5 px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-[#FAF7F2] dark:bg-slate-900 text-lg font-bold"
                />
              </label>

              {preview && (
                <div className="mt-3 grid grid-cols-4 gap-2 text-center text-sm">
                  <div className="bg-[#FAF7F2] dark:bg-slate-900 p-2 rounded-lg shadow-sm border border-[#E5DFD3] dark:border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">
                      Kcal
                    </p>
                    <p className="font-bold">{preview.calories}</p>
                  </div>
                  <div className="bg-[#FAF7F2] dark:bg-slate-900 p-2 rounded-lg shadow-sm border border-[#E5DFD3] dark:border-slate-800">
                    <p className="text-[10px] text-blue-500 uppercase font-bold">
                      P(g)
                    </p>
                    <p className="font-medium text-blue-600">
                      {preview.protein}
                    </p>
                  </div>
                  <div className="bg-[#FAF7F2] dark:bg-slate-900 p-2 rounded-lg shadow-sm border border-[#E5DFD3] dark:border-slate-800">
                    <p className="text-[10px] text-amber-500 uppercase font-bold">
                      CH(g)
                    </p>
                    <p className="font-medium text-amber-600">
                      {preview.carbs}
                    </p>
                  </div>
                  <div className="bg-[#FAF7F2] dark:bg-slate-900 p-2 rounded-lg shadow-sm border border-[#E5DFD3] dark:border-slate-800">
                    <p className="text-[10px] text-rose-500 uppercase font-bold">
                      G(g)
                    </p>
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
                <div className="mt-2 flex items-center justify-between text-xs p-2.5 rounded-lg bg-[#FAF7F2] dark:bg-slate-900 border border-[#E5DFD3] dark:border-slate-800">
                  <span className="text-slate-500">Carga Glucémica (CG):</span>
                  <span
                    className={
                      "px-2 py-1 rounded-md font-bold " +
                      cgBadgeClass(previewCG)
                    }
                  >
                    {previewCG}
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* ===== FOOD SEARCH LIST ===== */
            <FoodSearchList
              search={search}
              onSearchChange={setSearch}
              filteredFoods={filtered}
              onSelectFood={setSelectedFood}
              onCreateCustomFoodClick={openCreateForm}
            />
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 p-4 border-t border-[#E5DFD3] dark:border-slate-800">
          <button
            onClick={handleSave}
            disabled={!selectedFood || !Number(gramsInput)}
            className="w-full bg-emerald-500 active:bg-emerald-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-semibold py-3.5 rounded-2xl transition"
          >
            {t("common.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
