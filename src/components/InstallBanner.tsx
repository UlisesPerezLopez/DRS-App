import { useState, useEffect } from "react";
import { Download, Share, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useInstallPrompt } from "../hooks/useInstallPrompt";

export function InstallBanner() {
  const { t } = useTranslation();
  const { isInstallable, isIosInstallable, prompt } = useInstallPrompt();

  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true); // default to true to avoid flash before checking local storage

  useEffect(() => {
    // Check if running in standalone mode
    const standaloneCheck =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    setIsStandalone(standaloneCheck);

    // Check if dismissed in last 7 days
    const dismissedAt = localStorage.getItem("drs_install_banner_dismissed_at");
    if (!dismissedAt) {
      setIsDismissed(false);
    } else {
      const now = Date.now();
      const diff = now - Number(dismissedAt);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      setIsDismissed(diff < sevenDays);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("drs_install_banner_dismissed_at", String(Date.now()));
    setIsDismissed(true);
  };

  // If already standalone, dismissed, or not installable on this device, do not render
  if (isStandalone || isDismissed || (!isInstallable && !isIosInstallable)) {
    return null;
  }

  return (
    <div className="w-full bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-md border border-slate-700/50 dark:border-slate-800/80 rounded-3xl p-5 shadow-lg relative overflow-hidden transition-all duration-300">
      {/* Absolute background accent */}
      <div className="absolute -right-10 -top-10 w-24 h-24 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-start gap-4">
        {/* Visual Icon */}
        <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl text-white shadow-md shadow-teal-500/10 shrink-0">
          <Download size={20} />
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 pr-6">
          <h3 className="font-semibold text-slate-100 text-sm md:text-base leading-snug">
            {t("install.title")}
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {t("install.desc")}
          </p>

          {/* Device specific action UI */}
          <div className="mt-4">
            {isInstallable && (
              <div className="flex items-center gap-3">
                <button
                  onClick={prompt}
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 active:scale-95 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition shadow-md shadow-teal-500/10"
                >
                  {t("install.btnInstall")}
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-slate-400 hover:text-slate-200 font-medium text-xs px-3 py-2 transition"
                >
                  {t("install.btnDismiss")}
                </button>
              </div>
            )}

            {isIosInstallable && (
              <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700/30 rounded-2xl p-3 text-slate-300 text-xs mt-1">
                <div className="bg-slate-700/80 p-1.5 rounded-lg text-slate-200 shrink-0">
                  <Share size={14} />
                </div>
                <p className="leading-normal flex-1">
                  {t("install.iosInstruction")}
                </p>
                <button
                  onClick={handleDismiss}
                  className="text-slate-400 hover:text-slate-200 font-medium text-xs ml-2 py-1 px-2 shrink-0 transition"
                  aria-label={t("install.btnDismiss")}
                >
                  {t("install.btnDismiss")}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Floating Close Button */}
        {isInstallable && (
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
