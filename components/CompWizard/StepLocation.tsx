"use client";

import type { LocationTier } from "@/lib/farient/types";
import { cn } from "@/lib/utils";

type StepLocationProps = {
  value?: LocationTier;
  onSelect: (value: LocationTier) => void;
};

const OPTIONS: { value: LocationTier; label: string; detail: string }[] = [
  { value: "Tier1_NY_SF", label: "Tier 1", detail: "NYC / San Francisco" },
  { value: "Tier2_BOS_DAL_AUS", label: "Tier 2", detail: "Boston / Dallas / Austin" },
  { value: "Tier3_Other", label: "Tier 3", detail: "Other markets or remote" }
];

export function StepLocation({ value, onSelect }: StepLocationProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">Location factors drive cost-of-living uplifts.</p>
      <div className="grid gap-3 sm:grid-cols-3">
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
