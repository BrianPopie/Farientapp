"use client";

type PayMix = {
  salaryPct: number;
  bonusPct: number;
  equityPct: number;
};

type PayMixBarProps = {
  label: string;
  subtitle?: string;
  mix: PayMix;
};

const segments = [
  { key: "salaryPct", label: "Salary", color: "bg-sky-500" },
  { key: "bonusPct", label: "Bonus", color: "bg-indigo-500" },
  { key: "equityPct", label: "Equity", color: "bg-fuchsia-500" }
] as const;

export function PayMixBar({ label, subtitle, mix }: PayMixBarProps) {
  const total = mix.salaryPct + mix.bonusPct + mix.equityPct || 1;

  const normalize = (value: number) => Math.max(0, Math.min(100, (value / total) * 100));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-text">{label}</span>
        {subtitle ? <span className="text-xs text-text-muted">{subtitle}</span> : null}
      </div>
      <div className="flex h-5 overflow-hidden rounded-full border border-border/60 bg-surface/80 text-[11px] text-white">
        {segments.map((segment) => (
          <div
            key={segment.key}
            className={`${segment.color} flex items-center justify-center`}
            style={{ width: `${normalize(mix[segment.key])}%` }}
          >
            {`${Math.round(mix[segment.key])}%`}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-text-muted">
        {segments.map((segment) => (
          <span key={segment.key}>{segment.label}</span>
        ))}
      </div>
    </div>
  );
}
