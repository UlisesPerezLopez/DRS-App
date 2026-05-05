import { useMemo, useState } from "react";
import { Download, BarChart3, Plus, TrendingDown, Droplets, Dumbbell, Flame } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../store/useAppStore";
import { exportProfileDataToCSV } from "../lib/export";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { todayISO, dailyTarget, dailyWaterTarget } from "../lib/calc";

export function StatsTab() {
  const { t } = useTranslation();
  const account = useAppStore(s => s.accounts[s.activeAccountId!]);
  const setWeights = useAppStore(s => s.setWeights);
  const { profile, weights, foods, workouts, waterLogs } = account;

  const [newWeight, setNewWeight] = useState<string>("");

  const today = todayISO();

  // Habit Summary Data
  const todayFoods = foods.filter(f => f.date === today);
  const consumed = todayFoods.reduce((s, f) => s + f.calories, 0);
  const targetKcal = dailyTarget(profile);

  const todayWorkouts = workouts.filter(w => w.date === today);
  const workoutMin = Math.round(todayWorkouts.reduce((s, w) => s + w.durationSec, 0) / 60);

  const waterConsumed = (waterLogs || {})[today] || 0;
  const waterTarget = dailyWaterTarget(profile, workoutMin);

  // Build chart data for last 14 days
  const chartData = useMemo(() => {
    const days: { date: string; label: string; peso: number | null; kcal: number; agua: number; entreno: number }[] = [];
    const todayDate = new Date();

    for (let i = 13; i >= 0; i--) {
      const d = new Date(todayDate);
      d.setDate(d.getDate() - i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const label = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;

      const w = weights.find(w => w.date === iso);
      const dayFoods = foods.filter(f => f.date === iso);
      const dayWorkouts = workouts.filter(w => w.date === iso);
      const waterDay = (waterLogs || {})[iso] || 0;

      days.push({
        date: iso,
        label,
        peso: w ? w.weight : null,
        kcal: dayFoods.reduce((s, f) => s + f.calories, 0),
        agua: waterDay,
        entreno: Math.round(dayWorkouts.reduce((s, w) => s + w.durationSec, 0) / 60),
      });
    }
    return days;
  }, [weights, foods, workouts, waterLogs]);

  const handleExport = () => {
    exportProfileDataToCSV(account, profile.name);
  };

  const handleAddWeight = () => {
    const val = Number(newWeight);
    if (!isNaN(val) && val > 0) {
      setWeights(prev => {
        const existing = prev.findIndex(w => w.date === today);
        if (existing >= 0) {
          const arr = [...prev];
          arr[existing] = { date: today, weight: val };
          return arr;
        }
        return [...prev, { date: today, weight: val }];
      });
      setNewWeight("");
    }
  };

  // Find min/max for weight Y axis for better visualization
  const weightValues = chartData.filter(d => d.peso !== null).map(d => d.peso as number);
  const weightMin = weightValues.length > 0 ? Math.floor(Math.min(...weightValues) - 1) : 70;
  const weightMax = weightValues.length > 0 ? Math.ceil(Math.max(...weightValues) + 1) : 100;

  return (
    <div className="px-4 pt-4 pb-8 space-y-4">
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="text-violet-500" />
          {t("stats.title")}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{t("stats.subtitle")}</p>
      </header>

      {/* Habit Summary Panel (Gamification) */}
      <section className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 shadow-sm flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 mb-2">
            <Flame size={16} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kcal Hoy</p>
          <p className="text-sm font-black tabular-nums text-slate-800 dark:text-white">
            {consumed} <span className="text-[10px] text-slate-400 font-normal">/ {targetKcal}</span>
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 shadow-sm flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-full bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-sky-500 mb-2">
            <Droplets size={16} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agua</p>
          <p className="text-sm font-black tabular-nums text-slate-800 dark:text-white">
            {waterConsumed} <span className="text-[10px] text-slate-400 font-normal">/ {waterTarget}</span>
          </p>
        </div>
        <div className={`border rounded-2xl p-3 shadow-sm flex flex-col items-center text-center ${todayWorkouts.length > 0 ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${todayWorkouts.length > 0 ? 'bg-indigo-500 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
            <Dumbbell size={16} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entreno</p>
          <p className={`text-sm font-black ${todayWorkouts.length > 0 ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-800 dark:text-white'}`}>
            {todayWorkouts.length > 0 ? 'Completado' : 'Pendiente'}
          </p>
        </div>
      </section>

      {/* Weight Tracker Input */}
      <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <TrendingDown size={18} className="text-emerald-500" /> 
          Registrar Peso Actual
        </h3>
        <div className="flex gap-3">
          <input 
            type="number" 
            inputMode="decimal"
            placeholder="Ej. 78.5"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 font-bold tabular-nums text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          <button 
            onClick={handleAddWeight}
            disabled={!newWeight}
            className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 w-12 rounded-2xl flex items-center justify-center transition shadow-md"
          >
            <Plus size={20} />
          </button>
        </div>
      </section>

      {/* Weight + Calories Chart */}
      <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-semibold mb-4">{t("stats.weightCalChart")}</h3>
        <div className="h-64 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                yAxisId="peso"
                domain={[weightMin, weightMax]}
                tick={{ fontSize: 10, fill: "#8b5cf6" }}
                tickLine={false}
                axisLine={false}
                width={35}
                unit=" kg"
              />
              <YAxis
                yAxisId="kcal"
                orientation="right"
                tick={{ fontSize: 10, fill: "#f59e0b" }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              />
              <Line
                yAxisId="peso"
                type="monotone"
                dataKey="peso"
                name={t("stats.weight")}
                stroke="#8b5cf6"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#8b5cf6" }}
                connectNulls
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="kcal"
                type="monotone"
                dataKey="kcal"
                name={t("stats.calories")}
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 2, fill: "#f59e0b" }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Water + Training Chart */}
      <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-semibold mb-4">{t("stats.waterTrainChart")}</h3>
        <div className="h-52 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                yAxisId="agua"
                tick={{ fontSize: 10, fill: "#0ea5e9" }}
                tickLine={false}
                axisLine={false}
                width={40}
                unit=" ml"
              />
              <YAxis
                yAxisId="min"
                orientation="right"
                tick={{ fontSize: 10, fill: "#10b981" }}
                tickLine={false}
                axisLine={false}
                width={35}
                unit=" m"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Line
                yAxisId="agua"
                type="monotone"
                dataKey="agua"
                name={t("stats.water")}
                stroke="#0ea5e9"
                strokeWidth={2.5}
                dot={{ r: 2, fill: "#0ea5e9" }}
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="min"
                type="monotone"
                dataKey="entreno"
                name={t("stats.training")}
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 2, fill: "#10b981" }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
      
      {/* Export Card */}
      <section className="rounded-3xl bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950/30 dark:to-fuchsia-950/30 border border-violet-200 dark:border-violet-800/50 p-5 shadow-sm mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-violet-900 dark:text-violet-300">{t("stats.exportTitle")}</h2>
            <p className="text-xs text-violet-600/70 dark:text-violet-400/70 mt-0.5">{t("stats.exportDesc")}</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white font-semibold px-5 py-3 rounded-2xl shadow-md transition"
          >
            <Download size={18} />
            CSV
          </button>
        </div>
      </section>

    </div>
  );
}
