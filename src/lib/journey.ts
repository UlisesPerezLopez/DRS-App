export interface PlanPhase {
  name: string;
  dietFocus: string;
  workoutRoutine: string[]; // 7 days (Monday - Sunday)
  dailyCalorieOffset: number;
}

export type GoalBranch = "lose" | "maintain" | "gain";

export const PLAN_PHASES: Record<GoalBranch, PlanPhase[]> = {
  lose: [
    {
      name: "Fase 1: Adaptación",
      dietFocus: "Priorizar proteínas en el desayuno, reducir carbohidratos en la cena.",
      workoutRoutine: [
        "Fuerza: Mancuernas (Básico)", "Cardio: Bicicleta estática (Básico)", "Descanso activo",
        "Fuerza: Cuerpo libre (Básico)", "Descanso activo", "Cardio: Bicicleta estática LISS", "Descanso total"
      ],
      dailyCalorieOffset: -300
    },
    {
      name: "Fase 2: Quema Activa",
      dietFocus: "Control estricto de azúcares. Alta ingesta de fibra. Cenar antes de las 20:00.",
      workoutRoutine: [
        "Fuerza: Mancuernas (Intermedio)", "Cardio: Bicicleta estática HIIT", "Descanso activo (Caminar 30 min)",
        "Fuerza: Cuerpo libre (Intermedio)", "Cardio: Bicicleta estática LISS", "Fuerza: Mancuernas (Intermedio) o Cuerpo Libre", "Descanso total"
      ],
      dailyCalorieOffset: -500
    },
    {
      name: "Fase 3: Definición",
      dietFocus: "Ciclo de carbohidratos. Máxima hidratación. Proteína magra en todas las comidas.",
      workoutRoutine: [
        "Cardio: Bicicleta estática HIIT + Abdomen", "Fuerza: Mancuernas (Quemagrasas)", "Cardio: Bicicleta estática LISS",
        "Fuerza: Cuerpo libre (Quemagrasas)", "Descanso activo", "Fuerza: Full Body (Mancuernas + Cuerpo Libre)", "Descanso total"
      ],
      dailyCalorieOffset: -600
    }
  ],
  maintain: [
    {
      name: "Fase 1: Estabilización",
      dietFocus: "Alcanzar macros de mantenimiento sin déficits bruscos. Foco en micronutrientes.",
      workoutRoutine: [
        "Fuerza: Mancuernas (Básico)", "Descanso activo", "Fuerza: Cuerpo libre (Básico)",
        "Descanso activo", "Cardio: Bicicleta estática (Básico)", "Fuerza: Mancuernas (Intermedio)", "Descanso total"
      ],
      dailyCalorieOffset: 0
    },
    {
      name: "Fase 2: Consolidación",
      dietFocus: "Normocalórico constante. Incluir más grasas saludables.",
      workoutRoutine: [
        "Fuerza: Mancuernas (Intermedio)", "Cardio: Bicicleta estática LISS", "Descanso activo",
        "Fuerza: Cuerpo libre (Intermedio)", "Descanso activo", "Fuerza: Mancuernas (Intermedio)", "Descanso total"
      ],
      dailyCalorieOffset: 0
    },
    {
      name: "Fase 3: Vida Saludable",
      dietFocus: "Equilibrio total. Permitir comidas trampas estructuradas sin exceso.",
      workoutRoutine: [
        "Fuerza: Mancuernas (Intermedio)", "Descanso activo", "Cardio: Bicicleta estática LISS",
        "Fuerza: Cuerpo libre (Intermedio)", "Descanso activo", "Fuerza: Mancuernas (Intermedio)", "Descanso total"
      ],
      dailyCalorieOffset: 0
    }
  ],
  gain: [
    {
      name: "Fase 1: Volumen Base",
      dietFocus: "Superávit ligero. Aumentar raciones de carbohidratos en pre/post entreno.",
      workoutRoutine: [
        "Fuerza: Mancuernas (Intermedio)", "Descanso", "Fuerza: Mancuernas (Intermedio)",
        "Descanso", "Fuerza: Mancuernas (Intermedio)", "Cardio: Bicicleta estática (Básico) muy suave", "Descanso total"
      ],
      dailyCalorieOffset: 300
    },
    {
      name: "Fase 2: Hipertrofia",
      dietFocus: "Aumento progresivo de calorías. Maximizar proteína a 2g/kg.",
      workoutRoutine: [
        "Fuerza: Mancuernas pesado", "Fuerza: Cuerpo libre hipertrofia", "Descanso",
        "Fuerza: Mancuernas pesado", "Descanso", "Fuerza: Full Body", "Descanso total"
      ],
      dailyCalorieOffset: 450
    },
    {
      name: "Fase 3: Pico de Ganancia",
      dietFocus: "Superávit agresivo limpio. Asegurar sueño profundo para recuperación muscular.",
      workoutRoutine: [
        "Fuerza: Mancuernas intenso", "Fuerza: Mancuernas intenso", "Descanso activo",
        "Fuerza: Mancuernas intenso", "Fuerza: Cuerpo libre al fallo", "Descanso", "Descanso total"
      ],
      dailyCalorieOffset: 500
    }
  ]
};

export function getCurrentPlanDay(startDateStr: string, currentDateStr: string): number {
  const start = new Date(startDateStr);
  const current = new Date(currentDateStr);
  start.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);
  
  const diffTime = current.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // El día 1 es el día que se empieza
}

export function getPhaseForDay(day: number, goal: GoalBranch): { phaseIndex: number, phase: PlanPhase } {
  const phases = PLAN_PHASES[goal] || PLAN_PHASES.lose;
  if (day <= 28) return { phaseIndex: 0, phase: phases[0] }; // Semanas 1-4 (4*7 = 28 días)
  if (day <= 56) return { phaseIndex: 1, phase: phases[1] }; // Semanas 5-8
  return { phaseIndex: 2, phase: phases[2] }; // Semanas 9-12
}
