import { useState } from "react";
import { ChevronDown, Clock, Wallet, Flame } from "lucide-react";
import { RECIPES } from "../lib/data";
import { useTranslation } from "react-i18next";

export function Recipes() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<string | null>(RECIPES[0].id);

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      <header>
        <h1 className="text-2xl font-bold">{t("recipes.title")}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("recipes.subtitle")}
        </p>
      </header>

      <div className="space-y-3">
        {RECIPES.map((r) => {
          const isOpen = open === r.id;
          const recipeName = t(`${r.translationKey}.name`);
          const ingredients = t(`${r.translationKey}.ingredients`, { returnObjects: true }) as string[];
          const steps = t(`${r.translationKey}.steps`, { returnObjects: true }) as string[];

          return (
            <article
              key={r.id}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden"
            >
              <button
                onClick={() => setOpen(isOpen ? null : r.id)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{recipeName}</h3>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-500">
                    {r.cost && <span className="flex items-center gap-1"><Wallet size={12} /> {r.cost}</span>}
                    <span className="flex items-center gap-1"><Clock size={12} /> {r.time || `${r.prepTime} min`}</span>
                    <span className="flex items-center gap-1"><Flame size={12} /> {r.kcal || r.calories} kcal</span>
                  </div>
                </div>
                <ChevronDown
                  size={20}
                  className={`shrink-0 ml-2 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <Macro label={t("recipes.proteinLabel")} value={`${r.protein} g`} color="emerald" />
                    <Macro label={t("recipes.carbsLabel")} value={`${r.carbs} g`} color="amber" />
                    <Macro label={t("recipes.fatLabel")} value={`${r.fat} g`} color="rose" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{t("recipes.ingredients")}</p>
                    <ul className="space-y-1">
                      {Array.isArray(ingredients) && ingredients.map((item, idx) => (
                        <li key={idx} className="text-sm flex gap-2">
                          <span className="text-emerald-500">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{t("recipes.steps")}</p>
                    <ol className="space-y-2">
                      {Array.isArray(steps) && steps.map((step, idx) => (
                        <li key={idx} className="text-sm flex gap-2.5">
                          <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function Macro({ label, value, color }: { label: string; value: string; color: "emerald" | "amber" | "rose" }) {
  const colorMap = {
    emerald: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    amber: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
    rose: "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300",
  };
  return (
    <div className={`rounded-xl p-2.5 ${colorMap[color]}`}>
      <p className="text-[10px] uppercase tracking-wide opacity-80">{label}</p>
      <p className="font-bold tabular-nums">{value}</p>
    </div>
  );
}
