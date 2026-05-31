import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { STORAGE_KEYS } from "../lib/storage";
import type {
  FoodEntry,
  Profile,
  WeightEntry,
  WorkoutSession,
  AccountData,
  CustomFood,
  CoachMessage,
} from "../types";
import { todayISO, dailyTarget } from "../lib/calc";
import { askCoach } from "../services/aiService";

export const DEFAULT_PROFILE: Profile = {
  name: "",
  age: 45,
  gender: "male",
  heightCm: 175,
  weightKg: 85,
  targetWeightKg: 78,
  activity: "sedentary",
  goal: "lose",
  dietPreference: "mediterranea",
};

export interface AppState {
  accounts: Record<string, AccountData>;
  activeAccountId: string | null;
  theme: "light" | "dark";
  hasSeenWelcome: boolean;
  showLevelUpCelebration: boolean;
  isAiTyping: boolean;
  coachMessages: CoachMessage[];
}

export interface AppActions {
  createAccount: (name: string, profile?: Partial<Profile>) => void;
  switchAccount: (id: string) => void;
  deleteAccount: (id: string) => void;
  setProfile: (profile: Partial<Profile>) => void;
  setFoods: (foods: FoodEntry[] | ((prev: FoodEntry[]) => FoodEntry[])) => void;
  setWeights: (
    weights: WeightEntry[] | ((prev: WeightEntry[]) => WeightEntry[]),
  ) => void;
  setWorkouts: (
    workouts: WorkoutSession[] | ((prev: WorkoutSession[]) => WorkoutSession[]),
  ) => void;
  setTheme: (theme: "light" | "dark") => void;
  startPlan: (date: string) => void;
  logWater: (amountMl: number, dateStr?: string) => void;
  addCustomFood: (food: CustomFood) => void;
  completeWelcome: () => void;
  checkDailyLogin: () => void;
  dismissLevelUp: () => void;
  exportUserData: () => void;
  factoryReset: () => void;
  setAiTyping: (isAiTyping: boolean) => void;
  addCoachMessage: (message: Omit<CoachMessage, "id" | "timestamp">) => void;
  clearCoachMessages: () => void;
  sendMessageToCoach: (text: string) => Promise<void>;
}

export type AppStore = AppState & AppActions;

