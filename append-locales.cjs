const fs = require('fs');
const path = require('path');

const locales = ['es', 'en', 'de', 'fr', 'it'];

const foodsDb = {
  "Té negro (sin azúcar)": { en: "Black tea (unsweetened)", de: "Schwarzer Tee (ungesüßt)", fr: "Thé noir (non sucré)", it: "Tè nero (non zuccherato)" },
  "Café con leche": { en: "Coffee with milk", de: "Kaffee mit Milch", fr: "Café au lait", it: "Caffè con latte" },
  "Café solo": { en: "Black coffee", de: "Schwarzer Kaffee", fr: "Café noir", it: "Caffè nero" },
  "Queso Quark 0%": { en: "Quark cheese 0%", de: "Magerquark 0%", fr: "Fromage Quark 0%", it: "Formaggio Quark 0%" },
  "Queso Quark entero": { en: "Whole Quark cheese", de: "Quark Vollfett", fr: "Fromage Quark entier", it: "Formaggio Quark intero" },
  "Pan de centeno": { en: "Rye bread", de: "Roggenbrot", fr: "Pain de seigle", it: "Pane di segale" },
  "Pan integral": { en: "Whole wheat bread", de: "Vollkornbrot", fr: "Pain complet", it: "Pane integrale" },
  "Bocadillo queso y mortadela": { en: "Cheese and mortadella sandwich", de: "Käse-Mortadella-Sandwich", fr: "Sandwich fromage mortadelle", it: "Panino formaggio e mortadella" },
  "Mortadela": { en: "Mortadella", de: "Mortadella", fr: "Mortadelle", it: "Mortadella" },
  "Queso Gouda": { en: "Gouda cheese", de: "Gouda-Käse", fr: "Fromage Gouda", it: "Formaggio Gouda" },
  "Pechuga de pollo a la plancha": { en: "Grilled chicken breast", de: "Gegrillte Hähnchenbrust", fr: "Blanc de poulet grillé", it: "Petto di pollo alla griglia" },
  "Pechuga de pavo fiambre": { en: "Turkey breast cold cut", de: "Putenbrust-Aufschnitt", fr: "Blanc de dinde en tranches", it: "Fesa di tacchino" },
  "Tofu firme": { en: "Firm tofu", de: "Fester Tofu", fr: "Tofu ferme", it: "Tofu fermo" },
  "Seitán": { en: "Seitan", de: "Seitan", fr: "Seitan", it: "Seitan" },
  "Arroz blanco cocido": { en: "Cooked white rice", de: "Gekochter weißer Reis", fr: "Riz blanc cuit", it: "Riso bianco cotto" },
  "Arroz integral cocido": { en: "Cooked brown rice", de: "Gekochter Naturreis", fr: "Riz complet cuit", it: "Riso integrale cotto" },
  "Pasta cocida": { en: "Cooked pasta", de: "Gekochte Nudeln", fr: "Pâtes cuites", it: "Pasta cotta" },
  "Lentejas cocidas": { en: "Cooked lentils", de: "Gekochte Linsen", fr: "Lentilles cuites", it: "Lenticchie cotte" },
  "Garbanzos cocidos": { en: "Cooked chickpeas", de: "Gekochte Kichererbsen", fr: "Pois chiches cuits", it: "Ceci cotti" },
  "Patata cocida": { en: "Boiled potato", de: "Gekochte Kartoffel", fr: "Pomme de terre bouillie", it: "Patata bollita" },
  "Boniato al horno": { en: "Baked sweet potato", de: "Gebackene Süßkartoffel", fr: "Patate douce au four", it: "Patata dolce al forno" },
  "Huevo cocido": { en: "Boiled egg", de: "Gekochtes Ei", fr: "Œuf dur", it: "Uovo sodo" },
  "Claras de huevo": { en: "Egg whites", de: "Eiklar", fr: "Blancs d'œufs", it: "Albumi" },
  "Yogur natural": { en: "Natural yogurt", de: "Naturjoghurt", fr: "Yaourt nature", it: "Yogurt naturale" },
  "Yogur griego": { en: "Greek yogurt", de: "Griechischer Joghurt", fr: "Yaourt grec", it: "Yogurt greco" },
  "Plátano": { en: "Banana", de: "Banane", fr: "Banane", it: "Banana" },
  "Manzana": { en: "Apple", de: "Apfel", fr: "Pomme", it: "Mela" },
  "Naranja": { en: "Orange", de: "Orange", fr: "Orange", it: "Arancia" },
  "Peras": { en: "Pears", de: "Birnen", fr: "Poires", it: "Pere" },
  "Fresas": { en: "Strawberries", de: "Erdbeeren", fr: "Fraises", it: "Fragole" },
  "Arándanos": { en: "Blueberries", de: "Blaubeeren", fr: "Myrtilles", it: "Mirtilli" },
  "Uvas": { en: "Grapes", de: "Trauben", fr: "Raisins", it: "Uva" },
  "Lechuga": { en: "Lettuce", de: "Salat", fr: "Laitue", it: "Lattuga" },
  "Ensalada mixta (sin aliño)": { en: "Mixed salad (no dressing)", de: "Gemischter Salat (ohne Dressing)", fr: "Salade mixte (sans vinaigrette)", it: "Insalata mista (senza condimento)" },
  "Tomate": { en: "Tomato", de: "Tomate", fr: "Tomate", it: "Pomodoro" },
  "Cebolla": { en: "Onion", de: "Zwiebel", fr: "Oignon", it: "Cipolla" },
  "Ajo": { en: "Garlic", de: "Knoblauch", fr: "Ail", it: "Aglio" },
  "Pimiento rojo": { en: "Red pepper", de: "Rote Paprika", fr: "Poivron rouge", it: "Peperone rosso" },
  "Brócoli": { en: "Broccoli", de: "Brokkoli", fr: "Brocoli", it: "Broccoli" },
  "Espinacas": { en: "Spinach", de: "Spinat", fr: "Épinards", it: "Spinaci" },
  "Aceite de oliva": { en: "Olive oil", de: "Olivenöl", fr: "Huile d'olive", it: "Olio d'oliva" },
  "Mantequilla": { en: "Butter", de: "Butter", fr: "Beurre", it: "Burro" },
  "Almendras": { en: "Almonds", de: "Mandeln", fr: "Amandes", it: "Mandorle" },
  "Nueces": { en: "Walnuts", de: "Walnüsse", fr: "Noix", it: "Noci" },
  "Chocolate negro 70%": { en: "Dark chocolate 70%", de: "Dunkle Schokolade 70%", fr: "Chocolat noir 70%", it: "Cioccolato fondente 70%" },
  "Atún al natural (lata)": { en: "Canned tuna in water", de: "Thunfisch im eigenen Saft", fr: "Thon au naturel (boîte)", it: "Tonno al naturale (scatola)" },
  "Atún en aceite (lata)": { en: "Canned tuna in oil", de: "Thunfisch in Öl", fr: "Thon à l'huile (boîte)", it: "Tonno sott'olio (scatola)" },
  "Salmón a la plancha": { en: "Grilled salmon", de: "Gegrillter Lachs", fr: "Saumon grillé", it: "Salmone alla griglia" },
  "Merluza al horno": { en: "Baked hake", de: "Gebackener Seehecht", fr: "Colin au four", it: "Merluzzo al forno" },
  "Tostada con tomate y aceite": { en: "Toast with tomato and oil", de: "Toast mit Tomate und Öl", fr: "Toast à la tomate et huile", it: "Toast con pomodoro e olio" },
  "Maiswaffel (tortita maíz)": { en: "Corn cake", de: "Maiswaffel", fr: "Galette de maïs", it: "Galletta di mais" },
  "Azúcar": { en: "Sugar", de: "Zucker", fr: "Sucre", it: "Zucchero" },
  "Miel": { en: "Honey", de: "Honig", fr: "Miel", it: "Miele" }
};

