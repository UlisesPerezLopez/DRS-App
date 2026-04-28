import React, { useState } from "react";
import { 
  Dumbbell, 
  Timer, 
  Repeat, 
  ChevronDown, 
  ChevronUp, 
  Activity, 
  Target, 
  Calendar,
  Zap,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useWorkoutStore } from "../store/workoutStore";
import { ExerciseConfig, WorkoutRoutine } from "../lib/data";

/**
 * Metric Badge Component
 */
function MetricBadge({ icon: Icon, label, value, colorClass }: { icon: any, label: string, value: string | number, colorClass: string }) {
  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm transition-transform hover:scale-[1.02]`}>
      <Icon size={16} className={`${colorClass} mb-1`} />
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</span>
      <span className="text-sm font-black text-slate-700 dark:text-slate-100 tabular-nums">{value}</span>
    </div>
  );
}

/**
 * Exercise Card Component
 */
function ExerciseCard({ ex, isSupersetPart = false, isLastInSuperset = false }: { ex: ExerciseConfig, isSupersetPart?: boolean, isLastInSuperset?: boolean }) {
  const { t } = useTranslation();
  const [showWarning, setShowWarning] = useState(false);

  const name = t(`exercises.${ex.exerciseId}.name`);
  const muscles = t(`exercises.${ex.exerciseId}.muscles`);
  const warning = t(`exercises.${ex.exerciseId}.warning`);

  return (
    <div className={`relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border ${isSupersetPart ? 'border-indigo-200 dark:border-indigo-800/50' : 'border-slate-100 dark:border-slate-800'} shadow-md hover:shadow-xl transition-all duration-300 group`}>
      {isSupersetPart && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest rounded-bl-xl shadow-sm z-10">
          {t("workout.superset_label")}
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* Header: Name & Muscles */}
        <div className="space-y-1">
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {name}
          </h3>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {muscles}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3">
          <MetricBadge 
            icon={Repeat} 
            label={t("workout.metric_sets")} 
            value={ex.baseSets} 
            colorClass="text-emerald-500" 
          />
          <MetricBadge 
            icon={Target} 
            label={t("workout.metric_target")} 
            value={`${ex.targetValue}${ex.targetType === 'reps' ? ' Reps' : 's'}`} 
            colorClass="text-blue-500" 
          />
          <MetricBadge 
            icon={Timer} 
            label={t("workout.metric_rest")} 
            value={isSupersetPart && !isLastInSuperset ? "0s" : `${ex.baseRestSecs}s`} 
            colorClass={isSupersetPart && !isLastInSuperset ? "text-orange-500" : "text-slate-400"} 
          />
        </div>

        {/* Superset logic: Next indicator */}
        {isSupersetPart && !isLastInSuperset && (
          <div className="flex items-center gap-2 py-2 px-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-tight animate-pulse">
            <Zap size={14} /> {t("workout.no_rest_next")}
          </div>
        )}

        {/* Warning Block */}
        <div className="pt-2">
          <button 
            onClick={() => setShowWarning(!showWarning)}
            className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
              showWarning 
                ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400" 
                : "bg-slate-50 dark:bg-slate-800/50 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
              <ShieldAlert size={16} /> {t("workout.biomechanic_warning")}
            </div>
            {showWarning ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {showWarning && (
            <div className="mt-2 p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
              <p className="text-xs leading-relaxed font-medium text-amber-800 dark:text-amber-300">
                {warning}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Main Workout Component
 */
export function Workout() {
  const { t } = useTranslation();
  const { 
    userGoal, currentMonth, selectedTrack, 
    setGoal, setMonth, setTrack, getCurrentWorkouts 
  } = useWorkoutStore();

  const routines = getCurrentWorkouts();

  // Helper to group exercises by superset
  const renderRoutines = () => {
    return routines.map((routine: WorkoutRoutine) => {
      // Grouping logic for supersets
      const elements: React.ReactElement[] = [];
      let currentSuperset: ExerciseConfig[] = [];
      let currentSupersetId: string | null = null;

      const flushSuperset = () => {
        if (currentSuperset.length > 0) {
          elements.push(
            <div key={`ss-${currentSupersetId}-${elements.length}`} className="relative pl-4 border-l-4 border-indigo-500 space-y-4 my-2">
              <div className="absolute top-0 -left-1.5 w-3 h-3 bg-indigo-500 rounded-full shadow-md" />
              {currentSuperset.map((ex, idx) => (
                <ExerciseCard 
                  key={`${ex.exerciseId}-${idx}`} 
                  ex={ex} 
                  isSupersetPart={true} 
                  isLastInSuperset={idx === currentSuperset.length - 1} 
                />
              ))}
              <div className="absolute bottom-0 -left-1.5 w-3 h-3 bg-indigo-500 rounded-full shadow-md" />
            </div>
          );
          currentSuperset = [];
          currentSupersetId = null;
        }
      };

      routine.exercises.forEach((ex, idx) => {
        if (ex.supersetId) {
          if (currentSupersetId && currentSupersetId !== ex.supersetId) {
            flushSuperset();
          }
          currentSupersetId = ex.supersetId;
          currentSuperset.push(ex);
        } else {
          flushSuperset();
          elements.push(
            <ExerciseCard key={`${ex.exerciseId}-${idx}`} ex={ex} />
          );
        }
      });
      flushSuperset();

      return (
        <div key={routine.id} className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">
              {t(routine.translationKey)} (Lv.{routine.level})
            </span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="space-y-4">
            {elements}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 px-4 pt-6 pb-32">
      {/* Premium Header */}
      <header className="mb-8 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
              {t("workout.header_title")} <span className="text-emerald-500">{t("workout.header_pro")}</span>
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Activity size={14} className="text-indigo-500" /> {t("workout.header_subtitle")}
            </p>
          </div>
        </div>

        {/* Global Controls Panel */}
        <section className="bg-white dark:bg-slate-900 rounded-[2rem] p-4 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 space-y-4">
          
          {/* Track Switcher */}
          <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            {[
              { id: 'A', label: 'Zero Gravity', icon: Zap },
              { id: 'B', label: 'Home Gym', icon: Dumbbell }
            ].map((track) => (
              <button
                key={track.id}
                onClick={() => setTrack(track.id as 'A' | 'B')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all duration-300 ${
                  selectedTrack === track.id 
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md" 
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                <track.icon size={16} className={selectedTrack === track.id ? "text-indigo-500" : ""} />
                {track.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Goal Selector */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <Target size={16} />
              </div>
              <select
                value={userGoal}
                onChange={(e) => setGoal(e.target.value as any)}
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 appearance-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option value="lose">{t("workout.goal_lose")}</option>
                <option value="maintain">{t("workout.goal_maintain")}</option>
                <option value="gain">{t("workout.goal_gain")}</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Month Selector */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <Calendar size={16} />
              </div>
              <select
                value={currentMonth}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 appearance-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                {[1,2,3,4,5,6].map(m => (
                  <option key={m} value={m}>{t("workout.progress_month", { n: m })}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </section>
      </header>

      {/* Dynamic Routine Intro */}
      {routines.length > 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-2xl px-5 py-3 text-center">
          <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
            {t("workout.routine_intro_1")}{" "}
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
              {routines.reduce((acc, r) => acc + r.exercises.length, 0)}
            </span>{" "}
            {t("workout.routine_intro_2")}
          </p>
        </div>
      )}

      {/* Dynamic Content */}
      <main className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {renderRoutines()}
      </main>

      {/* Quick Action Button - Start Training */}
      <div className="fixed bottom-32 left-0 right-0 px-8 pointer-events-none z-50">
        <button className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-transform pointer-events-auto flex items-center justify-center gap-2 group">
          {t("workout.start_session")} <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
