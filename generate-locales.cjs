const fs = require('fs');
const path = require('path');

const locales = ['es', 'en', 'de', 'fr', 'it'];

// Define all translations grouped by key
const translations = {
  common: {
    save: { es: "Guardar", en: "Save", de: "Speichern", fr: "Enregistrer", it: "Salva" },
    delete: { es: "Borrar", en: "Delete", de: "Löschen", fr: "Supprimer", it: "Elimina" },
    add: { es: "Añadir", en: "Add", de: "Hinzufügen", fr: "Ajouter", it: "Aggiungi" },
    newInfo: { es: "Nuevo", en: "New", de: "Neu", fr: "Nouveau", it: "Nuovo" },
    search: { es: "Buscar...", en: "Search...", de: "Suchen...", fr: "Recherche...", it: "Cerca..." },
    kcal: { es: "kcal", en: "kcal", de: "kcal", fr: "kcal", it: "kcal" },
    minutes: { es: "min", en: "min", de: "min", fr: "min", it: "min" },
    serving: { es: "ración", en: "serving", de: "Portion", fr: "portion", it: "porzione" }
  },
  tabs: {
    dashboard: { es: "Inicio", en: "Home", de: "Start", fr: "Accueil", it: "Inizio" },
    journey: { es: "Mi Plan", en: "My Plan", de: "Mein Plan", fr: "Mon Plan", it: "Il Mio Piano" },
    diet: { es: "Dieta", en: "Diet", de: "Diät", fr: "Régime", it: "Dieta" },
    diary: { es: "Diario", en: "Diary", de: "Tagebuch", fr: "Journal", it: "Diario" },
    workout: { es: "Entreno", en: "Workout", de: "Training", fr: "Exercice", it: "Allenamento" },
    recipes: { es: "Recetas", en: "Recipes", de: "Rezepte", fr: "Recettes", it: "Ricette" },
    profile: { es: "Perfil", en: "Profile", de: "Profil", fr: "Profil", it: "Profilo" }
  },
  onboarding: {
    title: { 
      es: "Bienvenido a DRS", 
      en: "Welcome to DRS", 
      de: "Willkommen bei DRS", 
      fr: "Bienvenue sur DRS", 
      it: "Benvenuto in DRS" 
    },
    subtitle: { 
      es: "Crea tu primer perfil para comenzar tu desafío de planificación saludable.", 
      en: "Create your first profile to start your healthy planning challenge.", 
      de: "Erstelle dein erstes Profil, um deine gesunde Planung zu starten.", 
      fr: "Créez votre premier profil pour commencer votre défi de planification saine.", 
      it: "Crea il tuo primo profilo per iniziare la tua sfida pianificata." 
    },
    createPrompt: { 
      es: "¿Cuál es tu nombre?", 
      en: "What is your name?", 
      de: "Wie heißt du?", 
      fr: "Quel est votre nom ?", 
      it: "Qual è il tuo nome?" 
    },
    createBtn: { 
      es: "Crear mi Perfil", 
      en: "Create my Profile", 
      de: "Mein Profil erstellen", 
      fr: "Créer mon Profil", 
      it: "Crea il mio Profilo" 
    }
  },
  profile: {
    title: { es: "Perfil & Progreso", en: "Profile & Progress", de: "Profil & Fortschritt", fr: "Profil & Progrès", it: "Profilo & Progresso" },
    subtitle: { es: "Tus datos se guardan en este dispositivo.", en: "Your data is saved on this device.", de: "Ihre Daten werden auf diesem Gerät gespeichert.", fr: "Vos données sont sauvegardées sur cet appareil.", it: "I tuoi dati sono salvati su questo dispositivo." },
    management: { es: "Gestión de Perfiles", en: "Profile Management", de: "Profilverwaltung", fr: "Gestion des Profils", it: "Gestione Profili" },
    preferences: { es: "Preferencias de la App", en: "App Preferences", de: "App-Einstellungen", fr: "Préférences de l'App", it: "Preferenze App" },
    language: { es: "Idioma", en: "Language", de: "Sprache", fr: "Langue", it: "Lingua" },
    deleteConfirm: { es: "¿Seguro que quieres borrar el perfil actual y todos sus datos? Esta acción es irreversible.", en: "Are you sure you want to delete the current profile and all its data? This action is irreversible.", de: "Möchten Sie das aktuelle Profil und alle zugehörigen Daten wirklich löschen? Diese Aktion ist irreversibel.", fr: "Êtes-vous sûr de vouloir supprimer le profil actuel et toutes ses données ? Cette action est irréversible.", it: "Sei sicuro di voler eliminare il profilo corrente e tutti i suoi dati? Questa azione è irreversibile." },
    personalData: { es: "Datos personales", en: "Personal Data", de: "Persönliche Daten", fr: "Données Personnelles", it: "Dati Personali" },
    name: { es: "Nombre", en: "Name", de: "Name", fr: "Nom", it: "Nome" },
    age: { es: "Edad", en: "Age", de: "Alter", fr: "Âge", it: "Età" },
    gender: { es: "Género", en: "Gender", de: "Geschlecht", fr: "Genre", it: "Sesso" },
    genderMale: { es: "Hombre", en: "Male", de: "Männlich", fr: "Homme", it: "Uomo" },
    genderFemale: { es: "Mujer", en: "Female", de: "Weiblich", fr: "Femme", it: "Donna" },
    height: { es: "Altura (cm)", en: "Height (cm)", de: "Größe (cm)", fr: "Taille (cm)", it: "Altezza (cm)" },
    weight: { es: "Peso (kg)", en: "Weight (kg)", de: "Gewicht (kg)", fr: "Poids (kg)", it: "Peso (kg)" },
    targetWeight: { es: "Peso objetivo (kg)", en: "Target Weight (kg)", de: "Zielgewicht (kg)", fr: "Poids cible (kg)", it: "Peso Obiettivo (kg)" },
    activityLevel: { es: "Nivel de actividad", en: "Activity Level", de: "Aktivitätsniveau", fr: "Niveau d'activité", it: "Livello di attività" },
    goal: { es: "Objetivo", en: "Goal", de: "Ziel", fr: "Objectif", it: "Obiettivo" },
    goalLose: { es: "Perder", en: "Lose", de: "Abnehmen", fr: "Perdre", it: "Perdere" },
    goalMaintain: { es: "Mantener", en: "Maintain", de: "Halten", fr: "Maintenir", it: "Mantenere" },
    goalGain: { es: "Ganar", en: "Gain", de: "Zunehmen", fr: "Gagner", it: "Guadagnare" },
    saveProfile: { es: "Guardar perfil", en: "Save profile", de: "Profil speichern", fr: "Enregistrer profil", it: "Salva profilo" },
    calcTitle: { es: "Cálculo Mifflin-St Jeor", en: "Mifflin-St Jeor Calculation", de: "Mifflin-St Jeor Berechnung", fr: "Calcul de Mifflin-St Jeor", it: "Calcolo Mifflin-St Jeor" },
    targetFormula: { es: "Objetivo = TDEE {{modifier}} kcal.", en: "Goal = TDEE {{modifier}} kcal.", de: "Ziel = TDEE {{modifier}} kcal.", fr: "Objectif = TDEE {{modifier}} kcal.", it: "Obiettivo = TDEE {{modifier}} kcal." },
    weightEvolution: { es: "Evolución de peso", en: "Weight Evolution", de: "Gewichtsentwicklung", fr: "Évolution du poids", it: "Evoluzione del peso" },
    weightTodayPlaceholder: { es: "Peso de hoy (kg)", en: "Weight today (kg)", de: "Gewicht heute (kg)", fr: "Poids d'aujourd'hui (kg)", it: "Peso di oggi (kg)" },
    noWeightData: { es: "Añade tu primer registro para ver el gráfico.", en: "Add your first entry to see the chart.", de: "Fügen Sie Ihren ersten Eintrag hinzu, um das Diagramm zu sehen.", fr: "Ajoutez votre première entrée pour voir le graphique.", it: "Aggiungi la tua prima voce per vedere il grafico." },
    lastRecords: { es: "Últimos registros", en: "Last records", de: "Letzte Einträge", fr: "Derniers enregistrements", it: "Ultimi record" },
    unnamed: { es: "Sin nombre", en: "Unnamed", de: "Ohne Namen", fr: "Sans nom", it: "Senza nome" }
  },
  dashboard: {
    greeting_morning: { es: "Buenos días", en: "Good morning", de: "Guten Morgen", fr: "Bonjour", it: "Buongiorno" },
    greeting_afternoon: { es: "Buenas tardes", en: "Good afternoon", de: "Guten Tag", fr: "Bon après-midi", it: "Buon pomeriggio" },
    greeting_evening: { es: "Buenas noches", en: "Good evening", de: "Guten Abend", fr: "Bonsoir", it: "Buonasera" },
    welcome: { es: "Bienvenido", en: "Welcome", de: "Willkommen", fr: "Bienvenue", it: "Benvenuto" },
    advisorTitle: { es: "Advisor Engine", en: "Advisor Engine", de: "Advisor Engine", fr: "Advisor Engine", it: "Advisor Engine" },
    overTarget: { es: "Has superado tu objetivo diario", en: "You exceeded your daily goal", de: "Sie haben Ihr Tagesziel überschritten", fr: "Vous avez dépassé votre objectif quotidien", it: "Hai superato il tuo obiettivo giornaliero" },
    overKcal: { es: "{{amount}} kcal por encima del límite.", en: "{{amount}} kcal above the limit.", de: "{{amount}} kcal über dem Limit.", fr: "{{amount}} kcal au-dessus de la limite.", it: "{{amount}} kcal sopra il limite." },
    today: { es: "Hoy", en: "Today", de: "Heute", fr: "Aujourd'hui", it: "Oggi" },
    kcalExceed: { es: "{{amount}} kcal de exceso", en: "{{amount}} kcal excess", de: "{{amount}} kcal Überschuss", fr: "{{amount}} kcal en excès", it: "{{amount}} kcal in eccesso" },
    kcalRemain: { es: "{{amount}} kcal restantes", en: "{{amount}} kcal remaining", de: "{{amount}} kcal verbleibend", fr: "{{amount}} kcal restants", it: "{{amount}} kcal rimanenti" },
    currentWeight: { es: "Peso actual", en: "Current Weight", de: "Aktuelles Gewicht", fr: "Poids actuel", it: "Peso attuale" },
    workoutToday: { es: "Entreno hoy", en: "Workout today", de: "Training heute", fr: "Entraînement ajd", it: "Allenamento oggi" },
    viewSessions: { es: "Ver Sesiones de Hoy", en: "View Today's Sessions", de: "Heutige Sitzungen ansehen", fr: "Voir les sessions d'aujourd'hui", it: "Vedi le sessioni di oggi" },
    noSessions: { es: "Añade tu primera sesión hoy.", en: "Add your first session today.", de: "Fügen Sie heute Ihre erste Sitzung hinzu.", fr: "Ajoutez votre première session aujourd'hui.", it: "Aggiungi la tua prima sessione oggi." },
    mealDist: { es: "Reparto por comida", en: "Meal Distribution", de: "Mahlzeitenverteilung", fr: "Répartition des repas", it: "Distribuzione dei pasti" }
  },
  mealDiary: {
    addFood: { es: "Añadir alimento", en: "Add food", de: "Essen hinzufügen", fr: "Ajouter de la nourriture", it: "Aggiungi cibo" },
    hour: { es: "Hora", en: "Time", de: "Uhrzeit", fr: "Heure", it: "Ora" },
    meal: { es: "Comida", en: "Meal", de: "Mahlzeit", fr: "Repas", it: "Pasto" },
    food: { es: "Alimento", en: "Food", de: "Essen", fr: "Nourriture", it: "Cibo" },
    foodPlaceholder: { es: "Nombre del alimento", en: "Food name", de: "Name des Lebensmittels", fr: "Nom de l'aliment", it: "Nome del cibo" },
    calories: { es: "Calorías (kcal)", en: "Calories (kcal)", de: "Kalorien (kcal)", fr: "Calories (kcal)", it: "Calorie (kcal)" },
    commonFoods: { es: "Alimentos comunes", en: "Common foods", de: "Häufige Lebensmittel", fr: "Aliments courants", it: "Cibi comuni" },
    itemsCount: { es: "item", en: "item", de: "Element", fr: "élément", it: "elemento" }
  },
  workout: {
    title: { es: "Entrenamiento", en: "Workout", de: "Training", fr: "Entraînement", it: "Allenamento" },
    subtitle: { es: "Mancuernas hasta 10 kg + bici", en: "Dumbbells up to 10 kg + bike", de: "Kurzhanteln bis 10 kg + Fahrrad", fr: "Haltères jusqu'à 10 kg + vélo", it: "Manubri fino a 10 kg + bici" },
    burnedToday: { es: "Hoy quemado", en: "Burned today", de: "Heute verbrannt", fr: "Brûlé aujourd'hui", it: "Bruciato oggi" },
    trainedToday: { es: "Hoy entrenado", en: "Trained today", de: "Heute trainiert", fr: "Entraîné aujourd'hui", it: "Allenato oggi" },
    completedGoal: { es: "🎉 ¡Felicidades! Has completado tu objetivo diario.", en: "🎉 Congratulations! You have completed your daily goal.", de: "🎉 Herzlichen Glückwunsch! Sie haben Ihr Tagesziel erreicht.", fr: "🎉 Félicitations ! Vous avez atteint votre objectif quotidien.", it: "🎉 Congratulazioni! Hai completato il tuo obiettivo giornaliero." },
    active: { es: "Activo", en: "Active", de: "Aktiv", fr: "Actif", it: "Attivo" },
    suggested: { es: "Sugerido:", en: "Suggested:", de: "Empfohlen:", fr: "Suggéré :", it: "Suggerito:" },
    pause: { es: "Pausa", en: "Pause", de: "Pause", fr: "Pause", it: "Pausa" },
    resume: { es: "Reanudar", en: "Resume", de: "Fortsetzen", fr: "Reprendre", it: "Riprendi" },
    reset: { es: "Reset", en: "Reset", de: "Zurücksetzen", fr: "Réinitialiser", it: "Reset" },
    finish: { es: "Fin", en: "Finish", de: "Beenden", fr: "Terminer", it: "Fine" },
    exercises: { es: "Ejercicios", en: "Exercises", de: "Übungen", fr: "Exercices", it: "Esercizi" },
    sessionsToday: { es: "Sesiones de hoy", en: "Today's sessions", de: "Heutige Sitzungen", fr: "Sessions du jour", it: "Sessioni di oggi" },
    filters: {
      all: { es: "Todos", en: "All", de: "Alle", fr: "Tous", it: "Tutti" },
      basic: { es: "Básico", en: "Basic", de: "Basis", fr: "Basique", it: "Base" },
      intermediate: { es: "Intermedio", en: "Intermediate", de: "Mittel", fr: "Intermédiaire", it: "Intermedio" },
      fatburn: { es: "Quemagrasas", en: "Fat-burn", de: "Fettverbrennung", fr: "Brûle-graisse", it: "Bruciagrassi" }
    }
  },
  recipes: {
    title: { es: "Recetas Low-Cost", en: "Low-Cost Recipes", de: "Günstige Rezepte", fr: "Recettes à bas prix", it: "Ricette Low-Cost" },
    subtitle: { es: "Fáciles, rápidas y orientadas a pérdida de peso.", en: "Easy, fast and weight-loss oriented.", de: "Einfach, schnell und auf Gewichtsverlust ausgerichtet.", fr: "Faciles, rapides et orientées vers la perte de poids.", it: "Facili, veloci e orientate alla perdita di peso." },
    ingredients: { es: "Ingredientes", en: "Ingredients", de: "Zutaten", fr: "Ingrédients", it: "Ingredienti" },
    steps: { es: "Preparación", en: "Preparation", de: "Zubereitung", fr: "Préparation", it: "Preparazione" }
  },
  dietTab: {
    title: { es: "Plan Nutricional", en: "Nutritional Plan", de: "Ernährungsplan", fr: "Plan Nutritionnel", it: "Piano Nutrizionale" },
    menuOptimal: { es: "Menú óptimo", en: "Optimal Menu", de: "Optimales Menü", fr: "Menu Optimal", it: "Menù Ottimale" },
    addAll: { es: "Añadir menú completo", en: "Add full menu", de: "Gesamtes Menü hinzufügen", fr: "Ajouter le menu complet", it: "Aggiungi menù completo" },
    addToDiary: { es: "Añadir a diario", en: "Add to diary", de: "Zum Tagebuch hinzufügen", fr: "Ajouter au journal", it: "Aggiungi al diario" },
    regenerate: { es: "Generar otro menú", en: "Generate another menu", de: "Anderes Menü generieren", fr: "Générer un autre menu", it: "Genera un altro menù" }
  },
  journey: {
    title: { es: "Tu Desafío de 90 Días", en: "Your 90-Day Challenge", de: "Ihre 90-Tage-Herausforderung", fr: "Votre défi de 90 jours", it: "La tua sfida di 90 giorni" },
    startPrompt: { es: "Aún no has comenzado tu plan. Establece la fecha de inicio para empezar a contar los 90 días.", en: "You haven't started your plan yet. Set the start date to begin counting the 90 days.", de: "Sie haben Ihren Plan noch nicht gestartet. Legen Sie das Startdatum fest, um die 90 Tage zu zählen.", fr: "Vous n'avez pas encore commencé votre plan. Définissez la date de début pour commencer à compter les 90 jours.", it: "Non hai ancora iniziato il tuo piano. Imposta la data di inizio per iniziare a contare i 90 giorni." },
    startBtn: { es: "Empezar Plan Hoy", en: "Start Plan Today", de: "Plan heute starten", fr: "Commencer le plan aujourd'hui", it: "Inizia il piano oggi" },
    day: { es: "Día {{day}} de 90", en: "Day {{day}} of 90", de: "Tag {{day}} von 90", fr: "Jour {{day}} sur 90", it: "Giorno {{day}} di 90" },
    routineToday: { es: "Rutina del día", en: "Today's Routine", de: "Heutige Routine", fr: "Routine du jour", it: "Routine del giorno" },
    restDay: { es: "Día de Desanso.", en: "Rest Day.", de: "Ruhetag.", fr: "Jour de repos.", it: "Giorno di riposo." },
    phaseOverview: { es: "Fases del Plan", en: "Plan Phases", de: "Phasen des Plans", fr: "Phases du plan", it: "Fasi del piano" },
    dietFocus: { es: "Nutrición", en: "Nutrition", de: "Ernährung", fr: "Nutrition", it: "Nutrizione" }
  },
  meals: {
    desayuno: { es: "Desayuno", en: "Breakfast", de: "Frühstück", fr: "Petit-déjeuner", it: "Colazione" },
    mediaManana: { es: "Media Mañana", en: "Morning Snack", de: "Vormittagssnack", fr: "Collation du matin", it: "Spuntino mattutino" },
    almuerzo: { es: "Almuerzo", en: "Lunch", de: "Mittagessen", fr: "Déjeuner", it: "Pranzo" },
    merienda: { es: "Merienda", en: "Afternoon Snack", de: "Nachmittagssnack", fr: "Goûter", it: "Merenda" },
    cena: { es: "Cena", en: "Dinner", de: "Abendessen", fr: "Dîner", it: "Cena" }
  }
};

const output = { es: {}, en: {}, de: {}, fr: {}, it: {} };

for (const lang of locales) {
  for (const [namespace, keys] of Object.entries(translations)) {
    output[lang][namespace] = {};
    for (const [key, langs] of Object.entries(keys)) {
      output[lang][namespace][key] = langs[lang];
    }
  }
}

// Ensure dir exists
if (!fs.existsSync(path.join(__dirname, 'src/i18n/locales'))) {
  fs.mkdirSync(path.join(__dirname, 'src/i18n/locales'), { recursive: true });
}

for (const lang of locales) {
  fs.writeFileSync(
    path.join(__dirname, `src/i18n/locales/${lang}.json`),
    JSON.stringify(output[lang], null, 2)
  );
}

console.log("JSON locales created successfully.");
