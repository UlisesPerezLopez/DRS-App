/**
 * Offline Food Database — Base de Datos de Alimentos Offline
 * 30 alimentos base con macros por 100g, enlazados al sistema i18n via translationKey.
 */

export interface FoodItem {
  id: string;
  translationKey: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const FOOD_DB: FoodItem[] = [
  // --- PROTEÍNAS ---
  { id: "fb_chicken_breast",     translationKey: "chicken_breast",       kcal: 110,  protein: 23.0, carbs: 0.0,  fat: 1.2  },
  { id: "fb_turkey_breast",      translationKey: "turkey_breast",        kcal: 105,  protein: 24.0, carbs: 0.0,  fat: 1.0  },
  { id: "fb_canned_tuna_water",  translationKey: "canned_tuna_water",    kcal: 116,  protein: 26.0, carbs: 0.0,  fat: 1.0  },
  { id: "fb_fresh_salmon",       translationKey: "fresh_salmon",         kcal: 208,  protein: 20.0, carbs: 0.0,  fat: 13.0 },
  { id: "fb_whole_egg",          translationKey: "whole_egg",            kcal: 143,  protein: 13.0, carbs: 1.0,  fat: 10.0 },
  { id: "fb_smoked_tofu",        translationKey: "smoked_tofu",          kcal: 160,  protein: 15.0, carbs: 2.0,  fat: 9.0  },
  { id: "fb_fat_free_quark",     translationKey: "fat_free_quark",       kcal: 68,   protein: 12.0, carbs: 4.0,  fat: 0.2  },
  { id: "fb_textured_soy",       translationKey: "textured_soy",         kcal: 332,  protein: 50.0, carbs: 30.0, fat: 1.0  },
  // --- CARBOHIDRATOS ---
  { id: "fb_brown_rice_dry",     translationKey: "brown_rice_dry",       kcal: 360,  protein: 8.0,  carbs: 74.0, fat: 3.0  },
  { id: "fb_rolled_oats",        translationKey: "rolled_oats",          kcal: 389,  protein: 17.0, carbs: 66.0, fat: 7.0  },
  { id: "fb_lentils_dry",        translationKey: "lentils_dry",          kcal: 352,  protein: 25.0, carbs: 60.0, fat: 1.0  },
  { id: "fb_chickpeas_dry",      translationKey: "chickpeas_dry",        kcal: 364,  protein: 19.0, carbs: 61.0, fat: 6.0  },
  { id: "fb_quinoa_dry",         translationKey: "quinoa_dry",           kcal: 368,  protein: 14.0, carbs: 64.0, fat: 6.0  },
  { id: "fb_raw_potato",         translationKey: "raw_potato",           kcal: 77,   protein: 2.0,  carbs: 17.0, fat: 0.1  },
  { id: "fb_whole_pasta_dry",    translationKey: "whole_pasta_dry",      kcal: 348,  protein: 14.0, carbs: 71.0, fat: 2.0  },
  { id: "fb_rye_bread",          translationKey: "rye_bread_fb",         kcal: 259,  protein: 9.0,  carbs: 48.0, fat: 3.0  },
  // --- GRASAS SALUDABLES ---
  { id: "fb_evoo",               translationKey: "evoo",                 kcal: 884,  protein: 0.0,  carbs: 0.0,  fat: 100.0 },
  { id: "fb_avocado",            translationKey: "avocado_fb",           kcal: 160,  protein: 2.0,  carbs: 9.0,  fat: 15.0 },
  { id: "fb_walnuts",            translationKey: "walnuts_fb",           kcal: 654,  protein: 15.0, carbs: 14.0, fat: 65.0 },
  { id: "fb_almonds",            translationKey: "almonds_fb",           kcal: 579,  protein: 21.0, carbs: 22.0, fat: 50.0 },
  { id: "fb_chia_seeds",         translationKey: "chia_seeds_fb",        kcal: 486,  protein: 17.0, carbs: 42.0, fat: 31.0 },
  // --- VEGETALES ---
  { id: "fb_broccoli",           translationKey: "broccoli_fb",          kcal: 34,   protein: 2.8,  carbs: 7.0,  fat: 0.4  },
  { id: "fb_spinach",            translationKey: "spinach_fb",           kcal: 23,   protein: 2.9,  carbs: 3.6,  fat: 0.4  },
  { id: "fb_zucchini",           translationKey: "zucchini_fb",          kcal: 17,   protein: 1.2,  carbs: 3.1,  fat: 0.3  },
  { id: "fb_tomato",             translationKey: "tomato_fb",            kcal: 18,   protein: 0.9,  carbs: 3.9,  fat: 0.2  },
  { id: "fb_onion",              translationKey: "onion_fb",             kcal: 40,   protein: 1.1,  carbs: 9.0,  fat: 0.1  },
  { id: "fb_mushrooms",          translationKey: "mushrooms_fb",         kcal: 22,   protein: 3.1,  carbs: 3.3,  fat: 0.3  },
  // --- FRUTAS ---
  { id: "fb_apple",              translationKey: "apple_fb",             kcal: 52,   protein: 0.3,  carbs: 14.0, fat: 0.2  },
  { id: "fb_banana",             translationKey: "banana_fb",            kcal: 89,   protein: 1.1,  carbs: 23.0, fat: 0.3  },
  { id: "fb_blueberries",        translationKey: "blueberries_fb",       kcal: 57,   protein: 0.7,  carbs: 14.0, fat: 0.3  },
];
