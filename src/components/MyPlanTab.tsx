import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MEDITERRANEAN_PLAN } from "../lib/data";
import { Flame, Coffee, UtensilsCrossed, Cookie, MoonStar, AlertTriangle, HeartPulse } from "lucide-react";

const WEEKS = [1, 2, 3, 4] as const;

export function MyPlanTab() {
  const { t } = useTranslation();
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [openDay, setOpenDay] = useState<string | null>(null);

  const weekDays = MEDITERRANEAN_PLAN.filter(d => d.week === selectedWeek);

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      <header>
        <h1 className="text-2xl font-bold">{t("plans.planTitle")}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{t("plans.planSubtitle")}</p>
      </header>

      {/* Week selector */}
      <div className="flex gap-2">
        {WEEKS.map(w => (
          <button
            key={w}
            onClick={() => { setSelectedWeek(w); setOpenDay(null); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition active:scale-95 ${
              selectedWeek === w
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            {t("plans.weekLabel")} {w}
          </button>
        ))}
      </div>

      {/* Day cards */}
      <div className="space-y-3">
        {weekDays.map(plan => {
          const isOpen = openDay === plan.id;
          const meals = t(plan.translationKey, { returnObjects: true }) as
            { breakfast: string; lunch: string; snack: string; dinner: string } | string;

          // Safety: if i18n returns just the key string, skip
          const hasMeals = typeof meals === "object" && meals !== null;

          return (
            <article
              key={plan.id}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden"
            >
              {/* Day header */}
              <button
                onClick={() => setOpenDay(isOpen ? null : plan.id)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
                    {plan.day}
                  </div>
                  <div>
                    <p className="font-semibold">{t("plans.dayLabel")} {plan.day}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Flame size={12} /> {plan.totalKcal} {t("plans.kcalLabel")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {plan.warnings?.includes("high_sodium") && (
                    <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400" />
                    </span>
                  )}
                  {plan.warnings?.includes("high_potassium") && (
                    <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <HeartPulse size={14} className="text-green-600 dark:text-green-400" />
                    </span>
                  )}
                  <svg className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                  {/* Clinical warnings */}
                  {plan.warnings?.includes("high_sodium") && (
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40">
                      <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800 dark:text-amber-200">{t("warnings.plan_high_sodium")}</p>
                    </div>
                  )}
                  {plan.warnings?.includes("high_potassium") && (
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40">
                      <HeartPulse size={16} className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-green-800 dark:text-green-200">{t("warnings.plan_high_potassium")}</p>
                    </div>
                  )}

                  {/* Meals */}
                  {hasMeals && (
                    <div className="space-y-3">
                      <MealRow icon={Coffee} label={t("plans.breakfastLabel")} text={meals.breakfast} color="amber" />
                      <MealRow icon={UtensilsCrossed} label={t("plans.lunchLabel")} text={meals.lunch} color="emerald" />
                      <MealRow icon={Cookie} label={t("plans.snackLabel")} text={meals.snack} color="violet" />
                      <MealRow icon={MoonStar} label={t("plans.dinnerLabel")} text={meals.dinner} color="indigo" />
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function MealRow({ icon: Icon, label, text, color }: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  text: string;
  color: "amber" | "emerald" | "violet" | "indigo";
}) {
  const colorMap = {
    amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
    emerald: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    violet: "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300",
    indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
  };
  return (
    <div className="flex gap-3">
      <div className={`w-9 h-9 rounded-xl ${colorMap[color]} flex items-center justify-center shrink-0`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
