interface Props {
  value: number;
  max: number;
  over?: boolean;
}

export function ProgressBar({ value, max, over }: Props) {
  const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100));
  return (
    <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
      <div
        className={`h-full transition-all duration-500 ${
          over
            ? "bg-rose-500"
            : pct > 85
            ? "bg-amber-500"
            : "bg-emerald-500"
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
