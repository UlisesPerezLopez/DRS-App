import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Check, Dumbbell, Bike, Activity } from "lucide-react";
import { EXERCISES } from "../lib/data";
import { todayISO } from "../lib/calc";
import { useAppStore } from "../store/useAppStore";
import type { WorkoutSession } from "../types";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const CATEGORY_ICON = {
  Mancuernas: Dumbbell,
  Bici: Bike,
  "Cuerpo libre": Activity,
};

const DAILY_MINUTES_GOAL = 20;

export function Workout() {
  const account = useAppStore(s => s.accounts[s.activeAccountId!]);
  const workouts = account.workouts;
  const setWorkouts = useAppStore(s => s.setWorkouts);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  function start(idx: number) {
    setActiveIdx(idx);
    setSeconds(0);
    setRunning(true);
  }

  function toggle() {
    setRunning((r) => !r);
  }

  function reset() {
    setRunning(false);
    setSeconds(0);
  }

  function finish() {
    if (activeIdx == null || seconds === 0) {
      setActiveIdx(null);
      setRunning(false);
      return;
    }
    const ex = EXERCISES[activeIdx];
    const session: WorkoutSession = {
      id: crypto.randomUUID(),
      date: todayISO(),
      exercise: ex.name,
      durationSec: seconds,
      caloriesBurned: Math.round((seconds / 60) * ex.caloriesPerMinute),
    };
    setWorkouts((prev) => [...prev, session]);
    setActiveIdx(null);
    setRunning(false);
    setSeconds(0);
  }

  const today = todayISO();
  const todaySessions = workouts.filter((w) => w.date === today);
  const totalToday = todaySessions.reduce((s, w) => s + w.durationSec, 0);
  const totalCalories = todaySessions.reduce((s, w) => s + (w.caloriesBurned || 0), 0);
  const active = activeIdx != null ? EXERCISES[activeIdx] : null;

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      <header>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Entrenamiento</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Mancuernas hasta 10 kg + bici
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 dark:text-slate-400">Hoy quemado</p>
            <p className="text-xl font-bold text-orange-500 tabular-nums">{totalCalories} <span className="text-xs">kcal</span></p>
          </div>
        </div>
      </header>

      {/* Today summary & Progress bar */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-5">
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Hoy entrenado</p>
            <p className="text-3xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
              {formatTime(totalToday)}
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">/ {DAILY_MINUTES_GOAL} min</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">{todaySessions.length} sesion{todaySessions.length !== 1 ? "es" : ""}</p>
          </div>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3 mt-4">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500 ease-out" 
            style={{ width: `${Math.min(100, (Math.floor(totalToday / 60) / DAILY_MINUTES_GOAL) * 100)}%` }}
          />
        </div>
        {Math.floor(totalToday / 60) >= DAILY_MINUTES_GOAL && (
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 text-center animate-pulse">
            🎉 ¡Felicidades! Has completado tu objetivo diario.
          </p>
        )}
      </section>

      {/* Active timer */}
      {active && (
        <section className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500 p-5">
          <p className="text-xs text-slate-500 mb-1">Activo</p>
          <h3 className="font-semibold text-lg">{active.name}</h3>
          <p className="text-xs text-slate-500 mb-3">{active.description}</p>
          <p className="text-5xl font-bold text-center tabular-nums my-3">
            {formatTime(seconds)}
          </p>
          <p className="text-center text-xs text-slate-500 mb-4">
            Sugerido: {formatTime(active.defaultSec)}
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={toggle}
              className="py-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold flex items-center justify-center gap-1.5"
            >
              {running ? <Pause size={18} /> : <Play size={18} />}
              {running ? "Pausa" : "Reanudar"}
            </button>
            <button
              onClick={reset}
              className="py-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold flex items-center justify-center gap-1.5"
            >
              <RotateCcw size={18} /> Reset
            </button>
            <button
              onClick={finish}
              className="py-3 rounded-xl bg-emerald-500 active:bg-emerald-600 text-white font-semibold flex items-center justify-center gap-1.5"
            >
              <Check size={18} /> Fin
            </button>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
        {["Todos", "Básico", "Intermedio", "Quemagrasas"].map((diff) => {
          const isSelected = diff === "Todos" ? filterDifficulty === null : filterDifficulty === diff;
          return (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff === "Todos" ? null : diff)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition ${
                isSelected
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              {diff}
            </button>
          );
        })}
      </section>

      {/* Exercise list */}
      <section className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <h2 className="font-semibold">Ejercicios</h2>
        </div>
        {EXERCISES.filter(ex => !filterDifficulty || ex.difficulty === filterDifficulty).map((ex) => {
          const i = EXERCISES.indexOf(ex);
          const Icon = CATEGORY_ICON[ex.category];
          return (
            <button
              key={ex.name}
              onClick={() => start(i)}
              disabled={activeIdx === i}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 active:bg-slate-50 dark:active:bg-slate-800 disabled:opacity-50 text-left"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold">{ex.name}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">{ex.difficulty}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{ex.description}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-slate-500">Sugerido</p>
                <p className="text-sm font-semibold tabular-nums">{formatTime(ex.defaultSec)}</p>
              </div>
            </button>
          );
        })}
      </section>

      {/* History today */}
      {todaySessions.length > 0 && (
        <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5">
          <h2 className="font-semibold mb-3">Sesiones de hoy</h2>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {todaySessions.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-2.5">
                <span className="text-sm">{s.exercise}</span>
                <span className="text-sm font-semibold tabular-nums">{formatTime(s.durationSec)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
