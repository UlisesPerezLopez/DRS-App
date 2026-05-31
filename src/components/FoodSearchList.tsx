import { Search, Star, Plus } from "lucide-react";
import type { SearchableFood } from "../types";
import { useTranslation } from "react-i18next";

export interface FoodSearchListProps {
  search: string;
  onSearchChange: (value: string) => void;
  filteredFoods: SearchableFood[];
  onSelectFood: (food: SearchableFood) => void;
  onCreateCustomFoodClick: () => void;
}

export function FoodSearchList({
  search,
  onSearchChange,
  filteredFoods,
  onSelectFood,
  onCreateCustomFoodClick,
}: FoodSearchListProps) {
  const { t } = useTranslation();

  function getFoodDisplayName(f: SearchableFood): string {
    if (f._type === "common") return t("foodDb." + f.translationKey);
    return f.name;
  }

  return (
    <div>
      <p className="text-xs text-slate-500 mb-2">
        {t("mealDiary.searchFood", { defaultValue: "Buscar alimento base" })}
      </p>
      <div className="relative mb-3">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("common.search")}
          className="w-full pl-9 pr-3 py-3 rounded-xl border border-[#E5DFD3] dark:border-slate-700 bg-[#FAF7F2] dark:bg-slate-800 text-sm focus:ring-2 ring-emerald-500/20 outline-none transition"
        />
      </div>
      <div className="space-y-1.5 max-h-60 overflow-y-auto">
        {filteredFoods.map((f) => {
          const key =
            f._type === "common" ? f.translationKey : `custom-${f.id}`;
          return (
            <button
              key={key}
              onClick={() => onSelectFood(f)}
              className="w-full flex items-center justify-between text-left px-3 py-3 rounded-xl bg-[#F0EBE1] dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition group"
            >
              <div className="min-w-0 pr-4">
                <p className="text-sm font-medium truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 flex items-center gap-1">
                  {f._type === "custom" && (
                    <Star size={12} className="text-amber-500 shrink-0" />
                  )}
                  {getFoodDisplayName(f)}
                </p>
                <div className="flex gap-2 text-[10px] text-slate-400 mt-0.5">
                  <span>{f.calories} kcal/100g</span>
                  <span>P:{f.protein}g</span>
                  <span>C:{f.carbs}g</span>
                </div>
              </div>
              <Plus
                size={16}
                className="shrink-0 text-slate-400 group-hover:text-emerald-500"
              />
            </button>
          );
        })}
        {filteredFoods.length === 0 && search && (
          <p className="text-center text-sm text-slate-400 py-4">No results</p>
        )}
      </div>
      {/* Create Custom Food Button */}
      <button
        onClick={onCreateCustomFoodClick}
        className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 font-medium text-sm hover:bg-amber-50 dark:hover:bg-amber-950/20 active:scale-[0.98] transition"
      >
        <Star size={16} />
        {t("customFood.createBtn")}
      </button>
    </div>
  );
}
