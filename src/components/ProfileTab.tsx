import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";
import { Save, Plus, Calculator, User, Users, Trash2 } from "lucide-react";
import type { ActivityLevel, Profile } from "../types";
import { ACTIVITY_LABEL, bmr, dailyTarget, tdee, todayISO } from "../lib/calc";
import { useAppStore } from "../store/useAppStore";

export function ProfileTab() {
  const account = useAppStore(s => s.accounts[s.activeAccountId!]);
  const profile = account.profile;
  const weights = account.weights;
  
  const setProfile = useAppStore(s => s.setProfile);
  const setWeights = useAppStore(s => s.setWeights);
  const accounts = useAppStore(s => s.accounts);
  const activeAccountId = useAppStore(s => s.activeAccountId);
  const switchAccount = useAppStore(s => s.switchAccount);
  const createAccount = useAppStore(s => s.createAccount);
  const deleteAccount = useAppStore(s => s.deleteAccount);

  const [draft, setDraft] = useState<Profile>(profile);
  const [newWeight, setNewWeight] = useState("");

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const tdeeVal = Math.round(tdee(draft));
  const bmrVal = Math.round(bmr(draft));
  const target = dailyTarget(draft);

  function save() {
    setProfile(draft);
  }

  function addWeight() {
    const w = Number(newWeight);
    if (!w || isNaN(w)) return;
    const today = todayISO();
    setWeights((prev) => {
      const filtered = prev.filter((e) => e.date !== today);
      return [...filtered, { date: today, weight: w }].sort((a, b) =>
        a.date.localeCompare(b.date)
      );
    });
    setDraft((p) => ({ ...p, weightKg: w }));
    setProfile({ ...draft, weightKg: w });
    setNewWeight("");
  }

  const chartData = weights.map((w) => ({
    date: w.date.slice(5), // MM-DD
    weight: w.weight,
  }));

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      <header>
        <h1 className="text-2xl font-bold">Perfil & Progreso</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Tus datos se guardan en este dispositivo.
        </p>
      </header>

      {/* Account Management */}
      <section className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Users size={18} className="text-emerald-600 dark:text-emerald-400" />
          <h2 className="font-semibold">Gestión de Perfiles</h2>
        </div>
        <select
          value={activeAccountId || ""}
          onChange={(e) => switchAccount(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 ring-emerald-500/20 outline-none transition"
        >
          {Object.entries(accounts).map(([id, acc]) => (
            <option key={id} value={id}>
              {acc.profile.name || "Sin nombre"} {id === "default_legacy" ? "(Legacy)" : ""}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const name = window.prompt("Nombre del nuevo perfil:");
              if (name && name.trim()) {
                createAccount(name.trim());
              }
            }}
            className="flex-1 bg-white dark:bg-slate-800 border border-emerald-500 text-emerald-600 dark:text-emerald-400 font-medium py-2 rounded-xl flex items-center justify-center gap-1.5 text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition auto-shrink"
          >
            <Plus size={16} /> Nuevo
          </button>
          <button
            onClick={() => {
              if (window.confirm(`¿Seguro que quieres borrar el perfil actual y todos sus datos? Esta acción es irreversible.`)) {
                deleteAccount(activeAccountId!);
              }
            }}
            className="flex-1 bg-white dark:bg-slate-800 border border-rose-500 text-rose-600 dark:text-rose-400 font-medium py-2 rounded-xl flex items-center justify-center gap-1.5 text-sm hover:bg-rose-50 dark:hover:bg-rose-900/30 transition auto-shrink"
          >
            <Trash2 size={16} /> Borrar
          </button>
        </div>
      </section>

      {/* Form */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <User size={18} className="text-emerald-500" />
          <h2 className="font-semibold">Datos personales</h2>
        </div>

        <Field label="Nombre">
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Edad">
            <input
              type="number"
              inputMode="numeric"
              value={draft.age || ""}
              onChange={(e) => setDraft({ ...draft, age: Number(e.target.value) })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </Field>
          <Field label="Género">
            <select
              value={draft.gender}
              onChange={(e) => setDraft({ ...draft, gender: e.target.value as Profile["gender"] })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              <option value="male">Hombre</option>
              <option value="female">Mujer</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Altura (cm)">
            <input
              type="number"
              inputMode="numeric"
              value={draft.heightCm || ""}
              onChange={(e) => setDraft({ ...draft, heightCm: Number(e.target.value) })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </Field>
          <Field label="Peso (kg)">
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              value={draft.weightKg || ""}
              onChange={(e) => setDraft({ ...draft, weightKg: Number(e.target.value) })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </Field>
        </div>

        <Field label="Peso objetivo (kg)">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={draft.targetWeightKg || ""}
            onChange={(e) => setDraft({ ...draft, targetWeightKg: Number(e.target.value) })}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
        </Field>

        <Field label="Nivel de actividad">
          <select
            value={draft.activity}
            onChange={(e) => setDraft({ ...draft, activity: e.target.value as ActivityLevel })}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          >
            {(Object.keys(ACTIVITY_LABEL) as ActivityLevel[]).map((k) => (
              <option key={k} value={k}>{ACTIVITY_LABEL[k]}</option>
            ))}
          </select>
        </Field>

        <Field label="Objetivo">
          <div className="grid grid-cols-3 gap-2">
            {(["lose", "maintain", "gain"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setDraft({ ...draft, goal: g })}
                className={`py-2.5 rounded-xl text-sm font-medium border transition ${
                  draft.goal === g
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                }`}
              >
                {g === "lose" ? "Perder" : g === "maintain" ? "Mantener" : "Ganar"}
              </button>
            ))}
          </div>
        </Field>

        <button
          onClick={save}
          className="w-full bg-emerald-500 active:bg-emerald-600 text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2"
        >
          <Save size={18} /> Guardar perfil
        </button>
      </section>

      {/* TDEE */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Calculator size={18} className="text-emerald-500" />
          <h2 className="font-semibold">Cálculo Mifflin-St Jeor</h2>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
            <p className="text-xs text-slate-500">BMR</p>
            <p className="text-lg font-bold tabular-nums">{bmrVal}</p>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
            <p className="text-xs text-slate-500">TDEE</p>
            <p className="text-lg font-bold tabular-nums">{tdeeVal}</p>
          </div>
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/30 p-3">
            <p className="text-xs text-emerald-700 dark:text-emerald-300">Objetivo</p>
            <p className="text-lg font-bold tabular-nums text-emerald-700 dark:text-emerald-300">{target}</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Objetivo = TDEE {draft.goal === "lose" ? "− 500" : draft.goal === "gain" ? "+ 300" : "± 0"} kcal.
        </p>
      </section>

      {/* Weight tracking */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5">
        <h2 className="font-semibold mb-3">Evolución de peso</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            placeholder="Peso de hoy (kg)"
            className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
          <button
            onClick={addWeight}
            className="bg-emerald-500 active:bg-emerald-600 text-white px-4 rounded-xl flex items-center gap-1 font-semibold"
          >
            <Plus size={18} />
          </button>
        </div>

        {chartData.length > 0 ? (
          <div className="h-56 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={["dataMin - 1", "dataMax + 1"]} tick={{ fontSize: 11 }} width={40} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                  }}
                />
                <ReferenceLine y={profile.targetWeightKg} stroke="#10b981" strokeDasharray="4 4" label={{ value: "Objetivo", fontSize: 10, fill: "#10b981", position: "insideTopRight" }} />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#10b981" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-6">
            Añade tu primer registro para ver el gráfico.
          </p>
        )}

        {weights.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 mb-2">Últimos registros</p>
            <ul className="space-y-1.5 max-h-32 overflow-y-auto">
              {[...weights].reverse().slice(0, 8).map((w) => (
                <li key={w.date} className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">{w.date}</span>
                  <span className="font-semibold tabular-nums">{w.weight} kg</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">{label}</span>
      {children}
    </label>
  );
}
