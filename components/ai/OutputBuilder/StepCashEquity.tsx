"use client";

import { CashEquityPref } from "@/lib/farient/types";
import { cn } from "@/lib/utils";

type StepCashEquityProps = {
  value?: CashEquityPref;
  onSelect: (value: CashEquityPref) => void;
};

const OPTIONS: { value: CashEquityPref; title: string; detail: string }[] = [
  {
    value: "FavorCash",
    title: "Favor cash",
    detail: "Shift 10% of TDC into base to land candidates faster with less dilution."
  },
  {
    value: "FavorEquity",
    title: "Favor equity",
    detail: "Push value into LTI for retention / ownership alignment."
  }
];

export default function StepCashEquity({ value, onSelect }: StepCashEquityProps) {
  return (
    <div className="flex flex-col gap-3">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          className={cn(
            "rounded-2xl border p-4 text-left transition hover:shadow-sm",
            value === option.value
              ? "border-emerald-600 bg-emerald-600/15 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-400/20 dark:text-emerald-100"
              : "border-slate-200 text-slate-600 hover:border-emerald-200 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-400"
          )}
        >
          <div className="text-sm font-semibold">{option.title}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{option.detail}</div>
        </button>
      ))}
    </div>
  );
}
