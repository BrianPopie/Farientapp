"use client";

type BoardStatProps = {
  label: string;
  value: string;
};

export function BoardStat({ label, value }: BoardStatProps) {
  return (
    <div className="rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm text-text shadow-inner dark:border-white/10 dark:bg-white/5 dark:text-white/80">
      <p className="text-xs uppercase tracking-[0.3em] text-text/60 dark:text-white/40">{label}</p>
      <p className="mt-1 text-lg font-semibold text-text dark:text-white">{value}</p>
    </div>
  );
}
