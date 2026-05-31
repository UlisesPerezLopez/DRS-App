import { useState, useEffect, useRef } from "react";
import { Bot, X, Send, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../store/useAppStore";

export function AICoachChat() {
  const { t } = useTranslation();
  const { coachMessages, isAiTyping, sendMessageToCoach } = useAppStore();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final del chat cuando se añaden nuevos mensajes o se abre la ventana
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [coachMessages.length, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isAiTyping) return;

    const textToSend = inputText;
    setInputText(""); // Limpiar el input inmediatamente para feedback rápido
    await sendMessageToCoach(textToSend);
  };

  return (
    <div className="fixed bottom-24 max-w-md mx-auto inset-x-0 z-40 flex justify-end px-4 pointer-events-none">
      <div className="pointer-events-auto flex flex-col items-end">
        {/* PANEL DE CHAT ELEVADO */}
        {isOpen ? (
          <div className="w-[340px] h-[460px] bg-[#FAF7F2]/95 dark:bg-slate-900/95 backdrop-blur border border-[#E5DFD3]/50 dark:border-slate-800/50 shadow-2xl rounded-3xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 fade-in-50 duration-300">
            {/* Cabecera del Panel */}
            <header className="px-5 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white flex items-center justify-between shadow-md shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FAF7F2]/20 flex items-center justify-center animate-pulse">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wide">
                    {t("aiCoach.title", { defaultValue: "Coach Inteligente" })}
                  </h3>
                  <p className="text-[10px] text-indigo-100 font-semibold uppercase tracking-wider">
                    {t("aiCoach.subtitle", { defaultValue: "Resiliencia IA" })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-[#FAF7F2]/10 active:scale-95 transition"
                aria-label={t("aiCoach.closeLabel", {
                  defaultValue: "Cerrar chat",
                })}
              >
                <X size={18} />
              </button>
            </header>

            {/* Mensajes del Chat */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F0EBE1]/50 dark:bg-slate-950/20">
              {coachMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-500 animate-bounce">
                    <Sparkles size={24} />
                  </div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {t("aiCoach.welcomeTitle", {
                      defaultValue: "¡Pregúntame lo que quieras!",
                    })}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {t("aiCoach.welcomeDesc", {
                      defaultValue:
                        "Soy tu entrenador de salud personal. Consúltame sobre nutrición, déficit calórico o rutinas de ejercicio.",
                    })}
                  </p>
                </div>
              ) : (
                coachMessages.map((msg) => {
                  const isUser = msg.role === "user";
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isUser ? "justify-end animate-in slide-in-from-right-4" : "justify-start animate-in slide-in-from-left-4"} duration-200`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                          isUser
                            ? "bg-indigo-500 text-white rounded-tr-none"
                            : "bg-[#FAF7F2] dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-[#E5DFD3] dark:border-slate-800/80 rounded-tl-none"
                        }`}
                      >
                        <p>{msg.content}</p>
                        {msg.isOffline && (
                          <span className="block text-[8px] text-right mt-1 opacity-70 font-bold uppercase tracking-wider">
                            {t("aiCoach.offlineLabel", {
                              defaultValue: "⚡ offline",
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Indicador de Escritura */}
              {isAiTyping && (
                <div className="flex justify-start animate-in fade-in-50 duration-200">
                  <div className="bg-[#FAF7F2] dark:bg-slate-800 border border-[#E5DFD3] dark:border-slate-800/80 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0ms]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:150ms]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:300ms]"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Área del Input Inferior */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-[#E5DFD3] dark:border-slate-800 bg-[#FAF7F2] dark:bg-slate-900 flex gap-2 items-center shrink-0"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isAiTyping}
                placeholder={
                  isAiTyping
                    ? t("aiCoach.thinking", {
                        defaultValue: "El Coach está pensando...",
                      })
                    : t("aiCoach.placeholder", {
                        defaultValue: "Pregúntale al Coach...",
                      })
                }
                className="flex-1 px-3 py-2.5 rounded-xl border border-[#E5DFD3] dark:border-slate-700 bg-[#F0EBE1] dark:bg-slate-950 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 text-slate-900 dark:text-slate-100"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isAiTyping}
                className="w-9 h-9 rounded-xl bg-indigo-500 active:bg-indigo-600 disabled:bg-slate-100 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 flex items-center justify-center transition active:scale-95 shrink-0"
                aria-label={t("aiCoach.sendLabel", {
                  defaultValue: "Enviar mensaje",
                })}
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        ) : (
          /* BOTÓN FLOTANTE (FAB) */
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-violet-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-500/20 active:scale-95 hover:scale-110 transition-all duration-300 group"
            aria-label={t("aiCoach.openLabel", {
              defaultValue: "Abrir asistente de IA",
            })}
          >
            <Sparkles
              size={24}
              className="group-hover:rotate-12 transition-transform duration-300"
            />
          </button>
        )}
      </div>
    </div>
  );
}