const exercisesDb = {
  "Sentadillas (mancuernas)": { en: "Squats (dumbbells)", de: "Kniebeugen (Kurzhanteln)", fr: "Squats (haltères)", it: "Squat (manubri)" },
  "Press militar": { en: "Military press", de: "Frontdrücken", fr: "Développé militaire", it: "Lento avanti" },
  "Remo a una mano": { en: "One-arm row", de: "Einarmiges Rudern", fr: "Rowing à un bras", it: "Rematore a un braccio" },
  "Curl de bíceps": { en: "Bicep curl", de: "Bizepscurls", fr: "Curl biceps", it: "Curl bicipiti" },
  "Peso muerto rumano": { en: "Romanian deadlift", de: "Rumänisches Kreuzheben", fr: "Soulevé de terre roumain", it: "Stacco rumeno" },
  "Elevaciones laterales": { en: "Lateral raises", de: "Seitheben", fr: "Élévations latérales", it: "Alzate laterali" },
  "Bicicleta estática · suave": { en: "Stationary bike · light", de: "Heimtrainer · leicht", fr: "Vélo d'appartement · doux", it: "Cyclette · leggero" },
  "Bicicleta estática · HIIT": { en: "Stationary bike · HIIT", de: "Heimtrainer · HIIT", fr: "Vélo d'appartement · HIIT", it: "Cyclette · HIIT" },
  "Bicicleta estática · resistencia": { en: "Stationary bike · resistance", de: "Heimtrainer · Widerstand", fr: "Vélo d'appartement · résistance", it: "Cyclette · resistenza" },
  "Plancha abdominal": { en: "Plank", de: "Unterarmstütz", fr: "Planche (gainage)", it: "Plank" },
  "Flexiones": { en: "Push-ups", de: "Liegestütze", fr: "Pompes", it: "Flessioni" },
  "Burpees": { en: "Burpees", de: "Burpees", fr: "Burpees", it: "Burpees" },
  "Jumping Jacks": { en: "Jumping Jacks", de: "Hampelmann", fr: "Jumping Jacks", it: "Jumping Jacks" },
  "Zancadas": { en: "Lunges", de: "Ausfallschritte", fr: "Fentes", it: "Affondi" }
};

