"use client";

import type { ParityRule } from "@/lib/farient/types";
import { cn } from "@/lib/utils";

type StepParityProps = {
  value?: ParityRule;
  onSelect: (value: ParityRule) => void;
};

const OPTIONS: { value: ParityRule; label: string; detail: string }[] = [
  {
    value: "MatchBands",
    label: "Match existing bands",
    detail: "Stay within +10% of current salary structures."
  },
  {
    value: "Flexible",
    label: "Flexible",
    detail: "Full market stretch allowed with justification."
  }
];

export function StepParity({ value, onSelect }: StepParityProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">Internal parity can limit how far we push base salaries.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={cn(
              "rounded-2xl border p-4 text-left transition-colors",
              value === option.value
                ? "border-accent bg-accent/10 text-text"
                : "border-border text-text-muted hover:border-accent/60 hover:text-text"
            )}
          >
            <div className="text-sm font-semibold">{option.label}</div>
            <div className="text-xs">{option.detail}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
