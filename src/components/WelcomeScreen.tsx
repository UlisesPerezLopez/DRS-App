import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../store/useAppStore";
import { Globe, ChevronRight, Heart, Sparkles } from "lucide-react";

const LANGUAGES = [
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
];

export function WelcomeScreen() {
  const { t, i18n } = useTranslation();
  const completeWelcome = useAppStore(s => s.completeWelcome);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  function selectLanguage(code: string) {
    setSelectedLang(code);
    i18n.changeLanguage(code);
    setTimeout(() => setStep(2), 300);
  }

  function handleStart() {
    completeWelcome();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        {step === 1 ? (
          /* ===== STEP 1: Language Selection ===== */
          <div className="w-full animate-fadeIn">
            {/* Logo */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-6">
                <span className="text-4xl">🎯</span>
              </div>
              <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                DRS
              </h1>
              <p className="text-xs text-indigo-300/60 tracking-[0.3em] uppercase mt-1">Desafío Rutina Saludable</p>
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-center mb-2 text-white/90">
              {t("welcome.title")}
            </h2>
            <p className="text-sm text-center text-indigo-300/70 mb-8 flex items-center justify-center gap-1.5">
              <Globe size={14} />
              {t("welcome.select_language")}
            </p>

            {/* Language buttons */}
            <div className="space-y-2.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => selectLanguage(lang.code)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-200 active:scale-[0.98] ${
                    selectedLang === lang.code
                      ? "bg-emerald-500/20 border-emerald-500/50 shadow-lg shadow-emerald-500/10"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-medium text-base flex-1 text-left">{lang.label}</span>
                  <ChevronRight size={18} className="text-white/30" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ===== STEP 2: Developer Message ===== */
          <div className="w-full animate-fadeIn">
            {/* Logo small */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <p className="font-bold text-lg leading-tight">DRS</p>
                <p className="text-[10px] text-indigo-300/50 tracking-widest uppercase">v1.0 Beta</p>
              </div>
            </div>

            {/* Disclaimer card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-amber-400" />
                <h3 className="font-bold text-lg text-amber-300">
                  {t("welcome.disclaimer_title")}
                </h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-5">
                {t("welcome.disclaimer_text")}
              </p>
              <div className="flex items-start gap-2.5 pt-4 border-t border-white/5">
                <Heart size={14} className="text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400 leading-relaxed italic">
                  {t("welcome.credits")}
                </p>
              </div>
            </div>

            {/* Start button */}
            <button
              onClick={handleStart}
              className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.97] transition-all shadow-xl shadow-emerald-500/20"
            >
              {t("welcome.start_button")} →
            </button>

            {/* Back to language */}
            <button
              onClick={() => setStep(1)}
              className="w-full mt-3 py-2.5 text-sm text-indigo-300/50 hover:text-indigo-300/80 transition flex items-center justify-center gap-1"
            >
              <Globe size={14} />
              {t("welcome.select_language")}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
