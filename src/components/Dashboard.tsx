import { 
  Flame, 
  Activity, 
  Sparkles, 
  Dumbbell, 
  Droplets, 
  Utensils, 
  ChevronRight,
  TrendingDown
} from "lucide-react";
import { dailyTarget, dailyWaterTarget, todayISO } from "../lib/calc";
import { ProgressBar } from "./ProgressBar";
import { useAppStore } from "../store/useAppStore";
import { getSmartAdvice } from "../lib/advisor";
import { useTranslation } from "react-i18next";
import { useWorkoutStore } from "../store/workoutStore";
import { generateDailyMenu } from "../lib/dietEngine";

export function Dashboard() {
  const { t } = useTranslation();
  const account = useAppStore(s => s.accounts[s.activeAccountId!]);
  const { profile, foods, workouts, waterLogs } = account;

  const { userGoal, currentMonth, selectedTrack, getCurrentWorkouts } = useWorkoutStore();

  const today = todayISO();
  const todayFoods = foods.filter((f) => f.date === today);
  const consumed = todayFoods.reduce((s, f) => s + f.calories, 0);
  const target = dailyTarget(profile);
  const remaining = target - consumed;
  const over = consumed > target;

  const todayWorkouts = workouts.filter((w) => w.date === today);
  const workoutMin = Math.round(todayWorkouts.reduce((s, w) => s + w.durationSec, 0) / 60);

  // Water tracking
  const waterConsumed = (waterLogs || {})[today] || 0;
  const waterTarget = dailyWaterTarget(profile, workoutMin);
  const waterPercent = Math.min(100, Math.round((waterConsumed / waterTarget) * 100));

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return t("dashboard.greeting_morning");
    if (h < 19) return t("dashboard.greeting_afternoon");
    return t("dashboard.greeting_evening");
  })();

  const advice = getSmartAdvice(foods, target);

  // Nutrition Logic
  const dailyMenu = generateDailyMenu(target, profile.dietPreference || "mediterranea", profile.goal);
  const suggestion = dailyMenu[0].items[0]; // Desayuno sugerido

  // Workout Logic
  const activeRoutines = getCurrentWorkouts();
  const mainRoutine = activeRoutines[0];

  // Motivation Messages
  const getMotivation = () => {
    if (userGoal === 'lose') return t("dashboard.motivation_lose");
    if (userGoal === 'gain') return t("dashboard.motivation_gain");
    return t("dashboard.motivation_maintain");
  };

  return (
    <div className="px-4 pt-4 pb-28 space-y-6">
      <header className="space-y-1">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{greeting},</p>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
              {profile.name || t("dashboard.welcome")} 👋
            </h1>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-2xl shadow-sm">
            🎯
          </div>
        </div>
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 italic">
          "{getMotivation()}"
        </p>
      </header>

      {/* Summary Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nutrition Summary Card */}
        <div className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] p-5 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl transition-all duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Utensils size={80} className="text-emerald-500" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Utensils size={16} />
              </div>
              <h2 className="font-bold text-slate-800 dark:text-white uppercase tracking-tight text-xs">{t("dashboard.nutrition_today")}</h2>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{profile.dietPreference || "Mediterránea"}</p>
              <h3 className="text-lg font-black text-slate-900 dark:text-white truncate">
                {t("dashboard.suggestion_label")}: {suggestion ? (suggestion.translationKey ? t(`foodDb.${suggestion.translationKey}`) : suggestion.name) : "..."}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{suggestion ? t("dashboard.approx_kcal", { amount: suggestion.calories }) : ""}</p>
            </div>
            <button className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:gap-2 transition-all">
              {t("dashboard.view_full_plan")} <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Workout Summary Card */}
        <div className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] p-5 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl transition-all duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Dumbbell size={80} className="text-indigo-500" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Activity size={16} />
              </div>
              <h2 className="font-bold text-slate-800 dark:text-white uppercase tracking-tight text-xs">{t("dashboard.workout_today")}</h2>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Track {selectedTrack} · Nivel {Math.ceil(currentMonth / 2)}
              </p>
              <h3 className="text-lg font-black text-slate-900 dark:text-white truncate">
                {mainRoutine ? t(mainRoutine.translationKey) : t("dashboard.rest_day")}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {mainRoutine ? t("dashboard.exercises_count", { count: mainRoutine.exercises.length }) + " · " + userGoal : t("dashboard.active_recovery")}
              </p>
            </div>
            <button className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all">
              {t("dashboard.go_to_routine")} <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Calories Progress Card */}
      <section className="rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="text-orange-500" size={20} />
            <h2 className="font-bold text-slate-800 dark:text-white tracking-tight">{t("dashboard.calorie_budget")}</h2>
          </div>
          <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-slate-500 uppercase tracking-widest">{today}</span>
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black tracking-tighter tabular-nums">{consumed}</span>
              <span className="text-lg font-bold text-slate-400 tracking-tight">/ {target}</span>
              <span className="text-xs font-bold text-slate-400 uppercase ml-1">kcal</span>
            </div>
            <p className={`text-xs font-bold mt-2 uppercase tracking-wide ${over ? "text-rose-500" : "text-emerald-500"}`}>
              {over ? t("dashboard.kcalExceed", { amount: consumed - target }) : t("dashboard.kcalRemain", { amount: remaining })}
            </p>
          </div>
        </div>
        
        <ProgressBar value={consumed} max={target} over={over} />
      </section>

      {/* Quick Metrics Grid */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-sky-500">
              <Droplets size={14} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("dashboard.hydration")}</span>
          </div>
          <p className="text-xl font-black tabular-nums">{waterConsumed}<span className="text-xs text-slate-400 ml-1">ml</span></p>
          <div className="mt-2 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-sky-500" style={{ width: `${waterPercent}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500">
              <TrendingDown size={14} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("dashboard.current_weight")}</span>
          </div>
          <p className="text-xl font-black tabular-nums">{profile.weightKg}<span className="text-xs text-slate-400 ml-1">kg</span></p>
          <p className="text-[10px] text-emerald-500 font-bold mt-1">{t("dashboard.target_label", { weight: profile.targetWeightKg })}</p>
        </div>
      </section>

      {/* Advisor Engine Card */}
      <div className="group rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-xl shadow-indigo-200/50 dark:shadow-none space-y-3 relative overflow-hidden text-left">
        <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
          <Sparkles size={120} />
        </div>
        <div className="flex items-center gap-2 relative z-10">
          <Sparkles className="text-indigo-200" size={18} />
          <h3 className="font-black text-xs uppercase tracking-[0.2em]">{t("dashboard.ai_assistant")}</h3>
        </div>
        <p className="text-sm font-medium leading-relaxed relative z-10 text-indigo-50">
          {advice}
        </p>
      </div>

    </div>
  );
}
