const fs = require('fs');
const path = require('path');

const FOOD_TRANSLATIONS = {
  chicken: { es: "Pechuga de Pollo", de: "Hähnchenbrust", en: "Chicken Breast" },
  turkey: { es: "Pechuga de Pavo", de: "Putenbrust", en: "Turkey Breast" },
  egg: { es: "Huevo entero", de: "Ganzes Ei", en: "Whole Egg" },
  salmon: { es: "Salmón", de: "Lachs", en: "Salmon" },
  hake: { es: "Merluza", de: "Seehecht", en: "Hake" },
  canned_tuna: { es: "Atún natural (lata)", de: "Thunfisch (Dose)", en: "Canned Tuna" },
  tofu: { es: "Tofu firme", de: "Tofu", en: "Firm Tofu" },
  pork_loin: { es: "Lomo Embuchado", de: "Schweinelende", en: "Cured Pork Loin" },
  prawns: { es: "Gambas", de: "Garnelen", en: "Prawns" },
  beef_lean: { es: "Ternera magra", de: "Rinderfilet", en: "Lean Beef" },
  cod: { es: "Bacalao", de: "Kabeljau", en: "Cod" },
  sardines: { es: "Sardinas", de: "Sardinen", en: "Sardines" },
  rabbit: { es: "Conejo", de: "Kaninchenfleisch", en: "Rabbit" },
  tempeh: { es: "Tempeh", de: "Tempeh", en: "Tempeh" },
  seitan: { es: "Seitán", de: "Seitan", en: "Seitan" },
  cottage_cheese: { es: "Queso Cottage", de: "Hüttenkäse", en: "Cottage Cheese" },
  skyr: { es: "Skyr", de: "Skyr", en: "Skyr" },
  egg_white: { es: "Claras de huevo", de: "Eiweiß", en: "Egg Whites" },
  whey_protein: { es: "Whey Protein", de: "Molkenprotein", en: "Whey Protein" },
  octopus: { es: "Pulpo", de: "Oktopus", en: "Octopus" },
  oats: { es: "Avena", de: "Haferflocken", en: "Oats" },
  lentils: { es: "Lentejas (cocidas)", de: "Linsen (gekocht)", en: "Lentils (cooked)" },
  chickpeas: { es: "Garbanzos (cocidos)", de: "Kichererbsen", en: "Chickpeas" },
  quinoa: { es: "Quinoa (cocida)", de: "Quinoa", en: "Quinoa" },
  potato: { es: "Patata hervida", de: "Kartoffel (gekocht)", en: "Boiled Potato" },
  sweet_potato: { es: "Boniato hervido", de: "Süßkartoffel", en: "Sweet Potato" },
  brown_rice: { es: "Arroz Integral (cocido)", de: "Vollkornreis", en: "Brown Rice" },
  rye_bread: { es: "Pan de Centeno", de: "Roggenbrot", en: "Rye Bread" },
  whole_pasta: { es: "Pasta Integral (cocida)", de: "Vollkornnudeln", en: "Whole Wheat Pasta" },
  black_beans: { es: "Judías Negras", de: "Schwarze Bohnen", en: "Black Beans" },
  couscous: { es: "Cuscús integral", de: "Vollkorn-Couscous", en: "Whole Couscous" },
  buckwheat: { es: "Trigo sarraceno", de: "Buchweizen", en: "Buckwheat" },
  millet: { es: "Mijo", de: "Hirse", en: "Millet" },
  peas: { es: "Guisantes", de: "Erbsen", en: "Peas" },
  broad_beans: { es: "Habas", de: "Ackerbohnen", en: "Broad Beans" },
  corn_cakes: { es: "Tortitas de maíz", de: "Maiswaffeln", en: "Corn Cakes" },
  cassava: { es: "Yuca", de: "Maniok", en: "Cassava" },
  bulgur: { es: "Bulgur", de: "Bulgur", en: "Bulgur" },
  corn: { es: "Maíz dulce", de: "Zuckermais", en: "Sweet Corn" },
  amaranth: { es: "Amaranto", de: "Amaranth", en: "Amaranth" },
  spinach: { es: "Espinacas", de: "Spinat", en: "Spinach" },
  broccoli: { es: "Brócoli", de: "Brokkoli", en: "Broccoli" },
  zucchini: { es: "Calabacín", de: "Zucchini", en: "Zucchini" },
  asparagus: { es: "Espárragos", de: "Spargel", en: "Asparagus" },
  tomato: { es: "Tomate", de: "Tomate", en: "Tomato" },
  red_pepper: { es: "Pimiento Rojo", de: "Paprika rot", en: "Red Pepper" },
  cucumber: { es: "Pepino", de: "Gurke", en: "Cucumber" },
  eggplant: { es: "Berenjena", de: "Aubergine", en: "Eggplant" },
  cauliflower: { es: "Coliflor", de: "Blumenkohl", en: "Cauliflower" },
  mushrooms: { es: "Champiñones", de: "Pilze", en: "Mushrooms" },
  artichoke: { es: "Alcachofa", de: "Artischocke", en: "Artichoke" },
  onion: { es: "Cebolla", de: "Zwiebel", en: "Onion" },
  carrot: { es: "Zanahoria", de: "Karotte", en: "Carrot" },
  celery: { es: "Apio", de: "Sellerie", en: "Celery" },
  radish: { es: "Rábano", de: "Radieschen", en: "Radish" },
  lambs_lettuce: { es: "Canónigos", de: "Feldsalat", en: "Lambs Lettuce" },
  arugula: { es: "Rúcula", de: "Rucola", en: "Arugula" },
  green_beans: { es: "Judía verde", de: "Grüne Bohnen", en: "Green Beans" },
  red_cabbage: { es: "Lombarda", de: "Rotkohl", en: "Red Cabbage" },
  leek: { es: "Puerro", de: "Lauch", en: "Leek" },
  chard: { es: "Acelgas", de: "Mangold", en: "Swiss Chard" },
  escarole: { es: "Escarola", de: "Endivien", en: "Escarole" },
  endive: { es: "Endivia", de: "Chicorée", en: "Endive" },
  brussels_sprouts: { es: "Col de Bruselas", de: "Rosenkohl", en: "Brussels Sprouts" },
  fennel: { es: "Hinojo", de: "Fenchel", en: "Fennel" },
  pumpkin: { es: "Calabaza", de: "Kürbis", en: "Pumpkin" },
  garlic: { es: "Ajo", de: "Knoblauch", en: "Garlic" },
  chili: { es: "Chile", de: "Chili", en: "Chili" },
  okra: { es: "Okra", de: "Okra", en: "Okra" },
  soy_sprouts: { es: "Brotes de soja", de: "Sojasprossen", en: "Soy Sprouts" },
  olive_oil: { es: "Aceite de Oliva (AOVE)", de: "Olivenöl", en: "Olive Oil" },
  avocado: { es: "Aguacate", de: "Avocado", en: "Avocado" },
  walnuts: { es: "Nueces", de: "Walnüsse", en: "Walnuts" },
  almonds: { es: "Almendras", de: "Mandeln", en: "Almonds" },
  chia_seeds: { es: "Semillas de Chía", de: "Chiasamen", en: "Chia Seeds" },
  peanut_butter: { es: "Crema Cacahuete 100%", de: "Erdnussmus", en: "Peanut Butter" },
  pistachios: { es: "Pistachos", de: "Pistazien", en: "Pistachios" },
  flaxseed: { es: "Semillas de Lino", de: "Leinsamen", en: "Flaxseed" },
  pumpkin_seeds: { es: "Semillas de Calabaza", de: "Kürbiskerne", en: "Pumpkin Seeds" },
  olives: { es: "Aceitunas", de: "Oliven", en: "Olives" },
  cashews: { es: "Anacardos", de: "Cashewnüsse", en: "Cashews" },
  hazelnuts: { es: "Avellanas", de: "Haselnüsse", en: "Hazelnuts" },
  coconut_oil: { es: "Aceite de Coco", de: "Kokosöl", en: "Coconut Oil" },
  ghee: { es: "Ghee (Mantequilla Clarificada)", de: "Ghee", en: "Ghee" },
  macadamia: { es: "Macadamias", de: "Macadamianüsse", en: "Macadamia" },
  blueberries: { es: "Arándanos", de: "Blaubeeren", en: "Blueberries" },
  apple: { es: "Manzana", de: "Apfel", en: "Apple" },
  banana: { es: "Plátano", de: "Banane", en: "Banana" },
  strawberries: { es: "Fresas", de: "Erdbeeren", en: "Strawberries" },
  lemon: { es: "Limón", de: "Zitrone", en: "Lemon" },
  greek_yogurt: { es: "Yogur Griego 0%", de: "Griechischer Joghurt 0%", en: "Greek Yogurt 0%" },
  quark: { es: "Queso fresco batido", de: "Magerquark", en: "Quark" },
  kefir: { es: "Kéfir", de: "Kefir", en: "Kefir" },
  kiwi: { es: "Kiwi", de: "Kiwi", en: "Kiwi" },
  orange: { es: "Naranja", de: "Orange", en: "Orange" },
  pineapple: { es: "Piña", de: "Ananas", en: "Pineapple" },
  papaya: { es: "Papaya", de: "Papaya", en: "Papaya" },
  watermelon: { es: "Sandía", de: "Wassermelone", en: "Watermelon" },
  raspberries: { es: "Frambuesas", de: "Himbeeren", en: "Raspberries" },
  blackberry: { es: "Moras", de: "Brombeeren", en: "Blackberries" },
};

