import type { CommonFood } from "../types";

export const COMMON_FOODS: CommonFood[] = [
  { name: "Té negro (sin azúcar)", calories: 2, serving: "1 taza" },
  { name: "Café con leche", calories: 60, serving: "1 taza" },
  { name: "Café solo", calories: 2, serving: "1 taza" },
  { name: "Queso Quark 0%", calories: 68, serving: "100 g" },
  { name: "Queso Quark entero", calories: 140, serving: "100 g" },
  { name: "Pan de centeno", calories: 190, serving: "100 g (2 rebanadas)" },
  { name: "Pan integral", calories: 70, serving: "1 rebanada (30g)" },
  { name: "Bocadillo queso y mortadela", calories: 380, serving: "1 unidad" },
  { name: "Mortadela", calories: 310, serving: "100 g" },
  { name: "Queso Gouda", calories: 350, serving: "100 g" },
  { name: "Pechuga de pollo a la plancha", calories: 165, serving: "100 g" },
  { name: "Pechuga de pavo fiambre", calories: 85, serving: "100 g" },
  { name: "Tofu firme", calories: 144, serving: "100 g" },
  { name: "Seitán", calories: 110, serving: "100 g" },
  { name: "Arroz blanco cocido", calories: 130, serving: "100 g" },
  { name: "Arroz integral cocido", calories: 110, serving: "100 g" },
  { name: "Pasta cocida", calories: 130, serving: "100 g" },
  { name: "Lentejas cocidas", calories: 116, serving: "100 g" },
  { name: "Garbanzos cocidos", calories: 164, serving: "100 g" },
  { name: "Patata cocida", calories: 86, serving: "100 g" },
  { name: "Boniato al horno", calories: 90, serving: "100 g" },
  { name: "Huevo cocido", calories: 78, serving: "1 unidad" },
  { name: "Claras de huevo", calories: 50, serving: "100 g" },
  { name: "Yogur natural", calories: 90, serving: "125 g" },
  { name: "Yogur griego", calories: 120, serving: "125 g" },
  { name: "Plátano", calories: 105, serving: "1 mediano" },
  { name: "Manzana", calories: 80, serving: "1 mediana" },
  { name: "Naranja", calories: 60, serving: "1 mediana" },
  { name: "Peras", calories: 57, serving: "1 mediana" },
  { name: "Fresas", calories: 32, serving: "100 g" },
  { name: "Arándanos", calories: 57, serving: "100 g" },
  { name: "Uvas", calories: 69, serving: "100 g" },
  { name: "Lechuga", calories: 15, serving: "100 g" },
  { name: "Ensalada mixta (sin aliño)", calories: 50, serving: "1 plato" },
  { name: "Tomate", calories: 18, serving: "100 g" },
  { name: "Cebolla", calories: 40, serving: "100 g" },
  { name: "Ajo", calories: 149, serving: "100 g" },
  { name: "Pimiento rojo", calories: 31, serving: "100 g" },
  { name: "Brócoli", calories: 34, serving: "100 g" },
  { name: "Espinacas", calories: 23, serving: "100 g" },
  { name: "Aceite de oliva", calories: 90, serving: "1 cucharada (10g)" },
  { name: "Mantequilla", calories: 717, serving: "100 g" },
  { name: "Almendras", calories: 160, serving: "20 g" },
  { name: "Nueces", calories: 170, serving: "20 g" },
  { name: "Chocolate negro 70%", calories: 60, serving: "10 g" },
  { name: "Atún al natural (lata)", calories: 90, serving: "1 lata (escurrido)" },
  { name: "Atún en aceite (lata)", calories: 180, serving: "1 lata (escurrido)" },
  { name: "Salmón a la plancha", calories: 200, serving: "100 g" },
  { name: "Merluza al horno", calories: 90, serving: "100 g" },
  { name: "Tostada con tomate y aceite", calories: 180, serving: "1 unidad" },
  { name: "Maiswaffel (tortita maíz)", calories: 25, serving: "1 unidad" },
  { name: "Azúcar", calories: 20, serving: "1 cucharadita (5g)" },
  { name: "Miel", calories: 64, serving: "1 cucharada (21g)" }
];

export interface Recipe {
  id: string;
  name: string;
  cost: string;
  time: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  steps: string[];
}

