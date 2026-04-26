import { create } from 'zustand';
import { WorkoutEngine, UserGoal } from '../lib/WorkoutEngine';
import { WORKOUT_ROUTINES, WorkoutRoutine } from '../lib/data';

interface WorkoutState {
  userGoal: UserGoal;
  currentMonth: number;
  selectedTrack: 'A' | 'B';
}

interface WorkoutActions {
  setGoal: (goal: UserGoal) => void;
  setMonth: (month: number) => void;
  setTrack: (track: 'A' | 'B') => void;
  getCurrentWorkouts: () => WorkoutRoutine[];
}

export const useWorkoutStore = create<WorkoutState & WorkoutActions>((set, get) => ({
  userGoal: 'lose',
  currentMonth: 1,
  selectedTrack: 'A',

  setGoal: (userGoal) => set({ userGoal }),
  setMonth: (currentMonth) => set({ currentMonth }),
  setTrack: (selectedTrack) => set({ selectedTrack }),

  getCurrentWorkouts: () => {
    const { selectedTrack, currentMonth, userGoal } = get();
    
    // Level logic: 
    // Meses 1-2 -> Nivel 1
    // Meses 3-4 -> Nivel 2
    // Meses 5-6 -> Nivel 3
    const level = Math.ceil(currentMonth / 2);
    
    // Filtrar rutinas base que coincidan con el track y el nivel
    const baseRoutines = WORKOUT_ROUTINES.filter(
      r => r.track === selectedTrack && r.level === level
    );

    // Pasar cada rutina por el motor algorítmico para aplicar modificadores
    return baseRoutines.map(r => WorkoutEngine.generateDynamicRoutine(r, userGoal, currentMonth));
  },
}));
