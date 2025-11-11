"use client";

import type { CashEquityPref } from "@/lib/farient/types";
import { cn } from "@/lib/utils";

type StepCashEquityProps = {
  value?: CashEquityPref;
  onSelect: (value: CashEquityPref) => void;
};

const OPTIONS: { value: CashEquityPref; label: string; detail: string }[] = [
  {
    value: "FavorCash",
    label: "Favor Cash",
    detail: "Shift 10% of value from equity into base salary."
  },
  {
    value: "FavorEquity",
    label: "Favor Equity",
    detail: "Shift 10% of value from base into LTI."
  }
];

export function StepCashEquity({ value, onSelect }: StepCashEquityProps) {
  return (
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
  );
}
