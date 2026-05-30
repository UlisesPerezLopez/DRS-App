import { Clock, AlertTriangle, Trash2, Star } from "lucide-react";
import type { FoodEntry } from "../types";
import { useTranslation } from "react-i18next";

export interface FoodItemCardProps {
  entry: FoodEntry;
  onRemove: (id: string) => void;
}

function cgBadgeClass(cg: number | null | undefined): string {
  if (cg === null || cg === undefined) return "";
  if (cg < 10)
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400";
  if (cg < 20)
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400";
  return "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400";
}

export function FoodItemCard({ entry, onRemove }: FoodItemCardProps) {
  const { t } = useTranslation();

  const displayName =
    entry.type === "custom"
      ? entry.name
      : t("foodDb." + entry.name, { defaultValue: entry.name });

  return (
    <li className="px-4 py-3">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate flex items-center gap-1.5">
            {entry.type === "custom" && (
              <Star size={12} className="text-amber-500 shrink-0" />
            )}
            {displayName}
            <span className="text-xs font-normal text-slate-400">
              ({entry.grams || 0}g)
            </span>
            {entry.sodiumLevel === "Alto" && (
              <span title={t("warnings.high_sodium")} className="text-rose-500">
                <AlertTriangle size={13} />
              </span>
            )}
          </p>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
            <span className="flex items-center gap-0.5">
              <Clock size={10} /> {entry.time}
            </span>
            <span>P:{entry.protein}g</span>
            <span>C:{entry.carbs}g</span>
            <span>G:{entry.fat}g</span>
            {entry.ig !== null && entry.ig !== undefined && (
              <span
                className={
                  "px-1.5 py-0.5 rounded-md text-[10px] font-bold " +
                  cgBadgeClass(entry.ig)
                }
              >
                CG {entry.ig}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center shrink-0">
          <span className="tabular-nums font-semibold mr-3 text-sm">
            {entry.calories} kcal
          </span>
          <button
            onClick={() => onRemove(entry.id)}
            className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg active:text-rose-500"
            aria-label={t("common.delete")}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </li>
  );
}
