"use client";

import { cn } from "@/lib/utils";
import type { WizardRoleScope } from "@/lib/farient/types";

type StepRoleScopeProps = {
  value: WizardRoleScope;
  onChange: (value: WizardRoleScope) => void;
};

const DIRECT_OPTIONS: NonNullable<WizardRoleScope["directs"]>[] = ["<5", "5-15", "15-50", "50-100", "100+"];

export function StepRoleScope({ value, onChange }: StepRoleScopeProps) {
  const updateHasPNL = (hasPNL: boolean) => onChange({ ...value, hasPNL });
  const updateDirects = (directs: NonNullable<WizardRoleScope["directs"]>) =>
    onChange({ ...value, directs });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-text">Does the role own a P&amp;L?</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {[true, false].map((option) => (
            <button
              key={String(option)}
              type="button"
              onClick={() => updateHasPNL(option)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                value.hasPNL === option
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-text-muted hover:border-accent/60 hover:text-text"
              )}
            >
              {option ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-text">How many direct reports?</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {DIRECT_OPTIONS.map((option) => (
            <button
              key={option ?? "none"}
              type="button"
              onClick={() => option && updateDirects(option)}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm transition-colors",
                value.directs === option
                  ? "border-accent bg-accent/10 text-text"
                  : "border-border text-text-muted hover:border-accent/60 hover:text-text"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
