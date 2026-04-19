import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";
import { Save, Plus, Calculator, User, Users, Trash2, Globe } from "lucide-react";
import type { ActivityLevel, Profile } from "../types";
import { ACTIVITY_LABEL, bmr, dailyTarget, tdee, todayISO } from "../lib/calc";
import { useAppStore } from "../store/useAppStore";
import { useTranslation } from "react-i18next";

export function ProfileTab() {
  const { t, i18n } = useTranslation();
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
        <h1 className="text-2xl font-bold">{t("profile.title")}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("profile.subtitle")}
        </p>
      </header>
      
      {/* App Preferences */}
      <section className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Globe size={18} className="text-emerald-500" />
          <h2 className="font-semibold">{t("profile.preferences")}</h2>
        </div>
        <Field label={t("profile.language")}>
          <select
            value={i18n.resolvedLanguage}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="fr">Français</option>
            <option value="it">Italiano</option>
          </select>
        </Field>
      </section>

      {/* Account Management */}
      <section className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Users size={18} className="text-emerald-600 dark:text-emerald-400" />
          <h2 className="font-semibold">{t("profile.management")}</h2>
        </div>
        <select
          value={activeAccountId || ""}
          onChange={(e) => switchAccount(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 ring-emerald-500/20 outline-none transition"
        >
          {Object.entries(accounts).map(([id, acc]) => (
            <option key={id} value={id}>
              {acc.profile.name || t("profile.unnamed")} {id === "default_legacy" ? "(Legacy)" : ""}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const name = window.prompt(t("onboarding.createPrompt"));
              if (name && name.trim()) {
                createAccount(name.trim());
              }
            }}
            className="flex-1 bg-white dark:bg-slate-800 border border-emerald-500 text-emerald-600 dark:text-emerald-400 font-medium py-2 rounded-xl flex items-center justify-center gap-1.5 text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition auto-shrink"
          >
            <Plus size={16} /> {t("common.newInfo")}
          </button>
          <button
            onClick={() => {
              if (window.confirm(t("profile.deleteConfirm"))) {
                deleteAccount(activeAccountId!);
              }
            }}
            className="flex-1 bg-white dark:bg-slate-800 border border-rose-500 text-rose-600 dark:text-rose-400 font-medium py-2 rounded-xl flex items-center justify-center gap-1.5 text-sm hover:bg-rose-50 dark:hover:bg-rose-900/30 transition auto-shrink"
          >
            <Trash2 size={16} /> {t("common.delete")}
          </button>
        </div>
      </section>

      {/* Form */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <User size={18} className="text-emerald-500" />
          <h2 className="font-semibold">{t("profile.personalData")}</h2>
        </div>

        <Field label={t("profile.name")}>
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label={t("profile.age")}>
            <input
              type="number"
              inputMode="numeric"
              value={draft.age || ""}
              onChange={(e) => setDraft({ ...draft, age: Number(e.target.value) })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </Field>
          <Field label={t("profile.gender")}>
            <select
              value={draft.gender}
              onChange={(e) => setDraft({ ...draft, gender: e.target.value as Profile["gender"] })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              <option value="male">{t("profile.genderMale")}</option>
              <option value="female">{t("profile.genderFemale")}</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label={t("profile.height")}>
            <input
              type="number"
              inputMode="numeric"
              value={draft.heightCm || ""}
              onChange={(e) => setDraft({ ...draft, heightCm: Number(e.target.value) })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </Field>
          <Field label={t("profile.weight")}>
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

        <Field label={t("profile.targetWeight")}>
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={draft.targetWeightKg || ""}
            onChange={(e) => setDraft({ ...draft, targetWeightKg: Number(e.target.value) })}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          />
        </Field>

        <Field label={t("profile.activityLevel")}>
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

        <Field label={t("profile.goal")}>
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
                {g === "lose" ? t("profile.goalLose") : g === "maintain" ? t("profile.goalMaintain") : t("profile.goalGain")}
              </button>
            ))}
          </div>
        </Field>

        <button
          onClick={save}
          className="w-full bg-emerald-500 active:bg-emerald-600 text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2"
        >
          <Save size={18} /> {t("profile.saveProfile")}
        </button>
      </section>

      {/* TDEE */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Calculator size={18} className="text-emerald-500" />
          <h2 className="font-semibold">{t("profile.calcTitle")}</h2>
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
            <p className="text-xs text-emerald-700 dark:text-emerald-300">{t("profile.goal")}</p>
            <p className="text-lg font-bold tabular-nums text-emerald-700 dark:text-emerald-300">{target}</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          {t("profile.targetFormula", { modifier: draft.goal === "lose" ? "− 500" : draft.goal === "gain" ? "+ 300" : "± 0" })}
        </p>
      </section>

      {/* Weight tracking */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5">
        <h2 className="font-semibold mb-3">{t("profile.weightEvolution")}</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            placeholder={t("profile.weightTodayPlaceholder")}
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
                <ReferenceLine y={profile.targetWeightKg} stroke="#10b981" strokeDasharray="4 4" label={{ value: t("profile.goal"), fontSize: 10, fill: "#10b981", position: "insideTopRight" }} />
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
            {t("profile.noWeightData")}
          </p>
        )}

        {weights.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 mb-2">{t("profile.lastRecords")}</p>
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
