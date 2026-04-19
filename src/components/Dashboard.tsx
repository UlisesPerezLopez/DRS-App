import { Flame, Target, TrendingDown, AlertTriangle, Activity, Sparkles, ChevronDown, Dumbbell } from "lucide-react";
import { dailyTarget, tdee, todayISO } from "../lib/calc";
import { ProgressBar } from "./ProgressBar";
import { useAppStore } from "../store/useAppStore";
import { getSmartAdvice } from "../lib/advisor";
import { useTranslation } from "react-i18next";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function Dashboard() {
  const { t } = useTranslation();
  const account = useAppStore(s => s.accounts[s.activeAccountId!]);
  const { profile, foods, workouts } = account;

  const today = todayISO();
  const todayFoods = foods.filter((f) => f.date === today);
  const consumed = todayFoods.reduce((s, f) => s + f.calories, 0);
  const target = dailyTarget(profile);
  const remaining = target - consumed;
  const over = consumed > target;
  const tdeeVal = Math.round(tdee(profile));

  const todayWorkouts = workouts.filter((w) => w.date === today);
  const workoutMin = Math.round(todayWorkouts.reduce((s, w) => s + w.durationSec, 0) / 60);

  // Group by meal slot
  const byMeal = ["Desayuno", "Media Mañana", "Almuerzo", "Merienda", "Cena"].map((m) => {
    // Generate meal key dynamically (desayuno, mediaManana...)
    const mealKey = m === "Media Mañana" ? "mediaManana" : m.toLowerCase();
    return {
      name: t(`meals.${mealKey}`),
      kcal: todayFoods.filter((f) => f.meal === m).reduce((s, f) => s + f.calories, 0),
    };
  });

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return t("dashboard.greeting_morning");
    if (h < 19) return t("dashboard.greeting_afternoon");
    return t("dashboard.greeting_evening");
  })();

  const advice = getSmartAdvice(foods, target);

  const isGoalMet = !over && workoutMin >= 20;
  const goodEmojis = ["🎯💪", "🚀🔥", "🏆✨"];
  const badEmojis = ["🌱⏳", "🛠️🔋", "💡👣"];
  const stableIndex = today.split('-').reduce((a, b) => a + parseInt(b), 0) % 3;
  const feedbackEmoji = isGoalMet ? goodEmojis[stableIndex] : badEmojis[stableIndex];
  const totalCaloriesSport = todayWorkouts.reduce((s, w) => s + (w.caloriesBurned || 0), 0);

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      <header>
        <p className="text-sm text-slate-500 dark:text-slate-400">{greeting},</p>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{profile.name || t("dashboard.welcome")} 👋</h1>
          <span className="text-2xl tracking-widest">{feedbackEmoji}</span>
        </div>
      </header>

      {/* Advisor Engine Card */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/50 p-4 flex gap-3 shadow-sm">
        <Sparkles className="text-indigo-500 shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 text-sm mb-1">
            {t("dashboard.advisorTitle")}
          </h3>
          <p className="text-sm text-indigo-800/80 dark:text-indigo-300/80 leading-snug">
            {advice}
          </p>
        </div>
      </div>

      {over && (
        <div className="flex items-start gap-3 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
          <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={20} />
          <div className="text-sm">
            <p className="font-semibold text-rose-700 dark:text-rose-300">
              {t("dashboard.overTarget")}
            </p>
            <p className="text-rose-600/80 dark:text-rose-300/80">
              {t("dashboard.overKcal", { amount: consumed - target })}
            </p>
          </div>
        </div>
      )}

      <section className="rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="text-emerald-500" size={20} />
            <h2 className="font-semibold">{t("dashboard.today")}</h2>
          </div>
          <span className="text-xs text-slate-500">{today}</span>
        </div>
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-4xl font-bold tabular-nums">
              {consumed}
              <span className="text-base font-medium text-slate-500"> / {target} {t("common.kcal")}</span>
            </p>
            <p className={`text-sm mt-1 ${over ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400"}`}>
              {over ? t("dashboard.kcalExceed", { amount: consumed - target }) : t("dashboard.kcalRemain", { amount: remaining })}
            </p>
          </div>
        </div>
        <ProgressBar value={consumed} max={target} over={over} />
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4">
          <Target className="text-emerald-500 mb-2" size={18} />
          <p className="text-xs text-slate-500">TDEE</p>
          <p className="text-xl font-bold tabular-nums">{tdeeVal}<span className="text-xs font-medium"> {t("common.kcal")}</span></p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4">
          <TrendingDown className="text-emerald-500 mb-2" size={18} />
          <p className="text-xs text-slate-500">{t("dashboard.currentWeight")}</p>
          <p className="text-xl font-bold tabular-nums">{profile.weightKg}<span className="text-xs font-medium"> kg</span></p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4">
          <Activity className="text-emerald-500 mb-2" size={18} />
          <p className="text-xs text-slate-500">{t("dashboard.workoutToday")}</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <p className="text-xl font-bold tabular-nums">{workoutMin}<span className="text-xs font-medium">{t("common.minutes")}</span></p>
            <span className="text-xs text-slate-300 dark:text-slate-600">|</span>
            <p className="text-sm font-bold tabular-nums text-orange-500">{totalCaloriesSport}<span className="text-xs">{t("common.kcal")}</span></p>
          </div>
        </div>
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4">
          <Target className="text-emerald-500 mb-2" size={18} />
          <p className="text-xs text-slate-500">{t("profile.goal")}</p>
          <p className="text-xl font-bold tabular-nums">{profile.targetWeightKg}<span className="text-xs font-medium"> kg</span></p>
        </div>
      </section>

      {/* Accordion de deporte de hoy */}
      <details className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm mt-3">
        <summary className="flex items-center justify-between p-5 font-semibold cursor-pointer select-none">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Dumbbell size={20} />
            <span>{t("dashboard.viewSessions")}</span>
          </div>
          <ChevronDown size={20} className="text-slate-400 transition group-open:rotate-180" />
        </summary>
        <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800">
          {todayWorkouts.length === 0 ? (
            <p className="text-sm text-slate-500 mt-3">{t("dashboard.noSessions")}</p>
          ) : (
            <ul className="space-y-3 mb-4 mt-3">
              {todayWorkouts.map((s) => (
                <li key={s.id} className="flex flex-col text-sm">
                  <div className="flex justify-between font-medium">
                    <span>{t(`exerciseDb.${s.exercise}`, { defaultValue: s.exercise })}</span>
                    <span className="text-orange-500">{s.caloriesBurned || 0} {t("common.kcal")}</span>
                  </div>
                  <span className="text-slate-500 text-xs">{formatTime(s.durationSec)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </details>

      <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5">
        <h3 className="font-semibold mb-3">{t("dashboard.mealDist")}</h3>
        <ul className="space-y-2.5">
          {byMeal.map((m) => (
             <li key={m.name} className="flex items-center justify-between text-sm">
               <span className="text-slate-600 dark:text-slate-300">{m.name}</span>
               <span className="font-semibold tabular-nums">{m.kcal} {t("common.kcal")}</span>
             </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
