type Step = {
  id: string;
  label: string;
  status: "complete" | "current" | "upcoming";
  duration?: string;
};

type StepperProps = {
  steps: Step[];
};

export function Stepper({ steps }: StepperProps) {
  return (
    <ol className="flex flex-col gap-4 md:flex-row md:items-start">
      {steps.map((step, index) => (
        <li key={step.id} className="flex flex-1 items-center gap-4">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-2xl border-2 text-sm font-semibold ${
              step.status === "complete"
                ? "border-success/70 text-success"
                : step.status === "current"
                  ? "border-accent text-accent"
                  : "border-border text-text-muted"
            }`}
          >
            {index + 1}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-text">{step.label}</span>
            {step.duration && <span className="text-xs text-text-muted">{step.duration}</span>}
          </div>
        </li>
      ))}
    </ol>
  );
}
