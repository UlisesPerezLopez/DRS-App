import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../store/useAppStore";

export function LevelUpOverlay() {
  const { t } = useTranslation();
  const showLevelUpCelebration = useAppStore((s) => s.showLevelUpCelebration);
  const dismissLevelUp = useAppStore((s) => s.dismissLevelUp);

  const activeAccountId = useAppStore((s) => s.activeAccountId);
  const account = useAppStore((s) =>
    activeAccountId ? s.accounts[activeAccountId] : null,
  );
  const userLevel = account?.userLevel || 1;

  if (!showLevelUpCelebration) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center space-y-6 animate-in fade-in zoom-in duration-300 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-emerald-500/10 blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-teal-500/10 blur-3xl"></div>

        {/* Animated Level Badge Icon */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-xl shadow-emerald-500/30 animate-bounce">
          <Star className="text-white fill-white" size={48} />
          <span className="absolute bottom-1 right-1 bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-1.5 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900/20">
            Lvl
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            {t("gamification.levelUpTitle", { defaultValue: "¡Felicidades!" })}
          </h2>
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            {t("gamification.levelUpDesc", {
              level: userLevel,
              defaultValue: `Has alcanzado el Nivel ${userLevel}`,
            })}
          </p>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {t("gamification.levelUpMotiv", {
            defaultValue:
              "¡Sigue registrando tus hábitos para mantener tu racha y desbloquear más recompensas!",
          })}
        </p>

        <button
          onClick={dismissLevelUp}
          className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-transform"
        >
          {t("gamification.continueBtn", { defaultValue: "Continuar" })} →
        </button>
      </div>
    </div>
  );
}