const unitsDb = {
  "1 taza": { en: "1 cup", de: "1 Tasse", fr: "1 tasse", it: "1 tazza" },
  "100 g": { en: "100 g", de: "100 g", fr: "100 g", it: "100 g" },
  "100 g (2 rebanadas)": { en: "100 g (2 slices)", de: "100 g (2 Scheiben)", fr: "100 g (2 tranches)", it: "100 g (2 fette)" },
  "1 rebanada (30g)": { en: "1 slice (30g)", de: "1 Scheibe (30g)", fr: "1 tranche (30g)", it: "1 fetta (30g)" },
  "1 unidad": { en: "1 unit", de: "1 Stück", fr: "1 unité", it: "1 unità" },
  "125 g": { en: "125 g", de: "125 g", fr: "125 g", it: "125 g" },
  "1 mediano": { en: "1 medium", de: "1 mittel", fr: "1 moyen", it: "1 medio" },
  "1 mediana": { en: "1 medium", de: "1 mittel", fr: "1 moyenne", it: "1 media" },
  "1 plato": { en: "1 plate", de: "1 Teller", fr: "1 assiette", it: "1 piatto" },
  "1 cucharada (10g)": { en: "1 tbsp (10g)", de: "1 EL (10g)", fr: "1 c.à.s (10g)", it: "1 cucchiaio (10g)" },
  "20 g": { en: "20 g", de: "20 g", fr: "20 g", it: "20 g" },
  "10 g": { en: "10 g", de: "10 g", fr: "10 g", it: "10 g" },
  "1 lata (escurrido)": { en: "1 can (drained)", de: "1 Dose (abgetropft)", fr: "1 boîte (égouttée)", it: "1 scatola (sgocciolato)" },
  "1 cucharadita (5g)": { en: "1 tsp (5g)", de: "1 TL (5g)", fr: "1 c.à.c (5g)", it: "1 cucchiaino (5g)" },
  "1 cucharada (21g)": { en: "1 tbsp (21g)", de: "1 EL (21g)", fr: "1 c.à.s (21g)", it: "1 cucchiaio (21g)" }
};

for (const lang of locales) {
  const file = path.join(__dirname, `src/i18n/locales/${lang}.json`);
  let json = JSON.parse(fs.readFileSync(file, 'utf8'));
  
  json.foodDb = {};
  for (const [esKey, translations] of Object.entries(foodsDb)) {
    json.foodDb[esKey] = lang === 'es' ? esKey : translations[lang] || esKey;
  }
  
  json.exerciseDb = {};
  for (const [esKey, translations] of Object.entries(exercisesDb)) {
    json.exerciseDb[esKey] = lang === 'es' ? esKey : translations[lang] || esKey;
  }

  json.unitsDb = {};
  for (const [esKey, translations] of Object.entries(unitsDb)) {
    json.unitsDb[esKey] = lang === 'es' ? esKey : translations[lang] || esKey;
  }
  
  fs.writeFileSync(file, JSON.stringify(json, null, 2));
}

console.log("Appended structured DB translations!");