export const RECIPES: Recipe[] = [
  {
    id: "r1", name: "Arroz con pollo y verduras", cost: "≈ 1,80 €/ración", time: "30 min", kcal: 520, protein: 38, carbs: 60, fat: 12,
    ingredients: ["80 g arroz", "120 g pechuga de pollo", "Verduras variadas", "1 cda aceite"],
    steps: ["Sofreír verduras.", "Añadir pollo.", "Cocer arroz mientrastanto y mezclar."]
  },
  {
    id: "r2", name: "Tortilla de espinacas", cost: "≈ 1,20 €/ración", time: "15 min", kcal: 310, protein: 22, carbs: 6, fat: 22,
    ingredients: ["3 huevos", "150 g espinacas", "Ajo", "1 cda aceite"],
    steps: ["Saltear ajo y espinacas.", "Batir huevos y cuajar en la sartén."]
  },
  {
    id: "r3", name: "Lentejas rápidas", cost: "≈ 0,90 €/ración", time: "20 min", kcal: 420, protein: 22, carbs: 55, fat: 8,
    ingredients: ["200 g lentejas de bote", "Zanahoria", "Cebolla", "Pimentón"],
    steps: ["Pochar verduras.", "Añadir lentejas y un dedo de agua, cocer 10 min."]
  },
  {
    id: "r4", name: "Pasta integral con atún", cost: "≈ 1,40 €/ración", time: "20 min", kcal: 540, protein: 28, carbs: 70, fat: 14,
    ingredients: ["90 g pasta integral", "1 lata atún natural", "Tomate triturado"],
    steps: ["Cocer pasta.", "Mezclar tomate caliente y el atún escurrido."]
  },
  {
    id: "r5", name: "Crema de calabacín", cost: "≈ 1,00 €/ración", time: "25 min", kcal: 220, protein: 8, carbs: 18, fat: 12,
    ingredients: ["2 calabacines", "1 patata", "Cebolla", "1 quesito light"],
    steps: ["Hervir verduras.", "Triturar añadiendo el quesito."]
  },
  {
    id: "r6", name: "Ensalada de garbanzos", cost: "≈ 1,10 €/ración", time: "10 min", kcal: 410, protein: 18, carbs: 45, fat: 15,
    ingredients: ["150g garbanzos de bote", "Tomate", "Pepino", "Cebolla roja", "Aceite"],
    steps: ["Lavar garbanzos.", "Cortar verdura fresca y aliñar."]
  },
  {
    id: "r7", name: "Pechuga al limón con boniato", cost: "≈ 2,00 €/ración", time: "30 min", kcal: 450, protein: 35, carbs: 50, fat: 10,
    ingredients: ["150g pechuga", "1 boniato mediano", "Zumo de limón"],
    steps: ["Asar boniato al microondas (8 min).", "Plancha el pollo con limón."]
  },
  {
    id: "r8", name: "Huevos rotos saludables", cost: "≈ 1,30 €/ración", time: "20 min", kcal: 480, protein: 20, carbs: 40, fat: 22,
    ingredients: ["2 huevos", "1 patata grande", "Pimentón"],
    steps: ["Asar patata en rodajas al micro/horno.", "Hacer huevos a la plancha encima."]
  },
  {
    id: "r9", name: "Tostadas de aguacate y pavo", cost: "≈ 1,50 €/ración", time: "5 min", kcal: 320, protein: 15, carbs: 30, fat: 16,
    ingredients: ["2 rebanadas pan integral", "Media palta", "2 lonchas pavo"],
    steps: ["Tostar el pan.", "Untar aguacate y colocar pavo."]
  },
  {
    id: "r10", name: "Revuelto de claras y champiñones", cost: "≈ 1,10 €/ración", time: "15 min", kcal: 210, protein: 25, carbs: 5, fat: 10,
    ingredients: ["200g claras", "100g champiñón laminado", "Ajo", "Aceite"],
    steps: ["Saltear champiñones con ajo.", "Añadir claras hasta cuajar."]
  },
  {
    id: "r11", name: "Porridge de avena y manzana", cost: "≈ 0,70 €/ración", time: "10 min", kcal: 350, protein: 12, carbs: 60, fat: 6,
    ingredients: ["50g avena", "1 vaso leche/bebida vegetal", "1 manzana", "Canela"],
    steps: ["Cocer avena con la leche 5 min.", "Añadir manzana en dados y canela."]
  },
  {
    id: "r12", name: "Pimientos rellenos de soja", cost: "≈ 1,80 €/ración", time: "35 min", kcal: 380, protein: 25, carbs: 40, fat: 12,
    ingredients: ["2 pimientos", "50g soja texturizada", "Tomate triturado"],
    steps: ["Hidratar soja. Mezclar con tomate.", "Rellenar pimientos y hornear 25 min."]
  },
  {
    id: "r13", name: "Cuscús exprés", cost: "≈ 1,20 €/ración", time: "10 min", kcal: 400, protein: 12, carbs: 70, fat: 5,
    ingredients: ["80g cuscús", "Zanahoria rallada", "Pasas", "Caldo"],
    steps: ["Hervir mismo bol de caldo que de cuscús.", "Verter sobre cuscús, tapar 5 min y ahuecar."]
  },
  {
    id: "r14", name: "Berenjena a la plancha con queso", cost: "≈ 1,60 €/ración", time: "20 min", kcal: 290, protein: 14, carbs: 12, fat: 18,
    ingredients: ["1 berenjena", "80g queso fresco", "Orégano"],
    steps: ["Cortar berenjena a rodajas, hacer a la plancha.", "Servir con rodajas de queso encima."]
  },
  {
    id: "r15", name: "Smoothie Bowl proteico", cost: "≈ 1,50 €/ración", time: "5 min", kcal: 310, protein: 25, carbs: 35, fat: 8,
    ingredients: ["1 plátano congelado", "Queso quark", "Un puñado de fresas"],
    steps: ["Triturar plátano, fresas y quark.", "Servir en bol muy frío."]
  }
];