const WARNING_TRANSLATIONS = {
  es: { "warnings": { "high_sodium": "⚠️ Cuidado: Alto en sodio. Puede causar retención de líquidos." } },
  de: { "warnings": { "high_sodium": "⚠️ Achtung: Hoher Natriumgehalt. Kann Wassereinlagerungen verursachen." } },
  en: { "warnings": { "high_sodium": "⚠️ Warning: High sodium. May cause water retention." } },
  fr: { "warnings": { "high_sodium": "⚠️ Attention : Forte teneur en sodium. Peut causer de la rétention d'eau." } },
  it: { "warnings": { "high_sodium": "⚠️ Attenzione: Alto contenuto di sodio. Può causare ritenzione idrica." } },
};

const MEAL_DIARY_EXTRA = {
  es: { "mealDiary": { "grams": "Gramos", "perHundredG": "por 100g", "searchFood": "Buscar alimento base" } },
  de: { "mealDiary": { "grams": "Gramm", "perHundredG": "pro 100g", "searchFood": "Lebensmittel suchen" } },
  en: { "mealDiary": { "grams": "Grams", "perHundredG": "per 100g", "searchFood": "Search base food" } },
  fr: { "mealDiary": { "grams": "Grammes", "perHundredG": "pour 100g", "searchFood": "Chercher un aliment" } },
  it: { "mealDiary": { "grams": "Grammi", "perHundredG": "per 100g", "searchFood": "Cerca alimento base" } },
};

const localesDir = path.join(__dirname, 'src', 'i18n', 'locales');
const langs = ['es', 'de', 'en', 'fr', 'it'];

for (const lang of langs) {
  const filePath = path.join(localesDir, lang + '.json');
  if (!fs.existsSync(filePath)) {
    console.log('SKIP', filePath);
    continue;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Build new foodDb
  const newFoodDb = {};
  for (const [key, translations] of Object.entries(FOOD_TRANSLATIONS)) {
    newFoodDb[key] = translations[lang] || translations['en'];
  }
  data.foodDb = newFoodDb;

  // Add warnings
  const warnData = WARNING_TRANSLATIONS[lang] || WARNING_TRANSLATIONS['en'];
  data.warnings = warnData.warnings;

  // Add mealDiary extras (merge, don't overwrite)
  const mealExtra = MEAL_DIARY_EXTRA[lang] || MEAL_DIARY_EXTRA['en'];
  data.mealDiary = { ...(data.mealDiary || {}), ...mealExtra.mealDiary };

  // Remove old unitsDb (no longer needed with gram-based system)
  // Keep it for backward compat but it won't be actively used

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Updated', lang + '.json');
}

console.log('Done! All locale files updated.');
