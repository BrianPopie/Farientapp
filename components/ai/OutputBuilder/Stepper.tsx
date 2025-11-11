"use client";

import { useEffect, useMemo, useReducer, useRef, useState, useTransition } from "react";
import type {
  CashEquityPref,
  CompanySize,
  Inputs,
  LocationTier,
  Output,
  ParityRule
} from "@/lib/farient/types";
import StepCompany from "./StepCompany";
import StepRoleScope from "./StepRoleScope";
import StepLocation from "./StepLocation";
import StepParity from "./StepParity";
import StepCashEquity from "./StepCashEquity";
import OutputTable from "./OutputTable";
import { LS_KEY, LS_OUT, readJSON, writeJSON, removeKey } from "../ls";
import type { BuilderState, RoleBandSelection } from "./state";
import { initialBuilderState } from "./state";
import { Section } from "../Section";

type StepKey = "company" | "role" | "location" | "parity" | "mix";

type Action =
  | { type: "setCompany"; value?: CompanySize }
  | { type: "setRole"; value?: BuilderState["role"] }
  | { type: "setLocation"; value?: LocationTier }
  | { type: "setParity"; value?: ParityRule }
  | { type: "setMix"; value?: CashEquityPref }
  | { type: "setRoleBand"; value?: RoleBandSelection }
  | { type: "reset" };

const steps: { key: StepKey; label: string }[] = [
  { key: "company", label: "Company size" },
  { key: "role", label: "Role scope" },
  { key: "location", label: "Location tier" },
  { key: "parity", label: "Parity guardrails" },
  { key: "mix", label: "Cash vs equity" }
];

function reducer(state: BuilderState, action: Action): BuilderState {
  switch (action.type) {
    case "setCompany":
      return { ...state, company: action.value };
    case "setRole":
      return { ...state, role: action.value };
    case "setLocation":
      return { ...state, location: action.value };
    case "setParity":
      return { ...state, parity: action.value };
    case "setMix":
      return { ...state, mix: action.value };
    case "setRoleBand":
      return { ...state, roleBand: action.value };
    case "reset":
      return { ...initialBuilderState };
    default:
      return state;
  }
}

export type OutputBuilderProps = {
  onGenerate: (inputs: Required<Inputs>) => Promise<Output>;
};

export default function OutputBuilder({ onGenerate }: OutputBuilderProps) {
  const [state, dispatch] = useReducer(
    reducer,
    undefined,
    () => readJSON<BuilderState>(LS_KEY) ?? initialBuilderState
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [output, setOutput] = useState<Output | null>(() => readJSON<Output>(LS_OUT) ?? null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const mounted = useRef(false);
  const serializedState = useMemo(() => JSON.stringify(state), [state]);

  useEffect(() => {
    if (!mounted.current) mounted.current = true;
    const snapshot = JSON.parse(serializedState) as BuilderState;
    writeJSON(LS_KEY, snapshot);
  }, [serializedState]);

  const roleComplete =
    state.role &&
    typeof state.role.hasPNL === "boolean" &&
    typeof state.role.directs === "string" &&
    state.role.directs.length > 0 &&
    Boolean(state.roleBand?.roleLabel);
  const complete =
    Boolean(state.company) &&
    Boolean(state.location) &&
    Boolean(state.parity) &&
    Boolean(state.mix) &&
    Boolean(roleComplete);

  const toRequiredInputs = (): Required<Inputs> | null => {
    if (
      !complete ||
      !state.company ||
      !state.location ||
      !state.parity ||
      !state.mix ||
      !state.role ||
      typeof state.role.hasPNL !== "boolean" ||
      !state.role.directs
    ) {
      return null;
    }

    return {
      company: state.company,
      location: state.location,
      parity: state.parity,
      mix: state.mix,
      role: {
        hasPNL: state.role.hasPNL,
        directs: state.role.directs
      }
    };
  };

  const currentStep = steps[stepIndex];

  const goToNext = () => setStepIndex((idx) => Math.min(idx + 1, steps.length - 1));
  const goToPrev = () => setStepIndex((idx) => Math.max(idx - 1, 0));

  const handlePrimary = () => {
    if (stepIndex < steps.length - 1) {
      goToNext();
      return;
    }
    const payload = toRequiredInputs();
    if (!payload) return;
    startTransition(async () => {
      try {
        setError(null);
        const result = await onGenerate(payload);
        setOutput(result);
        writeJSON(LS_OUT, result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate bands.");
      }
    });
  };

  const handleReset = () => {
    dispatch({ type: "reset" });
    setOutput(null);
    setError(null);
    setStepIndex(0);
    removeKey(LS_KEY);
    removeKey(LS_OUT);
  };

  const renderStep = () => {
    switch (currentStep.key) {
      case "company":
        return (
          <StepCompany
            value={state.company}
            onSelect={(value) => dispatch({ type: "setCompany", value })}
          />
        );
      case "role":
        return (
          <StepRoleScope
            value={state.role}
            bandSelection={state.roleBand}
            onChange={(value) => dispatch({ type: "setRole", value })}
            onBandChange={(value) => dispatch({ type: "setRoleBand", value })}
          />
        );
      case "location":
        return (
          <StepLocation
            value={state.location}
            onSelect={(value) => dispatch({ type: "setLocation", value })}
          />
        );
      case "parity":
        return (
          <StepParity
            value={state.parity}
            onSelect={(value) => dispatch({ type: "setParity", value })}
          />
        );
      case "mix":
      default:
        return (
          <StepCashEquity
            value={state.mix}
            onSelect={(value) => dispatch({ type: "setMix", value })}
          />
        );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Section title="Progress" subtitle="Step through each input bucket to unlock the Farient band.">
        <ol className="flex flex-wrap gap-3 text-sm">
          {steps.map((step, idx) => {
            const status = idx < stepIndex ? "complete" : idx === stepIndex ? "current" : "upcoming";
            return (
              <li key={step.key}>
                <span className={`badge ${cnStepper(status)}`}>
                  <span className="font-semibold">{idx + 1}</span>
                  <span>{step.label}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </Section>

      <div className="space-y-4">
        {renderStep()}
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={handlePrimary}
            disabled={isPending || (stepIndex === steps.length - 1 && !complete)}
            className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {stepIndex === steps.length - 1 ? (isPending ? "Generating..." : "Generate bands") : "Next"}
          </button>
          <button
            type="button"
            onClick={goToPrev}
            disabled={stepIndex === 0 || isPending}
            className="btn btn-ghost disabled:cursor-not-allowed disabled:opacity-60"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={isPending}
            className="btn btn-ghost text-slate-600 dark:text-slate-300 disabled:opacity-60"
          >
            Reset
          </button>
        </div>
      </div>

      {output ? (
        <Section title="Output Format" subtitle="Farient-ready table with bands + tradeoffs.">
          <OutputTable output={output} />
        </Section>
      ) : null}
    </div>
  );
}

function cnStepper(status: "complete" | "current" | "upcoming") {
  if (status === "complete") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (status === "current") {
    return "border-slate-900 bg-slate-900 text-white";
  }
  return "border-slate-200 bg-card text-slate-500";
}
