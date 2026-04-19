import { useState } from "react";
import { ChevronDown, Clock, Wallet, Flame } from "lucide-react";
import { RECIPES } from "../lib/data";

export function Recipes() {
  const [open, setOpen] = useState<string | null>(RECIPES[0].id);

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      <header>
        <h1 className="text-2xl font-bold">Recetario Low-Cost</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          5 recetas económicas y equilibradas
        </p>
      </header>

      <div className="space-y-3">
        {RECIPES.map((r) => {
          const isOpen = open === r.id;
          return (
            <article
              key={r.id}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden"
            >
              <button
                onClick={() => setOpen(isOpen ? null : r.id)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{r.name}</h3>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Wallet size={12} /> {r.cost}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {r.time}</span>
                    <span className="flex items-center gap-1"><Flame size={12} /> {r.kcal} kcal</span>
                  </div>
                </div>
                <ChevronDown
                  size={20}
                  className={`shrink-0 ml-2 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <Macro label="Proteínas" value={`${r.protein} g`} color="emerald" />
                    <Macro label="Carbs" value={`${r.carbs} g`} color="amber" />
                    <Macro label="Grasas" value={`${r.fat} g`} color="rose" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Ingredientes</p>
                    <ul className="space-y-1">
                      {r.ingredients.map((i) => (
                        <li key={i} className="text-sm flex gap-2">
                          <span className="text-emerald-500">•</span> {i}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Preparación</p>
                    <ol className="space-y-2">
                      {r.steps.map((s, i) => (
                        <li key={i} className="text-sm flex gap-2.5">
                          <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function Macro({ label, value, color }: { label: string; value: string; color: "emerald" | "amber" | "rose" }) {
  const colorMap = {
    emerald: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    amber: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
    rose: "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300",
  };
  return (
    <div className={`rounded-xl p-2.5 ${colorMap[color]}`}>
      <p className="text-[10px] uppercase tracking-wide opacity-80">{label}</p>
      <p className="font-bold tabular-nums">{value}</p>
    </div>
  );
}