export interface ExerciseTemplate {
  name: string;
  description: string;
  defaultSec: number;
  category: "Mancuernas" | "Bici" | "Cuerpo libre";
  difficulty: "Básico" | "Intermedio" | "Quemagrasas";
  caloriesPerMinute: number;
}

export const EXERCISES: ExerciseTemplate[] = [
  { name: "Sentadillas (mancuernas)", description: "10 kg · 3 series · 12 reps", defaultSec: 60, category: "Mancuernas", difficulty: "Básico", caloriesPerMinute: 6 },
  { name: "Press militar", description: "Mancuernas 8-10 kg · 3 x 10", defaultSec: 60, category: "Mancuernas", difficulty: "Intermedio", caloriesPerMinute: 5 },
  { name: "Remo a una mano", description: "10 kg · 3 x 12 por brazo", defaultSec: 90, category: "Mancuernas", difficulty: "Básico", caloriesPerMinute: 6 },
  { name: "Curl de bíceps", description: "8-10 kg · 3 x 12", defaultSec: 60, category: "Mancuernas", difficulty: "Básico", caloriesPerMinute: 4 },
  { name: "Peso muerto rumano", description: "10 kg · 3 x 12", defaultSec: 60, category: "Mancuernas", difficulty: "Intermedio", caloriesPerMinute: 7 },
  { name: "Elevaciones laterales", description: "Mancuernas 4-6 kg · 3 x 15", defaultSec: 60, category: "Mancuernas", difficulty: "Básico", caloriesPerMinute: 4 },
  { name: "Bicicleta estática · suave", description: "Calentamiento 60-70 rpm", defaultSec: 600, category: "Bici", difficulty: "Básico", caloriesPerMinute: 5 },
  { name: "Bicicleta estática · HIIT", description: "Intervalos intensos 20s/10s", defaultSec: 600, category: "Bici", difficulty: "Quemagrasas", caloriesPerMinute: 12 },
  { name: "Bicicleta estática · resistencia", description: "Ritmo constante 80-90 rpm pesado", defaultSec: 1200, category: "Bici", difficulty: "Intermedio", caloriesPerMinute: 8 },
  { name: "Plancha abdominal", description: "Mantener postura", defaultSec: 45, category: "Cuerpo libre", difficulty: "Básico", caloriesPerMinute: 5 },
  { name: "Flexiones", description: "3 x 10-15 reps", defaultSec: 60, category: "Cuerpo libre", difficulty: "Intermedio", caloriesPerMinute: 8 },
  { name: "Burpees", description: "3 x 12 reps", defaultSec: 90, category: "Cuerpo libre", difficulty: "Quemagrasas", caloriesPerMinute: 15 },
  { name: "Jumping Jacks", description: "3 x 1 min", defaultSec: 60, category: "Cuerpo libre", difficulty: "Quemagrasas", caloriesPerMinute: 10 },
  { name: "Zancadas", description: "3 x 12 por pierna", defaultSec: 90, category: "Cuerpo libre", difficulty: "Básico", caloriesPerMinute: 7 }
];
