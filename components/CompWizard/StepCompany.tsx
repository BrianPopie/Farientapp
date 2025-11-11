"use client";

import { CompanySize } from "@/lib/farient/types";
import { cn } from "@/lib/utils";

type StepCompanyProps = {
  value?: CompanySize;
  onSelect: (value: CompanySize) => void;
};

const COMPANY_OPTIONS: { label: string; value: CompanySize }[] = [
  { value: "<25/<$10M", label: "<25 people / <$10M revenue" },
  { value: "25-100/$10-50M", label: "25–100 people / $10–50M" },
  { value: "100-500/$50-250M", label: "100–500 people / $50–250M" },
  { value: "500-2,000/$250M-$1B", label: "500–2,000 people / $250M–$1B" },
  { value: "2,000+/$1B+", label: "2,000+ people / $1B+" }
];

export function StepCompany({ value, onSelect }: StepCompanyProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">
        Choose the combination that best matches the company&apos;s headcount and revenue band.
      </p>
      <div className="grid gap-3">
        {COMPANY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={cn(
              "rounded-2xl border p-4 text-left transition-colors",
              value === option.value
                ? "border-accent bg-accent/10 text-text"
                : "border-border bg-surface/60 hover:border-accent/60 hover:text-text"
            )}
          >
            <div className="text-sm font-medium">{option.label}</div>
            <div className="text-xs text-text-muted">{option.value}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
