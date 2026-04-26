import { WorkoutRoutine, ExerciseConfig } from './data';

export type UserGoal = 'lose' | 'maintain' | 'gain';

export class WorkoutEngine {
  /**
   * Genera una rutina dinámica basada en el objetivo del usuario y su mes actual de progreso.
   */
  static generateDynamicRoutine(
    baseRoutine: WorkoutRoutine,
    goal: UserGoal,
    month: number
  ): WorkoutRoutine {
    // Clonación profunda para no mutar los datos estáticos base
    const routineCopy: WorkoutRoutine = JSON.parse(JSON.stringify(baseRoutine));

    routineCopy.exercises = routineCopy.exercises.map((ex: ExerciseConfig) => {
      let { baseSets, targetValue, baseRestSecs, targetType } = ex;

      // 1. MODIFICADORES DE OBJETIVO (Basados en el Nivel 1 por defecto: Perder Peso)
      if (goal === 'maintain') {
        // Mantener: 10-12 reps, 60-90s descanso
        if (targetType === 'reps') targetValue = Math.max(1, targetValue - 3);
        if (baseRestSecs > 0) baseRestSecs += 30;
      } else if (goal === 'gain') {
        // Ganar Músculo: 4 Series, 8-10 reps, 90-120s descanso
        baseSets += 1;
        if (targetType === 'reps') targetValue = Math.max(1, targetValue - 5);
        if (baseRestSecs > 0) baseRestSecs += 60;
      }

      // 2. MODIFICADORES DE PROGRESIÓN EN EL TIEMPO (Sobrecarga Progresiva Invisible)
      // Mes 2: Se reduce el descanso 15s y se exigen 2 reps extra (si es por reps)
      if (month === 2) {
        if (baseRestSecs > 0) baseRestSecs = Math.max(0, baseRestSecs - 15);
        if (targetType === 'reps') targetValue += 2;
      }

      // Mes 4: Aumento de Volumen (Tonelaje). +1 Serie a todo.
      if (month === 4) {
        baseSets += 1;
      }

      // Mes 6: Densidad Progresiva. -15s a todos los descansos para romper mesetas.
      if (month === 6) {
        if (baseRestSecs > 0) baseRestSecs = Math.max(0, baseRestSecs - 15);
      }

      return {
        ...ex,
        baseSets,
        targetValue,
        baseRestSecs
      };
    });

    return routineCopy;
  }
}
