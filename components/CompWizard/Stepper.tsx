"use client";

import { cn } from "@/lib/utils";

type StepperProps = {
  steps: string[];
  current: number;
};

export function WizardStepper({ steps, current }: StepperProps) {
  return (
    <ol className="flex flex-wrap items-center gap-4">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = current === stepNumber;
        const isComplete = stepNumber < current;

        return (
          <li key={label} className="flex items-center gap-2 text-sm">
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                isActive
                  ? "border-accent bg-accent/10 text-accent"
                  : isComplete
                    ? "border-success bg-success/10 text-success"
                    : "border-border text-text-muted"
              )}
            >
              {stepNumber}
            </span>
            <span className={cn(isActive ? "text-text font-medium" : "text-text-muted")}>{label}</span>
            {index < steps.length - 1 && <span className="hidden text-text-muted sm:inline">/</span>}
          </li>
        );
      })}
    </ol>
  );
}
