"use client";

type BoardStatProps = {
  label: string;
  value: string;
};

export function BoardStat({ label, value }: BoardStatProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
      <p className="text-xs uppercase tracking-[0.3em] text-white/40">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
