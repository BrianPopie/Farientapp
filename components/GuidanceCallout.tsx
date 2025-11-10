"use client";

import { GuidanceBlock } from "@/lib/insights";

type GuidanceCalloutProps = {
  guidance?: GuidanceBlock | null;
  dense?: boolean;
};

const fields: { key: keyof GuidanceBlock; label: string }[] = [
  { key: "vehicles", label: "Vehicles" },
  { key: "metrics", label: "Metrics" },
  { key: "vesting", label: "Vesting" },
  { key: "rationale", label: "Rationale" }
];

export function GuidanceCallout({ guidance, dense = false }: GuidanceCalloutProps) {
  if (!guidance) return null;

  return (
    <div className={`rounded-2xl border border-accent/40 bg-accent/5 ${dense ? "p-3" : "p-4"}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">Guidance</p>
      <dl className="mt-2 grid gap-2 text-sm text-text">
        {fields.map(({ key, label }) => (
          <div key={key}>
            <dt className="text-[11px] uppercase tracking-wide text-text-muted">{label}</dt>
            <dd className="text-sm text-text">
              {guidance[key] && guidance[key]?.length ? guidance[key] : <span className="text-text-muted">need source</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
