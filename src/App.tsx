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
  BarChart3,
} from "lucide-react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppStore } from "./store/useAppStore";
import { Dashboard } from "./components/Dashboard";
import { MealDiary } from "./components/MealDiary";
import { ProfileTab } from "./components/ProfileTab";
import { Workout } from "./components/Workout";
import { Recipes } from "./components/Recipes";
import { MyPlanTab } from "./components/MyPlanTab";
import { DietTab } from "./components/DietTab";
import { StatsTab } from "./components/StatsTab";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { todayISO } from "./lib/calc";

const NAV_ITEMS = [
  { path: "/", icon: Home, labelKey: "tabs.dashboard" },
  { path: "/plan", icon: Map, labelKey: "tabs.journey" },
  { path: "/diet", icon: Apple, labelKey: "tabs.diet" },
  { path: "/diary", icon: Utensils, labelKey: "tabs.diary" },
  { path: "/workout", icon: Dumbbell, labelKey: "tabs.workout" },
  { path: "/recipes", icon: ChefHat, labelKey: "tabs.recipes" },
  { path: "/stats", icon: BarChart3, labelKey: "tabs.stats" },
  { path: "/profile", icon: User, labelKey: "tabs.profile" },
] as const;

function BottomNav() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 max-w-md mx-auto safe-bottom">
      <div className="m-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex justify-between px-1 py-1.5">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 rounded-xl transition active:scale-95 ${
                active
                  ? "bg-emerald-500 text-white"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{t(item.labelKey)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default function App() {
  const { t } = useTranslation();

  const theme = useAppStore(s => s.theme);
  const setTheme = useAppStore(s => s.setTheme);
  const activeAccountId = useAppStore(s => s.activeAccountId);
  const accounts = useAppStore(s => s.accounts);
  const setWeights = useAppStore(s => s.setWeights);
  const createAccount = useAppStore(s => s.createAccount);
  const hasSeenWelcome = useAppStore(s => s.hasSeenWelcome);

  const activeAccount = activeAccountId ? accounts[activeAccountId] : null;

  const navigate = useNavigate();
  // Onboarding overlay: shows after first account creation
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (activeAccount && activeAccount.profile.name && !activeAccount.planStartDate) {
      setShowOnboarding(true);
    }
  }, [activeAccountId]);

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

  // Gate: show welcome screen for first-time users
  if (!hasSeenWelcome) {
    return <WelcomeScreen />;
  }

  if (!activeAccount) {
    return (
      <div className="min-h-full bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-900 dark:text-slate-100 max-w-md mx-auto">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg mb-8">
          <span className="text-4xl text-white">🎯</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">{t("onboarding.title")}</h1>
        <p className="text-center text-slate-500 mb-8">{t("onboarding.subtitle")}</p>
        <button
          onClick={() => {
            const name = window.prompt(t("onboarding.createPrompt"));
            if (name && name.trim()) {
              createAccount(name.trim());
            }
          }}
          className="w-full bg-emerald-600 text-white font-bold text-lg py-4 rounded-2xl shadow-lg active:scale-95 transition"
        >
          {t("onboarding.createBtn")}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#FDFBF7] dark:bg-slate-950 text-slate-900 dark:text-slate-100 max-w-md mx-auto relative">
      {/* Onboarding Overlay Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto shadow-lg">
              <span className="text-3xl">🎯</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t("onboarding.title")}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {t("onboarding.welcome_message")}
            </p>
            <button
              onClick={() => {
                setShowOnboarding(false);
                navigate('/profile');
              }}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-transform"
            >
              {t("onboarding.go_to_profile")} →
            </button>
          </div>
        </div>
      )}
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
            aria-label={theme === "dark" ? t("common.themeLight") : t("common.themeDark")}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* Routed Content */}
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/plan" element={<MyPlanTab />} />
          <Route path="/diet" element={<DietTab />} />
          <Route path="/diary" element={<MealDiary />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/stats" element={<StatsTab />} />
          <Route path="/profile" element={<ProfileTab />} />
        </Routes>
      </main>

      {/* Bottom nav */}
      <BottomNav />
    </div>
  );
}
