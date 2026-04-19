import { Map, Target, Activity, Flame, ChevronDown } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { todayISO } from "../lib/calc";
import { getCurrentPlanDay, getPhaseForDay } from "../lib/journey";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function JourneyPlan() {
  const account = useAppStore(s => s.accounts[s.activeAccountId!]);
  const { profile, workouts, planStartDate } = account;
  const startPlan = useAppStore(s => s.startPlan);
  
  if (!planStartDate) {
    return (
      <div className="px-4 py-8 pb-28 space-y-6 text-center max-w-sm mx-auto">
        <div className="mx-auto w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 rounded-full flex items-center justify-center mb-6">
          <Map size={40} />
        </div>
        <h1 className="text-2xl font-bold">Plan 90 Días</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Transforma tu cuerpo y tus hábitos con un programa estructurado de 3 fases. Especialmente diseñado para oficinistas sedentarios.
        </p>
        <div className="pt-4">
          <button 
            onClick={() => startPlan(todayISO())}
            className="w-full bg-indigo-600 active:bg-indigo-700 text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none transition"
          >
            Empezar mi reto de 90 días hoy
          </button>
        </div>
      </div>
    );
  }

  const today = todayISO();
  const currentDay = getCurrentPlanDay(planStartDate, today);
  const { phase } = getPhaseForDay(currentDay, profile.goal);
  
  const todaySessions = workouts.filter((w) => w.date === today);
  const totalCalories = todaySessions.reduce((s, w) => s + (w.caloriesBurned || 0), 0);
  
  // Calcular día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
  const d = new Date(today);
  const dayOfWeek = d.getDay();
  const routineIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Mapear Lunes=0 ... Domingo=6
  const todaysWorkout = phase.workoutRoutine[routineIndex];
  
  const percentage = Math.max(0, Math.min(100, (currentDay / 90) * 100));

  return (
    <div className="px-4 pt-4 pb-28 space-y-5">
      <header>
        <p className="text-sm text-slate-500 dark:text-slate-400">Tu Ruta</p>
        <h1 className="text-2xl font-bold">Reto 90 Días</h1>
      </header>
      
      {/* Circle Progress */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 flex flex-col items-center shadow-sm">
        <div className="relative flex items-center justify-center w-36 h-36 mb-4">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8" className="stroke-slate-100 dark:stroke-slate-800" />
            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8" className="stroke-indigo-500" strokeDasharray="283" strokeDashoffset={283 - (283 * percentage) / 100} strokeLinecap="round" />
          </svg>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-500">Día</p>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{currentDay}</p>
            <p className="text-xs text-slate-400">de 90</p>
          </div>
        </div>
        <div className="text-center">
          <h2 className="font-bold text-lg">{phase.name}</h2>
          <p className="text-sm text-slate-500">
            {currentDay > 90 
              ? "¡Felicidades, lograste terminar el reto!" 
              : `Ajuste calórico: ${phase.dailyCalorieOffset > 0 ? "+" : ""}${phase.dailyCalorieOffset} kcal`}
          </p>
        </div>
      </section>

      {/* Diet Focus */}
      <section className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Target size={20} className="text-indigo-200" />
          <h3 className="font-semibold text-lg">Enfoque Nutricional</h3>
        </div>
        <p className="text-sm opacity-90 leading-relaxed">
          {phase.dietFocus}
        </p>
      </section>

      {/* Routine */}
      <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={20} className="text-emerald-500" />
          <h3 className="font-semibold text-lg">Rutina de Hoy</h3>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center">
          <p className="font-semibold text-slate-800 dark:text-slate-200">{todaysWorkout}</p>
        </div>
        <p className="text-xs text-center text-slate-500 mt-4">
          Usa la pestaña "Entreno" para realizar los ejercicios sugeridos.
        </p>
      </section>

      {/* Accordion de deporte de hoy */}
      <details className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <summary className="flex items-center justify-between p-5 font-semibold cursor-pointer select-none">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Flame size={20} />
            <span>Detalle Deportivo Hoy</span>
          </div>
          <ChevronDown size={20} className="text-slate-400 transition group-open:rotate-180" />
        </summary>
        <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800">
          {todaySessions.length === 0 ? (
            <p className="text-sm text-slate-500 mt-3">Aún no hay sesiones registradas hoy.</p>
          ) : (
            <ul className="space-y-3 mb-4 mt-3">
              {todaySessions.map((s) => (
                <li key={s.id} className="flex flex-col text-sm">
                  <div className="flex justify-between font-medium">
                    <span>{s.exercise}</span>
                    <span className="text-orange-500">{s.caloriesBurned || 0} kcal</span>
                  </div>
                  <span className="text-slate-500 text-xs">{formatTime(s.durationSec)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between font-bold mt-4">
            <span>Total Quemado</span>
            <span className="text-orange-500">{totalCalories} kcal</span>
          </div>
        </div>
      </details>
    </div>
  );
}
