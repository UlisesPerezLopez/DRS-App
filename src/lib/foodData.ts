export interface FoodItem {
  id: string;
  name: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  translationKey: string;
  suitableFor?: ('Desayuno' | 'Media Mañana' | 'Almuerzo' | 'Merienda' | 'Cena')[];
}

export const FOOD_DB: FoodItem[] = [
  {
    id: "chicken_breast",
    name: "Pechuga de pollo",
    kcal: 110,
    protein: 23,
    carbs: 0,
    fat: 1.2,
    translationKey: "chicken_breast",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "turkey_breast",
    name: "Pechuga de pavo",
    kcal: 105,
    protein: 24,
    carbs: 0,
    fat: 1,
    translationKey: "turkey_breast",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "canned_tuna_in_water",
    name: "Atún al natural (lata)",
    kcal: 116,
    protein: 26,
    carbs: 0,
    fat: 1,
    translationKey: "canned_tuna_in_water",
    suitableFor: ["Media Mañana", "Almuerzo", "Merienda", "Cena"]
  },
  {
    id: "fresh_salmon",
    name: "Salmón fresco",
    kcal: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
    translationKey: "fresh_salmon",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "whole_egg",
    name: "Huevo entero",
    kcal: 143,
    protein: 13,
    carbs: 1,
    fat: 10,
    translationKey: "whole_egg",
    suitableFor: ["Desayuno", "Almuerzo", "Cena"]
  },
  {
    id: "smoked_tofu",
    name: "Tofu ahumado",
    kcal: 160,
    protein: 15,
    carbs: 2,
    fat: 9,
    translationKey: "smoked_tofu",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "fat_free_quark",
    name: "Queso fresco batido 0%",
    kcal: 68,
    protein: 12,
    carbs: 4,
    fat: 0.2,
    translationKey: "fat_free_quark",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda", "Cena"]
  },
  {
    id: "textured_soy_protein_dry",
    name: "Soja texturizada (seca)",
    kcal: 332,
    protein: 50,
    carbs: 30,
    fat: 1,
    translationKey: "textured_soy_protein_dry",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "brown_rice_dry",
    name: "Arroz integral (seco)",
    kcal: 360,
    protein: 8,
    carbs: 74,
    fat: 3,
    translationKey: "brown_rice_dry",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "rolled_oats",
    name: "Avena (hojuelas)",
    kcal: 389,
    protein: 17,
    carbs: 66,
    fat: 7,
    translationKey: "rolled_oats",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "lentils_dry",
    name: "Lentejas (secas)",
    kcal: 352,
    protein: 25,
    carbs: 60,
    fat: 1,
    translationKey: "lentils_dry",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "chickpeas_dry",
    name: "Garbanzos (secos)",
    kcal: 364,
    protein: 19,
    carbs: 61,
    fat: 6,
    translationKey: "chickpeas_dry",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "quinoa_dry",
    name: "Quinoa (seca)",
    kcal: 368,
    protein: 14,
    carbs: 64,
    fat: 6,
    translationKey: "quinoa_dry",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "raw_potato",
    name: "Patata cruda",
    kcal: 77,
    protein: 2,
    carbs: 17,
    fat: 0.1,
    translationKey: "raw_potato",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "whole_wheat_pasta_dry",
    name: "Pasta integral (seca)",
    kcal: 348,
    protein: 14,
    carbs: 71,
    fat: 2,
    translationKey: "whole_wheat_pasta_dry",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "rye_bread",
    name: "Pan de centeno",
    kcal: 259,
    protein: 9,
    carbs: 48,
    fat: 3,
    translationKey: "rye_bread",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "extra_virgin_olive_oil",
    name: "Aceite de Oliva Virgen Extra",
    kcal: 884,
    protein: 0,
    carbs: 0,
    fat: 100,
    translationKey: "extra_virgin_olive_oil",
    suitableFor: ["Desayuno", "Almuerzo", "Cena"]
  },
  {
    id: "avocado",
    name: "Aguacate",
    kcal: 160,
    protein: 2,
    carbs: 9,
    fat: 15,
    translationKey: "avocado",
    suitableFor: ["Desayuno", "Media Mañana", "Almuerzo", "Merienda", "Cena"]
  },
  {
    id: "walnuts",
    name: "Nueces",
    kcal: 654,
    protein: 15,
    carbs: 14,
    fat: 65,
    translationKey: "walnuts",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "almonds",
    name: "Almendras",
    kcal: 579,
    protein: 21,
    carbs: 22,
    fat: 50,
    translationKey: "almonds",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "chia_seeds",
    name: "Semillas de chía",
    kcal: 486,
    protein: 17,
    carbs: 42,
    fat: 31,
    translationKey: "chia_seeds",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "broccoli",
    name: "Brócoli",
    kcal: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    translationKey: "broccoli",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "spinach",
    name: "Espinacas",
    kcal: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    translationKey: "spinach",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "zucchini",
    name: "Calabacín",
    kcal: 17,
    protein: 1.2,
    carbs: 3.1,
    fat: 0.3,
    translationKey: "zucchini",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "tomato",
    name: "Tomate",
    kcal: 18,
    protein: 0.9,
    carbs: 3.9,
    fat: 0.2,
    translationKey: "tomato",
    suitableFor: ["Desayuno", "Media Mañana", "Almuerzo", "Merienda", "Cena"]
  },
  {
    id: "onion",
    name: "Cebolla",
    kcal: 40,
    protein: 1.1,
    carbs: 9,
    fat: 0.1,
    translationKey: "onion",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "mushrooms",
    name: "Champiñones",
    kcal: 22,
    protein: 3.1,
    carbs: 3.3,
    fat: 0.3,
    translationKey: "mushrooms",
    suitableFor: ["Desayuno", "Almuerzo", "Cena"]
  },
  {
    id: "apple",
    name: "Manzana",
    kcal: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    translationKey: "apple",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "banana",
    name: "Plátano",
    kcal: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    translationKey: "banana",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "blueberries",
    name: "Arándanos",
    kcal: 57,
    protein: 0.7,
    carbs: 14,
    fat: 0.3,
    translationKey: "blueberries",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "lean_pork_loin",
    name: "Lomo de cerdo magro",
    kcal: 143,
    protein: 21,
    carbs: 0,
    fat: 6,
    translationKey: "lean_pork_loin",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "lean_beef",
    name: "Ternera magra",
    kcal: 137,
    protein: 22,
    carbs: 0,
    fat: 5,
    translationKey: "lean_beef",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "hake",
    name: "Merluza",
    kcal: 78,
    protein: 16,
    carbs: 0,
    fat: 1,
    translationKey: "hake",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "fresh_cod",
    name: "Bacalao fresco",
    kcal: 82,
    protein: 18,
    carbs: 0,
    fat: 0.7,
    translationKey: "fresh_cod",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "sardines_drained",
    name: "Sardinas en lata (escurridas)",
    kcal: 208,
    protein: 24,
    carbs: 0,
    fat: 11,
    translationKey: "sardines_drained",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "raw_shrimp",
    name: "Gambas crudas",
    kcal: 99,
    protein: 24,
    carbs: 0.2,
    fat: 0.3,
    translationKey: "raw_shrimp",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "egg_whites",
    name: "Claras de huevo",
    kcal: 52,
    protein: 11,
    carbs: 0.7,
    fat: 0.2,
    translationKey: "egg_whites",
    suitableFor: ["Desayuno", "Almuerzo", "Cena"]
  },
  {
    id: "tempeh",
    name: "Tempeh",
    kcal: 192,
    protein: 20,
    carbs: 7.6,
    fat: 10.8,
    translationKey: "tempeh",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "seitan",
    name: "Seitán",
    kcal: 370,
    protein: 75,
    carbs: 14,
    fat: 1.9,
    translationKey: "seitan",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "edamame",
    name: "Edamame",
    kcal: 121,
    protein: 11.9,
    carbs: 9,
    fat: 5.2,
    translationKey: "edamame",
    suitableFor: ["Media Mañana", "Almuerzo", "Merienda", "Cena"]
  },
  {
    id: "feta_cheese",
    name: "Queso feta",
    kcal: 264,
    protein: 14,
    carbs: 4,
    fat: 21,
    translationKey: "feta_cheese",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "light_mozzarella",
    name: "Queso mozzarella light",
    kcal: 165,
    protein: 20,
    carbs: 2,
    fat: 9,
    translationKey: "light_mozzarella",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "cottage_cheese",
    name: "Queso cottage",
    kcal: 98,
    protein: 11,
    carbs: 3.4,
    fat: 4.3,
    translationKey: "cottage_cheese",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda", "Cena"]
  },
  {
    id: "semi_skimmed_milk",
    name: "Leche semidesnatada",
    kcal: 47,
    protein: 3.3,
    carbs: 4.8,
    fat: 1.5,
    translationKey: "semi_skimmed_milk",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "soy_milk_unsweetened",
    name: "Bebida de soja (sin azúcar)",
    kcal: 33,
    protein: 3.3,
    carbs: 1.8,
    fat: 1.8,
    translationKey: "soy_milk_unsweetened",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "almond_milk_unsweetened",
    name: "Bebida de almendras (sin azúcar)",
    kcal: 13,
    protein: 0.4,
    carbs: 0.3,
    fat: 1.1,
    translationKey: "almond_milk_unsweetened",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "raw_sweet_potato",
    name: "Boniato crudo",
    kcal: 86,
    protein: 1.6,
    carbs: 20.1,
    fat: 0.1,
    translationKey: "raw_sweet_potato",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "whole_wheat_couscous_dry",
    name: "Cuscús integral (seco)",
    kcal: 350,
    protein: 12,
    carbs: 72,
    fat: 2,
    translationKey: "whole_wheat_couscous_dry",
    suitableFor: ["Almuerzo"]
  },
  {
    id: "buckwheat_dry",
    name: "Trigo sarraceno (seco)",
    kcal: 343,
    protein: 13,
    carbs: 71.5,
    fat: 3.4,
    translationKey: "buckwheat_dry",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "black_beans_dry",
    name: "Frijoles negros (secos)",
    kcal: 341,
    protein: 21.6,
    carbs: 62.4,
    fat: 1.4,
    translationKey: "black_beans_dry",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "white_beans_dry",
    name: "Alubias blancas (secas)",
    kcal: 333,
    protein: 23.4,
    carbs: 60.3,
    fat: 0.8,
    translationKey: "white_beans_dry",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "raw_peas",
    name: "Guisantes crudos",
    kcal: 81,
    protein: 5.4,
    carbs: 14.4,
    fat: 0.4,
    translationKey: "raw_peas",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "whole_wheat_bread",
    name: "Pan integral de trigo",
    kcal: 247,
    protein: 13,
    carbs: 41,
    fat: 3.4,
    translationKey: "whole_wheat_bread",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "rice_cakes",
    name: "Tortitas de arroz",
    kcal: 387,
    protein: 8.2,
    carbs: 81.5,
    fat: 2.8,
    translationKey: "rice_cakes",
    suitableFor: ["Media Mañana", "Merienda"]
  },
  {
    id: "peanut_butter",
    name: "Mantequilla de cacahuete",
    kcal: 588,
    protein: 25,
    carbs: 20,
    fat: 50,
    translationKey: "peanut_butter",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "pumpkin_seeds",
    name: "Pipas de calabaza",
    kcal: 559,
    protein: 30.2,
    carbs: 10.7,
    fat: 49,
    translationKey: "pumpkin_seeds",
    suitableFor: ["Media Mañana", "Merienda"]
  },
  {
    id: "sunflower_seeds",
    name: "Pipas de girasol",
    kcal: 584,
    protein: 20.8,
    carbs: 20,
    fat: 51.5,
    translationKey: "sunflower_seeds",
    suitableFor: ["Media Mañana", "Merienda"]
  },
  {
    id: "pistachios",
    name: "Pistachos",
    kcal: 562,
    protein: 20.2,
    carbs: 27.2,
    fat: 45.3,
    translationKey: "pistachios",
    suitableFor: ["Media Mañana", "Merienda"]
  },
  {
    id: "cashews",
    name: "Anacardos",
    kcal: 553,
    protein: 18.2,
    carbs: 30.2,
    fat: 43.8,
    translationKey: "cashews",
    suitableFor: ["Media Mañana", "Merienda"]
  },
  {
    id: "flaxseeds",
    name: "Semillas de lino",
    kcal: 534,
    protein: 18.3,
    carbs: 28.9,
    fat: 42.2,
    translationKey: "flaxseeds",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "coconut_oil",
    name: "Aceite de coco",
    kcal: 862,
    protein: 0,
    carbs: 0,
    fat: 100,
    translationKey: "coconut_oil",
    suitableFor: ["Desayuno", "Almuerzo", "Cena"]
  },
  {
    id: "green_olives",
    name: "Aceitunas verdes",
    kcal: 115,
    protein: 0.8,
    carbs: 3.8,
    fat: 10.7,
    translationKey: "green_olives",
    suitableFor: ["Media Mañana", "Almuerzo", "Merienda"]
  },
  {
    id: "cauliflower",
    name: "Coliflor",
    kcal: 25,
    protein: 1.9,
    carbs: 4.9,
    fat: 0.3,
    translationKey: "cauliflower",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "carrot",
    name: "Zanahoria",
    kcal: 41,
    protein: 0.9,
    carbs: 9.6,
    fat: 0.2,
    translationKey: "carrot",
    suitableFor: ["Media Mañana", "Almuerzo", "Merienda", "Cena"]
  },
  {
    id: "red_bell_pepper",
    name: "Pimiento rojo",
    kcal: 31,
    protein: 1,
    carbs: 6,
    fat: 0.3,
    translationKey: "red_bell_pepper",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "eggplant",
    name: "Berenjena",
    kcal: 25,
    protein: 1,
    carbs: 5.9,
    fat: 0.2,
    translationKey: "eggplant",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "green_asparagus",
    name: "Espárragos verdes",
    kcal: 20,
    protein: 2.2,
    carbs: 3.9,
    fat: 0.1,
    translationKey: "green_asparagus",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "green_beans",
    name: "Judías verdes",
    kcal: 31,
    protein: 1.8,
    carbs: 7,
    fat: 0.2,
    translationKey: "green_beans",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "cucumber",
    name: "Pepino",
    kcal: 15,
    protein: 0.6,
    carbs: 3.6,
    fat: 0.1,
    translationKey: "cucumber",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "iceberg_lettuce",
    name: "Lechuga iceberg",
    kcal: 14,
    protein: 0.9,
    carbs: 3,
    fat: 0.1,
    translationKey: "iceberg_lettuce",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "arugula",
    name: "Rúcula",
    kcal: 25,
    protein: 2.6,
    carbs: 3.7,
    fat: 0.7,
    translationKey: "arugula",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "leek",
    name: "Puerro",
    kcal: 61,
    protein: 1.5,
    carbs: 14.2,
    fat: 0.3,
    translationKey: "leek",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "garlic",
    name: "Ajo",
    kcal: 149,
    protein: 6.4,
    carbs: 33.1,
    fat: 0.5,
    translationKey: "garlic",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "orange",
    name: "Naranja",
    kcal: 47,
    protein: 0.9,
    carbs: 11.8,
    fat: 0.1,
    translationKey: "orange",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "strawberry",
    name: "Fresa",
    kcal: 32,
    protein: 0.7,
    carbs: 7.7,
    fat: 0.3,
    translationKey: "strawberry",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "kiwi",
    name: "Kiwi",
    kcal: 61,
    protein: 1.1,
    carbs: 14.7,
    fat: 0.5,
    translationKey: "kiwi",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "pear",
    name: "Pera",
    kcal: 57,
    protein: 0.4,
    carbs: 15.2,
    fat: 0.1,
    translationKey: "pear",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "pineapple",
    name: "Piña",
    kcal: 50,
    protein: 0.5,
    carbs: 13.1,
    fat: 0.1,
    translationKey: "pineapple",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "watermelon",
    name: "Sandía",
    kcal: 30,
    protein: 0.6,
    carbs: 7.6,
    fat: 0.2,
    translationKey: "watermelon",
    suitableFor: ["Media Mañana", "Merienda"]
  },
  {
    id: "raspberries",
    name: "Frambuesas",
    kcal: 52,
    protein: 1.2,
    carbs: 11.9,
    fat: 0.6,
    translationKey: "raspberries",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "mineral_water",
    name: "Agua mineral",
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    translationKey: "mineral_water",
    suitableFor: ["Desayuno", "Media Mañana", "Almuerzo", "Merienda", "Cena"]
  },
  {
    id: "sparkling_water",
    name: "Agua con gas",
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    translationKey: "sparkling_water",
    suitableFor: ["Desayuno", "Media Mañana", "Almuerzo", "Merienda", "Cena"]
  },
  {
    id: "black_coffee",
    name: "Café negro",
    kcal: 2,
    protein: 0.1,
    carbs: 0,
    fat: 0,
    translationKey: "black_coffee",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "espresso",
    name: "Café expreso",
    kcal: 9,
    protein: 0.1,
    carbs: 1.7,
    fat: 0.2,
    translationKey: "espresso",
    suitableFor: ["Desayuno", "Media Mañana", "Almuerzo"]
  },
  {
    id: "decaf_coffee",
    name: "Café descafeinado",
    kcal: 2,
    protein: 0.1,
    carbs: 0,
    fat: 0,
    translationKey: "decaf_coffee",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda", "Cena"]
  },
  {
    id: "green_tea",
    name: "Té verde",
    kcal: 1,
    protein: 0,
    carbs: 0.2,
    fat: 0,
    translationKey: "green_tea",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "black_tea",
    name: "Té negro",
    kcal: 1,
    protein: 0,
    carbs: 0.2,
    fat: 0,
    translationKey: "black_tea",
    suitableFor: ["Desayuno", "Media Mañana"]
  },
  {
    id: "pu_erh_tea",
    name: "Té rojo",
    kcal: 1,
    protein: 0,
    carbs: 0.2,
    fat: 0,
    translationKey: "pu_erh_tea",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "chamomile_tea",
    name: "Infusión de manzanilla",
    kcal: 1,
    protein: 0,
    carbs: 0.2,
    fat: 0,
    translationKey: "chamomile_tea",
    suitableFor: ["Media Mañana", "Merienda", "Cena"]
  },
  {
    id: "mint_tea",
    name: "Infusión de menta",
    kcal: 1,
    protein: 0,
    carbs: 0.2,
    fat: 0,
    translationKey: "mint_tea",
    suitableFor: ["Media Mañana", "Merienda", "Cena"]
  },
  {
    id: "whole_milk",
    name: "Leche entera",
    kcal: 61,
    protein: 3.2,
    carbs: 4.8,
    fat: 3.6,
    translationKey: "whole_milk",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "skimmed_milk",
    name: "Leche desnatada",
    kcal: 34,
    protein: 3.4,
    carbs: 4.9,
    fat: 0.1,
    translationKey: "skimmed_milk",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "lactose_free_milk",
    name: "Leche sin lactosa",
    kcal: 40,
    protein: 3,
    carbs: 4.6,
    fat: 1,
    translationKey: "lactose_free_milk",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "oat_milk",
    name: "Bebida de avena",
    kcal: 45,
    protein: 1,
    carbs: 6.5,
    fat: 1.5,
    translationKey: "oat_milk",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "coconut_milk_drink",
    name: "Bebida de coco",
    kcal: 20,
    protein: 0.1,
    carbs: 2.7,
    fat: 0.9,
    translationKey: "coconut_milk_drink",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "rice_milk",
    name: "Bebida de arroz",
    kcal: 47,
    protein: 0.1,
    carbs: 9.4,
    fat: 1,
    translationKey: "rice_milk",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "fresh_orange_juice",
    name: "Zumo de naranja natural",
    kcal: 45,
    protein: 0.7,
    carbs: 10,
    fat: 0.2,
    translationKey: "fresh_orange_juice",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "apple_juice",
    name: "Zumo de manzana",
    kcal: 46,
    protein: 0.1,
    carbs: 11,
    fat: 0.1,
    translationKey: "apple_juice",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "pineapple_juice",
    name: "Zumo de piña",
    kcal: 50,
    protein: 0.4,
    carbs: 12,
    fat: 0.1,
    translationKey: "pineapple_juice",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "grape_juice",
    name: "Zumo de uva",
    kcal: 60,
    protein: 0.4,
    carbs: 14,
    fat: 0.1,
    translationKey: "grape_juice",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "peach_juice",
    name: "Zumo de melocotón",
    kcal: 43,
    protein: 0.3,
    carbs: 10,
    fat: 0.1,
    translationKey: "peach_juice",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "tomato_juice",
    name: "Zumo de tomate",
    kcal: 17,
    protein: 0.8,
    carbs: 3.1,
    fat: 0.1,
    translationKey: "tomato_juice",
    suitableFor: ["Media Mañana", "Almuerzo", "Merienda"]
  },
  {
    id: "chocolate_milk",
    name: "Batido de chocolate",
    kcal: 75,
    protein: 3.5,
    carbs: 10,
    fat: 2,
    translationKey: "chocolate_milk",
    suitableFor: ["Desayuno", "Merienda"]
  },
  {
    id: "cola_soda",
    name: "Refresco de cola",
    kcal: 42,
    protein: 0,
    carbs: 10.6,
    fat: 0,
    translationKey: "cola_soda",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "cola_soda_zero",
    name: "Refresco de cola zero",
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    translationKey: "cola_soda_zero",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "orange_soda",
    name: "Refresco de naranja",
    kcal: 40,
    protein: 0,
    carbs: 10,
    fat: 0,
    translationKey: "orange_soda",
    suitableFor: ["Almuerzo", "Merienda"]
  },
  {
    id: "lemon_soda",
    name: "Refresco de limón",
    kcal: 40,
    protein: 0,
    carbs: 10,
    fat: 0,
    translationKey: "lemon_soda",
    suitableFor: ["Almuerzo", "Merienda"]
  },
  {
    id: "ice_tea",
    name: "Té helado",
    kcal: 35,
    protein: 0,
    carbs: 8.5,
    fat: 0,
    translationKey: "ice_tea",
    suitableFor: ["Almuerzo", "Merienda"]
  },
  {
    id: "tonic_water",
    name: "Tónica",
    kcal: 38,
    protein: 0,
    carbs: 9,
    fat: 0,
    translationKey: "tonic_water",
    suitableFor: ["Almuerzo", "Merienda", "Cena"]
  },
  {
    id: "sports_drink",
    name: "Bebida isotónica",
    kcal: 24,
    protein: 0,
    carbs: 6,
    fat: 0,
    translationKey: "sports_drink",
    suitableFor: ["Media Mañana", "Merienda"]
  },
  {
    id: "energy_drink",
    name: "Bebida energética",
    kcal: 45,
    protein: 0,
    carbs: 11,
    fat: 0,
    translationKey: "energy_drink",
    suitableFor: ["Media Mañana", "Almuerzo"]
  },
  {
    id: "energy_drink_zero",
    name: "Bebida energética zero",
    kcal: 3,
    protein: 0,
    carbs: 0,
    fat: 0,
    translationKey: "energy_drink_zero",
    suitableFor: ["Media Mañana", "Almuerzo"]
  },
  {
    id: "lager_beer",
    name: "Cerveza rubia",
    kcal: 43,
    protein: 0.5,
    carbs: 3,
    fat: 0,
    translationKey: "lager_beer",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "non_alcoholic_beer",
    name: "Cerveza sin alcohol",
    kcal: 20,
    protein: 0.2,
    carbs: 4,
    fat: 0,
    translationKey: "non_alcoholic_beer",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "red_wine",
    name: "Vino tinto",
    kcal: 85,
    protein: 0.1,
    carbs: 2.6,
    fat: 0,
    translationKey: "red_wine",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "white_wine",
    name: "Vino blanco",
    kcal: 82,
    protein: 0.1,
    carbs: 2.6,
    fat: 0,
    translationKey: "white_wine",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "cider",
    name: "Sidra",
    kcal: 40,
    protein: 0,
    carbs: 3,
    fat: 0,
    translationKey: "cider",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "champagne_cava",
    name: "Cava / Champán",
    kcal: 75,
    protein: 0.2,
    carbs: 1.5,
    fat: 0,
    translationKey: "champagne_cava",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "grape_must",
    name: "Mosto",
    kcal: 65,
    protein: 0.3,
    carbs: 16,
    fat: 0,
    translationKey: "grape_must",
    suitableFor: ["Media Mañana", "Almuerzo"]
  },
  {
    id: "kombucha",
    name: "Kombucha",
    kcal: 15,
    protein: 0.1,
    carbs: 3,
    fat: 0,
    translationKey: "kombucha",
    suitableFor: ["Media Mañana", "Almuerzo", "Merienda"]
  },
  {
    id: "milk_kefir",
    name: "Kéfir de leche",
    kcal: 45,
    protein: 3.3,
    carbs: 4,
    fat: 1.5,
    translationKey: "milk_kefir",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "homemade_lemonade",
    name: "Limonada casera",
    kcal: 40,
    protein: 0.1,
    carbs: 10,
    fat: 0,
    translationKey: "homemade_lemonade",
    suitableFor: ["Media Mañana", "Almuerzo", "Merienda"]
  },
  {
    id: "coconut_water",
    name: "Agua de coco",
    kcal: 19,
    protein: 0.7,
    carbs: 3.7,
    fat: 0.2,
    translationKey: "coconut_water",
    suitableFor: ["Media Mañana", "Merienda"]
  },
  {
    id: "rtd_protein_shake",
    name: "Batido de proteínas (líquido)",
    kcal: 55,
    protein: 8,
    carbs: 4,
    fat: 1,
    translationKey: "rtd_protein_shake",
    suitableFor: ["Media Mañana", "Merienda"]
  },
  {
    id: "horchata",
    name: "Horchata de chufa",
    kcal: 78,
    protein: 0.6,
    carbs: 12,
    fat: 2.5,
    translationKey: "horchata",
    suitableFor: ["Media Mañana", "Merienda"]
  },
  {
    id: "fruit_smoothie",
    name: "Smoothie de frutas",
    kcal: 55,
    protein: 0.6,
    carbs: 13,
    fat: 0.2,
    translationKey: "fruit_smoothie",
    suitableFor: ["Desayuno", "Media Mañana", "Merienda"]
  },
  {
    id: "vanilla_milk",
    name: "Batido de vainilla",
    kcal: 70,
    protein: 3,
    carbs: 10,
    fat: 1.5,
    translationKey: "vanilla_milk",
    suitableFor: ["Desayuno", "Merienda"]
  },
  {
    id: "sweetened_sparkling_water",
    name: "Gaseosa",
    kcal: 35,
    protein: 0,
    carbs: 9,
    fat: 0,
    translationKey: "sweetened_sparkling_water",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "chicken_broth",
    name: "Caldo de pollo (líquido)",
    kcal: 15,
    protein: 1,
    carbs: 1,
    fat: 0.5,
    translationKey: "chicken_broth",
    suitableFor: ["Almuerzo", "Cena"]
  },
  {
    id: "vegetable_broth",
    name: "Caldo de verduras (líquido)",
    kcal: 10,
    protein: 0.5,
    carbs: 1.5,
    fat: 0.2,
    translationKey: "vegetable_broth",
    suitableFor: ["Almuerzo", "Cena"]
  }
];
