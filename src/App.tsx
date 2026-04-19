import { useEffect, useState } from "react";
import {
  Home,
  Utensils,
  User,
  Dumbbell,
  ChefHat,
  Sun,
  Moon,
  Map,
  Apple,
} from "lucide-react";
import { useAppStore } from "./store/useAppStore";
import { Dashboard } from "./components/Dashboard";
import { MealDiary } from "./components/MealDiary";
import { ProfileTab } from "./components/ProfileTab";
import { Workout } from "./components/Workout";
import { Recipes } from "./components/Recipes";
import { JourneyPlan } from "./components/JourneyPlan";
import { DietTab } from "./components/DietTab";
import { todayISO } from "./lib/calc";

type TabKey = "dashboard" | "journey" | "diet" | "diary" | "profile" | "workout" | "recipes";

const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { key: "dashboard", label: "Inicio", icon: Home },
  { key: "journey", label: "Mi Plan", icon: Map },
  { key: "diet", label: "Dieta", icon: Apple },
  { key: "diary", label: "Diario", icon: Utensils },
  { key: "workout", label: "Entreno", icon: Dumbbell },
  { key: "recipes", label: "Recetas", icon: ChefHat },
  { key: "profile", label: "Perfil", icon: User },
];

export default function App() {
  const [tab, setTab] = useState<TabKey>("dashboard");
  const theme = useAppStore(s => s.theme);
  const setTheme = useAppStore(s => s.setTheme);
  const activeAccountId = useAppStore(s => s.activeAccountId);
  const accounts = useAppStore(s => s.accounts);
  const setWeights = useAppStore(s => s.setWeights);
  const createAccount = useAppStore(s => s.createAccount);

  const activeAccount = activeAccountId ? accounts[activeAccountId] : null;

  // Apply theme class on root
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // First-time bootstrap: ensure today's weight is present once
  useEffect(() => {
    if (activeAccount && activeAccount.weights.length === 0 && activeAccount.profile.weightKg) {
      setWeights([{ date: todayISO(), weight: activeAccount.profile.weightKg }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAccount?.profile.weightKg, activeAccountId]);

  if (!activeAccount) {
    return (
      <div className="min-h-full bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-900 dark:text-slate-100 max-w-md mx-auto">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg mb-8">
          <span className="text-4xl text-white">🎯</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Bienvenido a DRS</h1>
        <p className="text-center text-slate-500 mb-8">Crea tu primer perfil para comenzar tu desafío de planificación saludable.</p>
        <button
          onClick={() => {
            const name = window.prompt("¿Cuál es tu nombre?");
            if (name && name.trim()) {
              createAccount(name.trim());
            }
          }}
          className="w-full bg-emerald-600 text-white font-bold text-lg py-4 rounded-2xl shadow-lg active:scale-95 transition"
        >
          Crear mi Perfil
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 max-w-md mx-auto relative">
      {/* Top header bar */}
      <div className="sticky top-0 z-30 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-100 dark:border-slate-800 safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm text-lg">
              🎯
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">DRS</p>
              <p className="text-[10px] text-slate-500 leading-tight">Desafío Rutina Saludable</p>
            </div>
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 active:scale-95 transition"
            aria-label="Cambiar tema"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* Content */}
      <main>
        {tab === "dashboard" && <Dashboard />}
        {tab === "journey" && <JourneyPlan />}
        {tab === "diet" && <DietTab />}
        {tab === "diary" && <MealDiary />}
        {tab === "profile" && <ProfileTab />}
        {tab === "workout" && <Workout />}
        {tab === "recipes" && <Recipes />}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-40 max-w-md mx-auto safe-bottom">
        <div className="m-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex justify-between px-1 py-1.5">
          {TABS.map((t) => {
            const active = tab === t.key;
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 rounded-xl transition active:scale-95 ${
                  active
                    ? "bg-emerald-500 text-white"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