const getDaysBetween = (date1Str: string, date2Str: string) => {
  const d1 = new Date(date1Str + "T00:00:00");
  const d2 = new Date(date2Str + "T00:00:00");
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

const addXP = (userXP: number, userLevel: number, amount: number) => {
  let nextXP = userXP + amount;
  let nextLevel = userLevel;
  while (nextXP >= 100) {
    nextXP -= 100;
    nextLevel += 1;
  }
  return { userXP: nextXP, userLevel: nextLevel };
};

const addXPAndCheckLevelUp = (acc: AccountData, amount: number) => {
  const oldLevel = acc.userLevel || 1;
  const xpUp = addXP(acc.userXP || 0, acc.userLevel || 1, amount);
  return {
    xpUpdate: xpUp,
    levelUp: xpUp.userLevel > oldLevel,
  };
};

const customStorage: StateStorage = {
  getItem: (_name) => {
    try {
      const v2Str = localStorage.getItem("drs.store.v2");
      if (v2Str) {
        const parsed = JSON.parse(v2Str);
        if (parsed && parsed.state && parsed.state.accounts) {
          let migrated = false;
          Object.keys(parsed.state.accounts).forEach((accId) => {
            const acc = parsed.state.accounts[accId];

            // Migrate gamification variables if missing
            if (acc.currentStreak === undefined) {
              migrated = true;
              acc.currentStreak = 0;
            }
            if (acc.lastLoginDate === undefined) {
              migrated = true;
              acc.lastLoginDate = null;
            }
            if (acc.userXP === undefined) {
              migrated = true;
              acc.userXP = 0;
            }
            if (acc.userLevel === undefined) {
              migrated = true;
              acc.userLevel = 1;
            }

            if (acc.foods) {
              acc.foods = acc.foods.map((food: any) => {
                if (!food.type) {
                  migrated = true;
                  const isCustom = food.name.startsWith("custom:");
                  return {
                    ...food,
                    type: isCustom ? "custom" : "common",
                    foodId: isCustom ? food.id : food.name,
                    name: isCustom ? food.name.slice(7) : food.name,
                  };
                }
                return food;
              });
            }
          });
          if (migrated) {
            localStorage.setItem("drs.store.v2", JSON.stringify(parsed));
          }
        }
        return JSON.stringify(parsed);
      }

      // Migrar desde legacy v1 si existe
      const profileStr = localStorage.getItem(STORAGE_KEYS.profile);
      const foodsStr = localStorage.getItem(STORAGE_KEYS.foods);
      const weightsStr = localStorage.getItem(STORAGE_KEYS.weights);
      const workoutsStr = localStorage.getItem(STORAGE_KEYS.workouts);
      const themeStr = localStorage.getItem(STORAGE_KEYS.theme);
      const planStr = localStorage.getItem(STORAGE_KEYS.planStartDate);

      if (
        !profileStr &&
        !foodsStr &&
        !weightsStr &&
        !workoutsStr &&
        !themeStr &&
        !planStr
      ) {
        return null;
      }

      let profile = { ...DEFAULT_PROFILE };
      if (profileStr) {
        const parsed = JSON.parse(profileStr);
        profile = { ...DEFAULT_PROFILE, ...parsed };
        if (!profile.dietPreference) profile.dietPreference = "mediterranea";
      }

      const defaultAccount: AccountData = {
        id: "default_legacy",
        profile,
        foods: foodsStr ? JSON.parse(foodsStr) : [],
        weights: weightsStr ? JSON.parse(weightsStr) : [],
        workouts: workoutsStr ? JSON.parse(workoutsStr) : [],
        waterLogs: {},
        customFoods: [],
        planStartDate: planStr ? JSON.parse(planStr) : null,
        currentStreak: 0,
        lastLoginDate: null,
        userXP: 0,
        userLevel: 1,
      };

      const state: AppState = {
        accounts: { default_legacy: defaultAccount },
        activeAccountId: "default_legacy",
        theme: themeStr ? JSON.parse(themeStr) : "light",
        hasSeenWelcome: true, // legacy users already onboarded
        showLevelUpCelebration: false,
        isAiTyping: false,
        coachMessages: [],
      };

      return JSON.stringify({ state, version: 0 });
    } catch {
      return null;
    }
  },
  setItem: (_name, value) => {
    try {
      localStorage.setItem("drs.store.v2", value);
    } catch {
      // ignore
    }
  },
  removeItem: (_name) => {
    localStorage.removeItem("drs.store.v2");
  },
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      accounts: {},
      activeAccountId: null,
      theme: "light",
      hasSeenWelcome: false,
      showLevelUpCelebration: false,
      isAiTyping: false,
      coachMessages: [],

      createAccount: (name, profile) =>
        set((state) => {
          const id = crypto.randomUUID();
          const newAccount: AccountData = {
            id,
            profile: { ...DEFAULT_PROFILE, ...profile, name },
            foods: [],
            weights: [],
            workouts: [],
            waterLogs: {},
            customFoods: [],
            planStartDate: null,
            currentStreak: 0,
            lastLoginDate: null,
            userXP: 0,
            userLevel: 1,
          };
          return {
            accounts: { ...state.accounts, [id]: newAccount },
            activeAccountId: id,
          };
        }),

      switchAccount: (id) =>
        set((state) => {
          if (state.accounts[id]) {
            return { activeAccountId: id };
          }
          return {};
        }),

      deleteAccount: (id) =>
        set((state) => {
          const newAccounts = { ...state.accounts };
          delete newAccounts[id];

          let newActive = state.activeAccountId;
          if (newActive === id) {
            const remainingIds = Object.keys(newAccounts);
            newActive = remainingIds.length > 0 ? remainingIds[0] : null;
          }

          return {
            accounts: newAccounts,
            activeAccountId: newActive,
          };
        }),

      setProfile: (partial) =>
        set((state) => {
          if (!state.activeAccountId) return {};
          const acc = state.accounts[state.activeAccountId];
          return {
            accounts: {
              ...state.accounts,
              [state.activeAccountId]: {
                ...acc,
                profile: { ...acc.profile, ...partial },
              },
            },
          };
        }),

      setFoods: (foodsAction) =>
        set((state) => {
          if (!state.activeAccountId) return {};
          const acc = state.accounts[state.activeAccountId];
          const newFoods =
            typeof foodsAction === "function"
              ? foodsAction(acc.foods)
              : foodsAction;

          let xpUpdate = {};
          let levelUp = false;
          if (newFoods.length > acc.foods.length) {
            const res = addXPAndCheckLevelUp(acc, 15);
            xpUpdate = res.xpUpdate;
            levelUp = res.levelUp;
          }

          return {
            accounts: {
              ...state.accounts,
              [state.activeAccountId]: {
                ...acc,
                foods: newFoods,
                ...xpUpdate,
              },
            },
            ...(levelUp ? { showLevelUpCelebration: true } : {}),
          };
        }),

      setWeights: (weightsAction) =>
        set((state) => {
          if (!state.activeAccountId) return {};
          const acc = state.accounts[state.activeAccountId];
          const newWeights =
            typeof weightsAction === "function"
              ? weightsAction(acc.weights)
              : weightsAction;

          let xpUpdate = {};
          let levelUp = false;
          if (newWeights.length > acc.weights.length) {
            const res = addXPAndCheckLevelUp(acc, 20);
            xpUpdate = res.xpUpdate;
            levelUp = res.levelUp;
          }

          return {
            accounts: {
              ...state.accounts,
              [state.activeAccountId]: {
                ...acc,
                weights: newWeights,
                ...xpUpdate,
              },
            },
            ...(levelUp ? { showLevelUpCelebration: true } : {}),
          };
        }),

      setWorkouts: (workoutsAction) =>
        set((state) => {
          if (!state.activeAccountId) return {};
          const acc = state.accounts[state.activeAccountId];
          const newWorkouts =
            typeof workoutsAction === "function"
              ? workoutsAction(acc.workouts)
              : workoutsAction;

          let xpUpdate = {};
          let levelUp = false;
          if (newWorkouts.length > acc.workouts.length) {
            const res = addXPAndCheckLevelUp(acc, 30);
            xpUpdate = res.xpUpdate;
            levelUp = res.levelUp;
          }

          return {
            accounts: {
              ...state.accounts,
              [state.activeAccountId]: {
                ...acc,
                workouts: newWorkouts,
                ...xpUpdate,
              },
            },
            ...(levelUp ? { showLevelUpCelebration: true } : {}),
          };
        }),

      setTheme: (theme) => set({ theme }),

      startPlan: (date) =>
        set((state) => {
          if (!state.activeAccountId) return {};
          const acc = state.accounts[state.activeAccountId];
          return {
            accounts: {
              ...state.accounts,
              [state.activeAccountId]: { ...acc, planStartDate: date },
            },
          };
        }),

      logWater: (amountMl, dateStr) =>
        set((state) => {
          if (!state.activeAccountId) return {};
          const acc = state.accounts[state.activeAccountId];
          let key = dateStr;
          if (!key) {
            const today = new Date();
            key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
          }
          const logs = acc.waterLogs || {};
          const current = logs[key] || 0;
          const next = Math.max(0, current + amountMl);

          // Only reward XP when they increase water consumption (amountMl > 0)
          let xpUpdate = {};
          let levelUp = false;
          if (amountMl > 0) {
            const res = addXPAndCheckLevelUp(acc, 10);
            xpUpdate = res.xpUpdate;
            levelUp = res.levelUp;
          }

          return {
            accounts: {
              ...state.accounts,
              [state.activeAccountId]: {
                ...acc,
                waterLogs: { ...logs, [key]: next },
                ...xpUpdate,
              },
            },
            ...(levelUp ? { showLevelUpCelebration: true } : {}),
          };
        }),

      addCustomFood: (food) =>
        set((state) => {
          if (!state.activeAccountId) return {};
          const acc = state.accounts[state.activeAccountId];
          return {
            accounts: {
              ...state.accounts,
              [state.activeAccountId]: {
                ...acc,
                customFoods: [...(acc.customFoods || []), food],
              },
            },
          };
        }),

      completeWelcome: () => set({ hasSeenWelcome: true }),

      checkDailyLogin: () =>
        set((state) => {
          if (!state.activeAccountId) return {};
          const acc = state.accounts[state.activeAccountId];
          const today = todayISO();
          const last = acc.lastLoginDate;

          let nextStreak = acc.currentStreak || 0;
          let nextXP = acc.userXP || 0;
          let nextLevel = acc.userLevel || 1;
          let levelUp = false;

          if (!last) {
            // First time login
            nextStreak = 1;
            const xpUp = addXP(nextXP, nextLevel, 10); // Reward 10 XP on first login
            if (xpUp.userLevel > nextLevel) {
              levelUp = true;
            }
            nextXP = xpUp.userXP;
            nextLevel = xpUp.userLevel;
          } else {
            const diff = getDaysBetween(last, today);
            if (diff === 1) {
              nextStreak += 1;
              const xpUp = addXP(nextXP, nextLevel, 20); // Reward 20 XP for daily daily login
              if (xpUp.userLevel > nextLevel) {
                levelUp = true;
              }
              nextXP = xpUp.userXP;
              nextLevel = xpUp.userLevel;
            } else if (diff > 1) {
              nextStreak = 1; // broken streak
            }
          }

          return {
            accounts: {
              ...state.accounts,
              [state.activeAccountId]: {
                ...acc,
                currentStreak: nextStreak,
                lastLoginDate: today,
                userXP: nextXP,
                userLevel: nextLevel,
              },
            },
            ...(levelUp ? { showLevelUpCelebration: true } : {}),
          };
        }),

      dismissLevelUp: () => set({ showLevelUpCelebration: false }),

      exportUserData: () => {
        const state = get();
        const serializableState = {
          accounts: state.accounts,
          activeAccountId: state.activeAccountId,
          theme: state.theme,
          hasSeenWelcome: state.hasSeenWelcome,
        };
        const dataStr = JSON.stringify(serializableState, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        const fileName = `drs_backup_${yyyy}-${mm}-${dd}.json`;

        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },

      factoryReset: () => {
        localStorage.removeItem("drs.store.v2");
        window.location.reload();
      },

      setAiTyping: (isAiTyping) => set({ isAiTyping }),

      addCoachMessage: (message) =>
        set((state) => ({
          coachMessages: [
            ...state.coachMessages,
            {
              ...message,
              id: crypto.randomUUID(),
              timestamp: new Date().toISOString(),
            },
          ],
        })),

      clearCoachMessages: () => set({ coachMessages: [] }),

      sendMessageToCoach: async (text) => {
        if (!text.trim()) return;

        // Añadir el mensaje del usuario
        get().addCoachMessage({
          role: "user",
          content: text.trim(),
        });

        // Poner isAiTyping a true
        get().setAiTyping(true);

        try {
          const store = get();
          const activeAccountId = store.activeAccountId;
          const account = activeAccountId
            ? store.accounts[activeAccountId]
            : null;

          let systemPromptContent =
            "Eres DRS AI Coach, un entrenador de salud experto en nutrición, pérdida de peso y entrenamiento físico. Proporcionas consejos realistas, científicamente respaldados, motivadores pero directos y estrictos. Habla en el idioma del usuario.";

          if (account) {
            const today = todayISO();
            const todayFoods = account.foods.filter((f) => f.date === today);
            const consumedCalories = todayFoods.reduce(
              (sum, f) => sum + f.calories,
              0,
            );
            const targetCalories = dailyTarget(account.profile);
            const waterConsumedMl = (account.waterLogs || {})[today] || 0;
            const streak = account.currentStreak || 0;
            const xp = account.userXP || 0;
            const level = account.userLevel || 1;
            const userName = account.profile.name || "Usuario";
            const goalStr =
              account.profile.goal === "lose"
                ? "pérdida de peso"
                : account.profile.goal === "gain"
                  ? "ganancia de masa muscular"
                  : "mantenimiento de peso";

            systemPromptContent = `Eres DRS AI Coach, un entrenador de salud personal estricto, científico y directo. Tu misión es motivar y dar pautas basadas en la ciencia a tu cliente.
Datos reales del usuario en tiempo real:
- Fecha actual: ${today}
- Nombre del usuario: ${userName}
- Objetivo: ${goalStr}
- Nivel de Actividad: ${account.profile.activity}
- Racha activa: ${streak} días consecutivos de conexión
- Nivel actual: Nivel ${level} (${xp} / 100 XP)
- Calorías consumidas hoy: ${consumedCalories} kcal
- Presupuesto calórico total del usuario para hoy: ${targetCalories} kcal
- Agua consumida hoy: ${waterConsumedMl} ml

Instrucciones críticas:
1. Utiliza estos datos numéricos en tiempo real para dar respuestas altamente personalizadas cuando el usuario pregunte por su estado, calorías, agua o racha.
2. Si está excediendo las calorías, dale una pauta correctiva científica pero estricta. Si está haciéndolo bien, felicítale de forma motivadora y concisa.
3. Sé directo y profesional. Responde en el idioma en que te consulte el usuario.`;
          }

          // Mapear historial completo mapeado a formato OpenAI { role, content } con System Prompt dinámico prepended
          const history = [
            { role: "system" as const, content: systemPromptContent },
            ...get().coachMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          ];

          // Llamar a askCoach
          const response = await askCoach(history);

          // Añadir la respuesta de la IA
          get().addCoachMessage({
            role: "assistant",
            content: response.content,
            isOffline: response.isOffline,
          });
        } catch (error) {
          console.error("Error in sendMessageToCoach:", error);
          get().addCoachMessage({
            role: "assistant",
            content:
              "Lo siento, he experimentado un error inesperado al procesar tu consulta. Por favor, inténtalo de nuevo.",
            isOffline: true,
          });
        } finally {
          // Finalmente poner isAiTyping a false
          get().setAiTyping(false);
        }
      },
    }),
    {
      name: "drs.store.v2",
      storage: createJSONStorage(() => customStorage),
    },
  ),
);
