import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { STORAGE_KEYS } from "../lib/storage";
import type { FoodEntry, Profile, WeightEntry, WorkoutSession, AccountData, CustomFood } from "../types";

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
}

export interface AppActions {
  createAccount: (name: string, profile?: Partial<Profile>) => void;
  switchAccount: (id: string) => void;
  deleteAccount: (id: string) => void;
  setProfile: (profile: Partial<Profile>) => void;
  setFoods: (foods: FoodEntry[] | ((prev: FoodEntry[]) => FoodEntry[])) => void;
  setWeights: (weights: WeightEntry[] | ((prev: WeightEntry[]) => WeightEntry[])) => void;
  setWorkouts: (workouts: WorkoutSession[] | ((prev: WorkoutSession[]) => WorkoutSession[])) => void;
  setTheme: (theme: "light" | "dark") => void;
  startPlan: (date: string) => void;
  logWater: (amountMl: number) => void;
  addCustomFood: (food: Omit<CustomFood, 'id'>) => void;
  completeWelcome: () => void;
}

export type AppStore = AppState & AppActions;

const customStorage: StateStorage = {
  getItem: (_name) => {
    try {
      const v2Str = localStorage.getItem("drs.store.v2");
      if (v2Str) {
        return v2Str;
      }

      // Migrar desde legacy v1 si existe
      const profileStr = localStorage.getItem(STORAGE_KEYS.profile);
      const foodsStr = localStorage.getItem(STORAGE_KEYS.foods);
      const weightsStr = localStorage.getItem(STORAGE_KEYS.weights);
      const workoutsStr = localStorage.getItem(STORAGE_KEYS.workouts);
      const themeStr = localStorage.getItem(STORAGE_KEYS.theme);
      const planStr = localStorage.getItem(STORAGE_KEYS.planStartDate);

      if (!profileStr && !foodsStr && !weightsStr && !workoutsStr && !themeStr && !planStr) {
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
      };

      const state: AppState = {
        accounts: { "default_legacy": defaultAccount },
        activeAccountId: "default_legacy",
        theme: themeStr ? JSON.parse(themeStr) : "light",
        hasSeenWelcome: true, // legacy users already onboarded
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
    (set) => ({
      accounts: {},
      activeAccountId: null,
      theme: "light",
      hasSeenWelcome: false,

      createAccount: (name, profile) => set((state) => {
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
        };
        return {
          accounts: { ...state.accounts, [id]: newAccount },
          activeAccountId: id
        };
      }),

      switchAccount: (id) => set((state) => {
        if (state.accounts[id]) {
          return { activeAccountId: id };
        }
        return {};
      }),

      deleteAccount: (id) => set((state) => {
        const newAccounts = { ...state.accounts };
        delete newAccounts[id];
        
        let newActive = state.activeAccountId;
        if (newActive === id) {
          const remainingIds = Object.keys(newAccounts);
          newActive = remainingIds.length > 0 ? remainingIds[0] : null;
        }

        return {
          accounts: newAccounts,
          activeAccountId: newActive
        };
      }),

      setProfile: (partial) => set((state) => {
        if (!state.activeAccountId) return {};
        const acc = state.accounts[state.activeAccountId];
        return {
          accounts: {
            ...state.accounts,
            [state.activeAccountId]: {
              ...acc,
              profile: { ...acc.profile, ...partial }
            }
          }
        };
      }),

      setFoods: (foodsAction) => set((state) => {
        if (!state.activeAccountId) return {};
        const acc = state.accounts[state.activeAccountId];
        const newFoods = typeof foodsAction === "function" ? foodsAction(acc.foods) : foodsAction;
        return {
          accounts: {
            ...state.accounts,
            [state.activeAccountId]: { ...acc, foods: newFoods }
          }
        };
      }),

      setWeights: (weightsAction) => set((state) => {
        if (!state.activeAccountId) return {};
        const acc = state.accounts[state.activeAccountId];
        const newWeights = typeof weightsAction === "function" ? weightsAction(acc.weights) : weightsAction;
        return {
          accounts: {
            ...state.accounts,
            [state.activeAccountId]: { ...acc, weights: newWeights }
          }
        };
      }),

      setWorkouts: (workoutsAction) => set((state) => {
        if (!state.activeAccountId) return {};
        const acc = state.accounts[state.activeAccountId];
        const newWorkouts = typeof workoutsAction === "function" ? workoutsAction(acc.workouts) : workoutsAction;
        return {
          accounts: {
            ...state.accounts,
            [state.activeAccountId]: { ...acc, workouts: newWorkouts }
          }
        };
      }),

      setTheme: (theme) => set({ theme }),

      startPlan: (date) => set((state) => {
        if (!state.activeAccountId) return {};
        const acc = state.accounts[state.activeAccountId];
        return {
          accounts: {
            ...state.accounts,
            [state.activeAccountId]: { ...acc, planStartDate: date }
          }
        };
      }),

      logWater: (amountMl) => set((state) => {
        if (!state.activeAccountId) return {};
        const acc = state.accounts[state.activeAccountId];
        const today = new Date();
        const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const logs = acc.waterLogs || {};
        const current = logs[key] || 0;
        const next = Math.max(0, current + amountMl);
        return {
          accounts: {
            ...state.accounts,
            [state.activeAccountId]: {
              ...acc,
              waterLogs: { ...logs, [key]: next }
            }
          }
        };
      }),

      addCustomFood: (food) => set((state) => {
        if (!state.activeAccountId) return {};
        const acc = state.accounts[state.activeAccountId];
        const newFood: CustomFood = { ...food, id: crypto.randomUUID() };
        return {
          accounts: {
            ...state.accounts,
            [state.activeAccountId]: {
              ...acc,
              customFoods: [...(acc.customFoods || []), newFood]
            }
          }
        };
      }),

      completeWelcome: () => set({ hasSeenWelcome: true }),
    }),
    {
      name: "drs.store.v2", 
      storage: createJSONStorage(() => customStorage),
    }
  )
);
