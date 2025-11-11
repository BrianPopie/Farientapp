"use client";

import { ParityRule } from "@/lib/farient/types";
import { cn } from "@/lib/utils";

type StepParityProps = {
  value?: ParityRule;
  onSelect: (value: ParityRule) => void;
};

const OPTIONS: { value: ParityRule; title: string; detail: string }[] = [
  { value: "MatchBands", title: "Match internal bands", detail: "Hard cap at +10% stretch vs. current comp grids." },
  { value: "Flexible", title: "Flexible parity", detail: "Allow full market reach; highlight rationale in the notes." }
];

export default function StepParity({ value, onSelect }: StepParityProps) {
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
              ? "border-amber-500 bg-amber-500/20 text-amber-700 dark:border-amber-300 dark:bg-amber-300/20 dark:text-amber-100"
              : "border-slate-200 text-slate-600 hover:border-amber-200 dark:border-slate-700 dark:text-slate-300 dark:hover:border-amber-300"
          )}
        >
          <div className="text-sm font-semibold">{option.title}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{option.detail}</div>
        </button>
      ))}
    </div>
  );
}
