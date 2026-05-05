const fs = require('fs');
const path = require('path');

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
}

function parseFile(filename, langOrder) {
  const content = fs.readFileSync(filename, 'utf-8');
  const lines = content.split('\n').map(l => l.trim());
  
  const blocks = {};
  let currentLang = null;
  
  for (const line of lines) {
    if (!line) continue;
    if (line.includes('ES - ')) { currentLang = 'es'; blocks[currentLang] = []; continue; }
    if (line.includes('EN - ')) { currentLang = 'en'; blocks[currentLang] = []; continue; }
    if (line.includes('DE - ')) { currentLang = 'de'; blocks[currentLang] = []; continue; }
    if (line.includes('FR - ')) { currentLang = 'fr'; blocks[currentLang] = []; continue; }
    if (line.includes('IT - ')) { currentLang = 'it'; blocks[currentLang] = []; continue; }
    
    if (currentLang && line.includes('|')) {
      blocks[currentLang].push(line);
    }
  }
  
  // Make sure they all have the same length
  const lengths = Object.values(blocks).map(b => b.length);
  if (new Set(lengths).size !== 1) {
    console.error('Mismatch in blocks for', filename, lengths);
  }
  
  const numItems = blocks['es'].length;
  const items = [];
  
  for (let i = 0; i < numItems; i++) {
    const enLine = blocks['en'][i];
    const enParts = enLine.split('|').map(p => p.trim());
    const enName = enParts[0];
    
    // For base info we use the ES line (as fallback)
    const esLine = blocks['es'][i];
    const esParts = esLine.split('|').map(p => p.trim());
    const esName = esParts[0];
    const calories = parseFloat(esParts[1]);
    const protein = parseFloat(esParts[2]);
    const carbs = parseFloat(esParts[3]);
    const fat = parseFloat(esParts[4]);
    const suitableForRaw = esParts[5] || '';
    
    let id = slugify(enName);
    
    // Fallback if id exists
    let counter = 1;
    let baseId = id;
    while (items.find(it => it.id === id)) {
      id = `${baseId}_${counter}`;
      counter++;
    }
    
    const suitableFor = suitableForRaw.split(',').map(s => s.trim()).filter(Boolean);
    
    const item = {
      id,
      name: esName, // Fallback name
      calories,
      protein,
      carbs,
      fat,
      translationKey: id,
      suitableFor,
      translations: {
        es: esName,
        en: enName,
        de: blocks['de'][i].split('|')[0].trim(),
        fr: blocks['fr'][i].split('|')[0].trim(),
        it: blocks['it'][i].split('|')[0].trim()
      }
    };
    items.push(item);
  }
  
  return items;
}

function updateFoodData(items) {
  const tsPath = path.join(__dirname, 'src', 'lib', 'foodData.ts');
  const code = `export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  translationKey?: string;
  suitableFor?: ('Desayuno' | 'Media Mañana' | 'Almuerzo' | 'Merienda' | 'Cena')[];
}

export const FOOD_DB: FoodItem[] = [
${items.map(it => `  {
    id: "${it.id}",
    name: "${it.name}",
    calories: ${it.calories},
    protein: ${it.protein},
    carbs: ${it.carbs},
    fat: ${it.fat},
    translationKey: "${it.translationKey}",
    suitableFor: [${it.suitableFor.map(s => `"${s}"`).join(', ')}]
  }`).join(',\n')}
];
`;
  fs.writeFileSync(tsPath, code);
}

function updateLocales(items) {
  const locales = ['es', 'en', 'de', 'fr', 'it'];
  for (const lang of locales) {
    const jsonPath = path.join(__dirname, 'src', 'i18n', 'locales', `${lang}.json`);
    const content = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    
    if (!content.foodDb) {
      content.foodDb = {};
    }
    
    for (const item of items) {
      content.foodDb[item.translationKey] = item.translations[lang];
    }
    
    fs.writeFileSync(jsonPath, JSON.stringify(content, null, 2));
  }
}

function main() {
  const foods = parseFile('Alimentos_Completos.txt');
  const drinks = parseFile('Bebidas_Completas.txt');
  
  const allItems = [...foods, ...drinks];
  
  updateFoodData(allItems);
  updateLocales(allItems);
  
  console.log('Successfully updated DB with', allItems.length, 'items');
}

main();
