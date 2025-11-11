"use client";

import { LocationTier } from "@/lib/farient/types";
import { cn } from "@/lib/utils";

type StepLocationProps = {
  value?: LocationTier;
  onSelect: (value: LocationTier) => void;
};

const OPTIONS: { value: LocationTier; title: string; subtitle: string }[] = [
  { value: "Tier1_NY_SF", title: "Tier 1", subtitle: "NYC / SF / comparable HQs" },
  { value: "Tier2_BOS_DAL_AUS", title: "Tier 2", subtitle: "Boston, Dallas, Austin, Seattle" },
  { value: "Tier3_Other", title: "Tier 3", subtitle: "Remote-first or other markets" }
];

export default function StepLocation({ value, onSelect }: StepLocationProps) {
  return (
    <div className="grid gap-3">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          className={cn(
            "rounded-2xl border p-4 text-left transition hover:shadow-sm",
            value === option.value
              ? "border-indigo-600 bg-indigo-600/15 text-indigo-700 dark:border-indigo-300 dark:bg-indigo-300/20 dark:text-indigo-100"
              : "border-slate-200 text-slate-600 hover:border-indigo-200 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-400"
          )}
        >
          <div className="text-sm font-semibold">{option.title}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{option.subtitle}</div>
        </button>
      ))}
    </div>
  );
}
