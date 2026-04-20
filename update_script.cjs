const fs = require('fs');

const RAW_FOOD_DATA = [
  // --- PROTEÍNAS (20) ---
  { k: 'food.chicken', es: 'Pechuga de Pollo', de: 'Hähnchenbrust', en: 'Chicken Breast', kcal: 110, p: 23, c: 0, f: 1.2, fib: 0, ig: 0, na: 'Bajo' },
  { k: 'food.turkey', es: 'Pechuga de Pavo', de: 'Putenbrust', en: 'Turkey Breast', kcal: 105, p: 24, c: 0, f: 1.0, fib: 0, ig: 0, na: 'Bajo' },
  { k: 'food.egg', es: 'Huevo entero', de: 'Ganzes Ei', en: 'Whole Egg', kcal: 143, p: 12.5, c: 0.7, f: 9.5, fib: 0, ig: 0, na: 'Medio' },
  { k: 'food.salmon', es: 'Salmón', de: 'Lachs', en: 'Salmon', kcal: 208, p: 20, c: 0, f: 13, fib: 0, ig: 0, na: 'Bajo' },
  { k: 'food.hake', es: 'Merluza', de: 'Seehecht', en: 'Hake', kcal: 89, p: 18, c: 0, f: 2, fib: 0, ig: 0, na: 'Bajo' },
  { k: 'food.canned_tuna', es: 'Atún natural (lata)', de: 'Thunfisch (Dose)', en: 'Canned Tuna', kcal: 116, p: 26, c: 0, f: 1, fib: 0, ig: 0, na: 'Alto' },
  { k: 'food.tofu', es: 'Tofu firme', de: 'Tofu', en: 'Firm Tofu', kcal: 76, p: 8, c: 1.9, f: 4.8, fib: 1.5, ig: 15, na: 'Bajo' },
  { k: 'food.pork_loin', es: 'Lomo Embuchado', de: 'Schweinelende', en: 'Cured Pork Loin', kcal: 200, p: 32, c: 0, f: 8, fib: 0, ig: 0, na: 'Alto' },
  { k: 'food.prawns', es: 'Gambas', de: 'Garnelen', en: 'Prawns', kcal: 99, p: 24, c: 0, f: 0.3, fib: 0, ig: 0, na: 'Medio' },
  { k: 'food.beef_lean', es: 'Ternera magra', de: 'Rinderfilet', en: 'Lean Beef', kcal: 130, p: 21, c: 0, f: 5, fib: 0, ig: 0, na: 'Bajo' },
  { k: 'food.cod', es: 'Bacalao', de: 'Kabeljau', en: 'Cod', kcal: 82, p: 18, c: 0, f: 0.7, fib: 0, ig: 0, na: 'Bajo' },
  { k: 'food.sardines', es: 'Sardinas', de: 'Sardinen', en: 'Sardines', kcal: 208, p: 24, c: 0, f: 11, fib: 0, ig: 0, na: 'Medio' },
  { k: 'food.rabbit', es: 'Conejo', de: 'Kaninchenfleisch', en: 'Rabbit', kcal: 136, p: 20, c: 0, f: 5.5, fib: 0, ig: 0, na: 'Bajo' },
  { k: 'food.tempeh', es: 'Tempeh', de: 'Tempeh', en: 'Tempeh', kcal: 193, p: 19, c: 9, f: 11, fib: 6, ig: 15, na: 'Bajo' },
  { k: 'food.seitan', es: 'Seitán', de: 'Seitan', en: 'Seitan', kcal: 370, p: 75, c: 14, f: 1.9, fib: 0.6, ig: 15, na: 'Alto' },
  { k: 'food.cottage_cheese', es: 'Queso Cottage', de: 'Hüttenkäse', en: 'Cottage Cheese', kcal: 98, p: 11, c: 3.4, f: 4.3, fib: 0, ig: 10, na: 'Medio' },
  { k: 'food.skyr', es: 'Skyr', de: 'Skyr', en: 'Skyr', kcal: 65, p: 11, c: 4, f: 0.2, fib: 0, ig: 15, na: 'Bajo' },
  { k: 'food.egg_white', es: 'Claras de huevo', de: 'Eiweiß', en: 'Egg Whites', kcal: 52, p: 11, c: 0.7, f: 0.2, fib: 0, ig: 0, na: 'Medio' },
  { k: 'food.whey_protein', es: 'Whey Protein', de: 'Molkenprotein', en: 'Whey Protein', kcal: 375, p: 80, c: 5, f: 3, fib: 0, ig: 15, na: 'Bajo' },
  { k: 'food.octopus', es: 'Pulpo', de: 'Oktopus', en: 'Octopus', kcal: 82, p: 15, c: 2.2, f: 1, fib: 0, ig: 0, na: 'Medio' },

  // --- CARBOHIDRATOS (20) ---
  { k: 'food.oats', es: 'Avena', de: 'Haferflocken', en: 'Oats', kcal: 368, p: 13, c: 64, f: 7, fib: 10, ig: 40, na: 'Bajo' },
  { k: 'food.lentils', es: 'Lentejas (cocidas)', de: 'Linsen (gekocht)', en: 'Lentils (cooked)', kcal: 116, p: 9, c: 20, f: 0.4, fib: 8, ig: 25, na: 'Bajo' },
  { k: 'food.chickpeas', es: 'Garbanzos (cocidos)', de: 'Kichererbsen', en: 'Chickpeas', kcal: 164, p: 9, c: 27, f: 2.6, fib: 7, ig: 30, na: 'Bajo' },
  { k: 'food.quinoa', es: 'Quinoa (cocida)', de: 'Quinoa', en: 'Quinoa', kcal: 120, p: 4.4, c: 21, f: 1.9, fib: 2.8, ig: 35, na: 'Bajo' },
  { k: 'food.potato', es: 'Patata hervida', de: 'Kartoffel (gekocht)', en: 'Boiled Potato', kcal: 77, p: 2, c: 17, f: 0.1, fib: 2.2, ig: 70, na: 'Bajo' },
  { k: 'food.sweet_potato', es: 'Boniato hervido', de: 'Süßkartoffel', en: 'Sweet Potato', kcal: 86, p: 1.6, c: 20, f: 0.1, fib: 3, ig: 50, na: 'Bajo' },
  { k: 'food.brown_rice', es: 'Arroz Integral (cocido)', de: 'Vollkornreis', en: 'Brown Rice', kcal: 111, p: 2.6, c: 23, f: 0.9, fib: 1.8, ig: 50, na: 'Bajo' },
  { k: 'food.rye_bread', es: 'Pan de Centeno', de: 'Roggenbrot', en: 'Rye Bread', kcal: 250, p: 9, c: 46, f: 3.3, fib: 6, ig: 45, na: 'Medio' },
  { k: 'food.whole_pasta', es: 'Pasta Integral (cocida)', de: 'Vollkornnudeln', en: 'Whole Wheat Pasta', kcal: 124, p: 5, c: 25, f: 1, fib: 3, ig: 45, na: 'Bajo' },
  { k: 'food.black_beans', es: 'Judías Negras', de: 'Schwarze Bohnen', en: 'Black Beans', kcal: 132, p: 9, c: 23, f: 0.5, fib: 9, ig: 30, na: 'Bajo' },
  { k: 'food.couscous', es: 'Cuscús integral', de: 'Vollkorn-Couscous', en: 'Whole Couscous', kcal: 112, p: 3.8, c: 23, f: 0.2, fib: 1.4, ig: 45, na: 'Bajo' },
  { k: 'food.buckwheat', es: 'Trigo sarraceno', de: 'Buchweizen', en: 'Buckwheat', kcal: 343, p: 13, c: 71, f: 3.4, fib: 10, ig: 50, na: 'Bajo' },
  { k: 'food.millet', es: 'Mijo', de: 'Hirse', en: 'Millet', kcal: 378, p: 11, c: 72, f: 4.2, fib: 8.5, ig: 55, na: 'Bajo' },
  { k: 'food.peas', es: 'Guisantes', de: 'Erbsen', en: 'Peas', kcal: 81, p: 5, c: 14, f: 0.4, fib: 5, ig: 35, na: 'Bajo' },
  { k: 'food.broad_beans', es: 'Habas', de: 'Ackerbohnen', en: 'Broad Beans', kcal: 88, p: 8, c: 10, f: 0.6, fib: 5, ig: 40, na: 'Bajo' },
  { k: 'food.corn_cakes', es: 'Tortitas de maíz', de: 'Maiswaffeln', en: 'Corn Cakes', kcal: 387, p: 8, c: 80, f: 3, fib: 4, ig: 85, na: 'Medio' },
  { k: 'food.cassava', es: 'Yuca', de: 'Maniok', en: 'Cassava', kcal: 160, p: 1.4, c: 38, f: 0.3, fib: 1.8, ig: 55, na: 'Bajo' },
  { k: 'food.bulgur', es: 'Bulgur', de: 'Bulgur', en: 'Bulgur', kcal: 342, p: 12, c: 76, f: 1.3, fib: 18, ig: 48, na: 'Bajo' },
  { k: 'food.corn', es: 'Maíz dulce', de: 'Zuckermais', en: 'Sweet Corn', kcal: 86, p: 3.2, c: 19, f: 1.2, fib: 2.7, ig: 55, na: 'Bajo' },
  { k: 'food.amaranth', es: 'Amaranto', de: 'Amaranth', en: 'Amaranth', kcal: 371, p: 14, c: 65, f: 7, fib: 7, ig: 35, na: 'Bajo' },

  // --- VEGETALES (30) ---
  { k: 'food.spinach', es: 'Espinacas', de: 'Spinat', en: 'Spinach', kcal: 23, p: 3, c: 3.6, f: 0.4, fib: 2.2, ig: 15, na: 'Bajo' },
  { k: 'food.broccoli', es: 'Brócoli', de: 'Brokkoli', en: 'Broccoli', kcal: 34, p: 2.8, c: 7, f: 0.4, fib: 2.6, ig: 15, na: 'Bajo' },
  { k: 'food.zucchini', es: 'Calabacín', de: 'Zucchini', en: 'Zucchini', kcal: 17, p: 1.2, c: 3.1, f: 0.3, fib: 1, ig: 15, na: 'Bajo' },
  { k: 'food.asparagus', es: 'Espárragos', de: 'Spargel', en: 'Asparagus', kcal: 20, p: 2.2, c: 3.7, f: 0.1, fib: 2.1, ig: 15, na: 'Bajo' },
  { k: 'food.tomato', es: 'Tomate', de: 'Tomate', en: 'Tomato', kcal: 18, p: 0.9, c: 3.9, f: 0.2, fib: 1.2, ig: 15, na: 'Bajo' },
  { k: 'food.red_pepper', es: 'Pimiento Rojo', de: 'Paprika rot', en: 'Red Pepper', kcal: 31, p: 1, c: 6, f: 0.3, fib: 2.1, ig: 15, na: 'Bajo' },
  { k: 'food.cucumber', es: 'Pepino', de: 'Gurke', en: 'Cucumber', kcal: 15, p: 0.6, c: 3.6, f: 0.1, fib: 0.5, ig: 15, na: 'Bajo' },
  { k: 'food.eggplant', es: 'Berenjena', de: 'Aubergine', en: 'Eggplant', kcal: 25, p: 1, c: 6, f: 0.2, fib: 3, ig: 15, na: 'Bajo' },
  { k: 'food.cauliflower', es: 'Coliflor', de: 'Blumenkohl', en: 'Cauliflower', kcal: 25, p: 2, c: 5, f: 0.3, fib: 2, ig: 15, na: 'Bajo' },
  { k: 'food.mushrooms', es: 'Champiñones', de: 'Pilze', en: 'Mushrooms', kcal: 22, p: 3.1, c: 3.3, f: 0.3, fib: 1, ig: 15, na: 'Bajo' },
  { k: 'food.artichoke', es: 'Alcachofa', de: 'Artischocke', en: 'Artichoke', kcal: 47, p: 3.3, c: 11, f: 0.2, fib: 5, ig: 20, na: 'Medio' },
  { k: 'food.onion', es: 'Cebolla', de: 'Zwiebel', en: 'Onion', kcal: 40, p: 1.1, c: 9, f: 0.1, fib: 1.7, ig: 15, na: 'Bajo' },
  { k: 'food.carrot', es: 'Zanahoria', de: 'Karotte', en: 'Carrot', kcal: 41, p: 0.9, c: 10, f: 0.2, fib: 2.8, ig: 35, na: 'Bajo' },
  { k: 'food.celery', es: 'Apio', de: 'Sellerie', en: 'Celery', kcal: 16, p: 0.7, c: 3, f: 0.2, fib: 1.6, ig: 15, na: 'Alto' },
  { k: 'food.radish', es: 'Rábano', de: 'Radieschen', en: 'Radish', kcal: 16, p: 0.7, c: 3.4, f: 0.1, fib: 1.6, ig: 15, na: 'Bajo' },
  { k: 'food.lambs_lettuce', es: 'Canónigos', de: 'Feldsalat', en: 'Lambs Lettuce', kcal: 21, p: 2, c: 2, f: 0.4, fib: 1.5, ig: 15, na: 'Bajo' },
  { k: 'food.arugula', es: 'Rúcula', de: 'Rucola', en: 'Arugula', kcal: 25, p: 2.6, c: 3.7, f: 0.7, fib: 1.6, ig: 15, na: 'Bajo' },
  { k: 'food.green_beans', es: 'Judía verde', de: 'Grüne Bohnen', en: 'Green Beans', kcal: 31, p: 1.8, c: 7, f: 0.2, fib: 2.7, ig: 15, na: 'Bajo' },
  { k: 'food.red_cabbage', es: 'Lombarda', de: 'Rotkohl', en: 'Red Cabbage', kcal: 31, p: 1.4, c: 7, f: 0.2, fib: 2.1, ig: 15, na: 'Bajo' },
  { k: 'food.leek', es: 'Puerro', de: 'Lauch', en: 'Leek', kcal: 61, p: 1.5, c: 14, f: 0.3, fib: 1.8, ig: 15, na: 'Bajo' },
  { k: 'food.chard', es: 'Acelgas', de: 'Mangold', en: 'Swiss Chard', kcal: 19, p: 1.8, c: 3.7, f: 0.2, fib: 1.6, ig: 15, na: 'Alto' },
  { k: 'food.escarole', es: 'Escarola', de: 'Endivien', en: 'Escarole', kcal: 17, p: 1.2, c: 3.4, f: 0.2, fib: 3.1, ig: 15, na: 'Bajo' },
  { k: 'food.endive', es: 'Endivia', de: 'Chicorée', en: 'Endive', kcal: 17, p: 0.9, c: 4, f: 0.1, fib: 3.1, ig: 15, na: 'Bajo' },
  { k: 'food.brussels_sprouts', es: 'Col de Bruselas', de: 'Rosenkohl', en: 'Brussels Sprouts', kcal: 43, p: 3.4, c: 9, f: 0.3, fib: 3.8, ig: 15, na: 'Bajo' },
  { k: 'food.fennel', es: 'Hinojo', de: 'Fenchel', en: 'Fennel', kcal: 31, p: 1.2, c: 7, f: 0.2, fib: 3.1, ig: 15, na: 'Medio' },
  { k: 'food.pumpkin', es: 'Calabaza', de: 'Kürbis', en: 'Pumpkin', kcal: 26, p: 1, c: 6.5, f: 0.1, fib: 0.5, ig: 75, na: 'Bajo' },
  { k: 'food.garlic', es: 'Ajo', de: 'Knoblauch', en: 'Garlic', kcal: 149, p: 6.4, c: 33, f: 0.5, fib: 2.1, ig: 30, na: 'Bajo' },
  { k: 'food.chili', es: 'Chile', de: 'Chili', en: 'Chili', kcal: 40, p: 1.9, c: 9, f: 0.4, fib: 1.5, ig: 15, na: 'Bajo' },
  { k: 'food.okra', es: 'Okra', de: 'Okra', en: 'Okra', kcal: 33, p: 1.9, c: 7, f: 0.2, fib: 3.2, ig: 20, na: 'Bajo' },
  { k: 'food.soy_sprouts', es: 'Brotes de soja', de: 'Sojasprossen', en: 'Soy Sprouts', kcal: 30, p: 3, c: 6, f: 0.2, fib: 1.8, ig: 15, na: 'Bajo' },

  // --- GRASAS (15) ---
  { k: 'food.olive_oil', es: 'Aceite de Oliva (AOVE)', de: 'Olivenöl', en: 'Olive Oil', kcal: 884, p: 0, c: 0, f: 100, fib: 0, ig: 0, na: 'Bajo' },
  { k: 'food.avocado', es: 'Aguacate', de: 'Avocado', en: 'Avocado', kcal: 160, p: 2, c: 9, f: 15, fib: 7, ig: 10, na: 'Bajo' },
  { k: 'food.walnuts', es: 'Nueces', de: 'Walnüsse', en: 'Walnuts', kcal: 654, p: 15, c: 14, f: 65, fib: 7, ig: 15, na: 'Bajo' },
  { k: 'food.almonds', es: 'Almendras', de: 'Mandeln', en: 'Almonds', kcal: 579, p: 21, c: 22, f: 50, fib: 12, ig: 15, na: 'Bajo' },
  { k: 'food.chia_seeds', es: 'Semillas de Chía', de: 'Chiasamen', en: 'Chia Seeds', kcal: 486, p: 17, c: 42, f: 31, fib: 34, ig: 15, na: 'Bajo' },
  { k: 'food.peanut_butter', es: 'Crema Cacahuete 100%', de: 'Erdnussmus', en: 'Peanut Butter', kcal: 588, p: 25, c: 20, f: 50, fib: 6, ig: 15, na: 'Bajo' },
  { k: 'food.pistachios', es: 'Pistachos', de: 'Pistazien', en: 'Pistachios', kcal: 562, p: 20, c: 28, f: 45, fib: 10, ig: 15, na: 'Bajo' },
  { k: 'food.flaxseed', es: 'Semillas de Lino', de: 'Leinsamen', en: 'Flaxseed', kcal: 534, p: 18, c: 29, f: 42, fib: 27, ig: 15, na: 'Bajo' },
  { k: 'food.pumpkin_seeds', es: 'Semillas de Calabaza', de: 'Kürbiskerne', en: 'Pumpkin Seeds', kcal: 559, p: 30, c: 10, f: 49, fib: 6, ig: 15, na: 'Bajo' },
  { k: 'food.olives', es: 'Aceitunas', de: 'Oliven', en: 'Olives', kcal: 115, p: 0.8, c: 6, f: 10, fib: 3.2, ig: 15, na: 'Alto' },
  { k: 'food.cashews', es: 'Anacardos', de: 'Cashewnüsse', en: 'Cashews', kcal: 553, p: 18, c: 30, f: 44, fib: 3.3, ig: 20, na: 'Bajo' },
  { k: 'food.hazelnuts', es: 'Avellanas', de: 'Haselnüsse', en: 'Hazelnuts', kcal: 628, p: 15, c: 17, f: 61, fib: 10, ig: 15, na: 'Bajo' },
  { k: 'food.coconut_oil', es: 'Aceite de Coco', de: 'Kokosöl', en: 'Coconut Oil', kcal: 862, p: 0, c: 0, f: 100, fib: 0, ig: 0, na: 'Bajo' },
  { k: 'food.ghee', es: 'Ghee (Mantequilla Clarificada)', de: 'Ghee', en: 'Ghee', kcal: 899, p: 0, c: 0, f: 100, fib: 0, ig: 0, na: 'Bajo' },
  { k: 'food.macadamia', es: 'Macadamias', de: 'Macadamianüsse', en: 'Macadamia', kcal: 718, p: 8, c: 14, f: 76, fib: 8.6, ig: 15, na: 'Bajo' },

  // --- FRUTAS Y LÁCTEOS (15) ---
  { k: 'food.blueberries', es: 'Arándanos', de: 'Blaubeeren', en: 'Blueberries', kcal: 57, p: 0.7, c: 14, f: 0.3, fib: 2.4, ig: 25, na: 'Bajo' },
  { k: 'food.apple', es: 'Manzana', de: 'Apfel', en: 'Apple', kcal: 52, p: 0.3, c: 14, f: 0.2, fib: 2.4, ig: 35, na: 'Bajo' },
  { k: 'food.banana', es: 'Plátano', de: 'Banane', en: 'Banana', kcal: 89, p: 1.1, c: 23, f: 0.3, fib: 2.6, ig: 50, na: 'Bajo' },
  { k: 'food.strawberries', es: 'Fresas', de: 'Erdbeeren', en: 'Strawberries', kcal: 32, p: 0.7, c: 8, f: 0.3, fib: 2, ig: 25, na: 'Bajo' },
  { k: 'food.lemon', es: 'Limón', de: 'Zitrone', en: 'Lemon', kcal: 29, p: 1.1, c: 9, f: 0.3, fib: 2.8, ig: 20, na: 'Bajo' },
  { k: 'food.greek_yogurt', es: 'Yogur Griego 0%', de: 'Griechischer Joghurt 0%', en: 'Greek Yogurt 0%', kcal: 59, p: 10, c: 3.6, f: 0.4, fib: 0, ig: 15, na: 'Bajo' },
  { k: 'food.quark', es: 'Queso fresco batido', de: 'Magerquark', en: 'Quark', kcal: 68, p: 12, c: 4, f: 0.2, fib: 0, ig: 15, na: 'Bajo' },
  { k: 'food.kefir', es: 'Kéfir', de: 'Kefir', en: 'Kefir', kcal: 37, p: 3.3, c: 4, f: 1, fib: 0, ig: 15, na: 'Bajo' },
  { k: 'food.kiwi', es: 'Kiwi', de: 'Kiwi', en: 'Kiwi', kcal: 61, p: 1.1, c: 15, f: 0.5, fib: 3, ig: 50, na: 'Bajo' },
  { k: 'food.orange', es: 'Naranja', de: 'Orange', en: 'Orange', kcal: 47, p: 0.9, c: 12, f: 0.1, fib: 2.4, ig: 40, na: 'Bajo' },
  { k: 'food.pineapple', es: 'Piña', de: 'Ananas', en: 'Pineapple', kcal: 50, p: 0.5, c: 13, f: 0.1, fib: 1.4, ig: 59, na: 'Bajo' },
  { k: 'food.papaya', es: 'Papaya', de: 'Papaya', en: 'Papaya', kcal: 43, p: 0.5, c: 11, f: 0.3, fib: 1.7, ig: 58, na: 'Bajo' },
  { k: 'food.watermelon', es: 'Sandía', de: 'Wassermelone', en: 'Watermelon', kcal: 30, p: 0.6, c: 8, f: 0.2, fib: 0.4, ig: 72, na: 'Bajo' },
  { k: 'food.raspberries', es: 'Frambuesas', de: 'Himbeeren', en: 'Raspberries', kcal: 52, p: 1.2, c: 12, f: 0.7, fib: 6.5, ig: 25, na: 'Bajo' },
  { k: 'food.blackberry', es: 'Moras', de: 'Brombeeren', en: 'Blackberries', kcal: 43, p: 1.4, c: 10, f: 0.5, fib: 5.3, ig: 25, na: 'Bajo' }
];

const langs = ['es', 'de', 'en', 'fr', 'it'];

for (const lang of langs) {
  const jsonPath = `src/i18n/locales/${lang}.json`;
  if (fs.existsSync(jsonPath)) {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    data.foodDb = data.foodDb || {};
    for (const item of RAW_FOOD_DATA) {
      const dbKey = item.k.replace('food.', '');
      data.foodDb[dbKey] = item[lang] || item['en']; // fallback to en if missing
    }
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  }
}

const codeArr = [];
for (const item of RAW_FOOD_DATA) {
  const str = `  {
    translationKey: "${item.k.replace('food.', '')}",
    calories: ${item.kcal},
    protein: ${item.p},
    carbs: ${item.c},
    fat: ${item.f},
    fiber: ${item.fib},
    ig: ${item.ig > 0 ? item.ig : 'null'},
    sodiumLevel: "${item.na}"
  }`;
  codeArr.push(str);
}
const generatedArray = "export const COMMON_FOODS: CommonFood[] = [" + codeArr.join(",") + "\n];";
fs.writeFileSync('generated_data.ts', generatedArray);
