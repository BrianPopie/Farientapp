"use client";

import { CompanySize } from "@/lib/farient/types";
import { cn } from "@/lib/utils";

type StepCompanyProps = {
  value?: CompanySize;
  onSelect: (value: CompanySize) => void;
};

const COMPANY_OPTIONS: { title: string; detail: string; value: CompanySize }[] = [
  { value: "<25/<$10M", title: "Seed / <$10M", detail: "Founding teams, early stage capitalization" },
  { value: "25-100/$10-50M", title: "Series B", detail: "25–100 heads / $10–50M revenue" },
  { value: "100-500/$50-250M", title: "Scaling", detail: "100–500 heads / $50–250M revenue" },
  { value: "500-2,000/$250M-$1B", title: "Mid-cap", detail: "500–2,000 heads / $250M–$1B revenue" },
  { value: "2,000+/$1B+", title: "Large / IPO+", detail: "2,000+ heads / $1B+ revenue" }
];

export default function StepCompany({ value, onSelect }: StepCompanyProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Anchor the operating scale so the engine knows how aggressively to stretch base, bonus, and LTI.
      </p>
      <div className="grid gap-3">
        {COMPANY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={cn(
              "rounded-2xl border p-4 text-left transition hover:shadow-sm",
              value === option.value
                ? "border-slate-900 bg-slate-900/5 text-slate-900 dark:border-slate-100 dark:bg-slate-100/10 dark:text-slate-100"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600"
            )}
          >
            <div className="text-sm font-semibold">{option.title}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{option.detail}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
