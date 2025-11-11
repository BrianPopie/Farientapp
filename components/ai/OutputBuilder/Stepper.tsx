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
import { LS_KEY, LS_OUT, LS_AUTO, readJSON, writeJSON, removeKey } from "../ls";
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

  const missingFields = useMemo(() => {
    const missing: { label: string; hint?: string }[] = [];
    if (!state.company) missing.push({ label: "Company size", hint: "Step 1 – Company size" });
    if (!state.role || typeof state.role.hasPNL !== "boolean")
      missing.push({ label: "P&L ownership", hint: "Step 2 – Role scope" });
    if (!state.role?.directs) missing.push({ label: "Direct reports", hint: "Step 2 – Role scope" });
    if (!state.roleBand?.roleLabel) missing.push({ label: "Role band", hint: "Step 2 – Role scope" });
    if (!state.location) missing.push({ label: "Location tier", hint: "Step 3 – Location" });
    if (!state.parity) missing.push({ label: "Parity guardrails", hint: "Step 4 – Parity" });
    if (!state.mix) missing.push({ label: "Cash vs equity", hint: "Step 5 – Cash vs equity" });
    return missing;
  }, [state.company, state.role, state.roleBand, state.location, state.parity, state.mix]);

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
        writeJSON(LS_AUTO, {
          createdAt: Date.now(),
          inputs: payload,
          output: result,
          roleBand: state.roleBand
        });
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
    <div className="flex flex-col gap-5">
      <Section title="Progress" subtitle="Step through each input bucket to unlock the Farient band.">
        <ol className="flex flex-wrap gap-2 text-sm">
          {steps.map((step, idx) => {
            const status = idx < stepIndex ? "complete" : idx === stepIndex ? "current" : "upcoming";
            return (
              <li key={step.key}>
                <button
                  type="button"
                  onClick={() => setStepIndex(idx)}
                className={`badge transition ${cnStepper(status)} ${
                  idx === stepIndex ? "ring-1 ring-[rgb(var(--accent))]" : "hover:ring-1 hover:ring-[rgb(var(--accent))]/40"
                }`}
              >
                <span className="flex items-center gap-2">
                  {status === "complete" ? (
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400/80 text-[10px] font-bold text-white animate-pulse-check">
                      ✓
                    </span>
                  ) : null}
                  {step.label}
                </span>
              </button>
            </li>
            );
          })}
        </ol>
      </Section>

      <div className="space-y-4">
        {renderStep()}
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        {stepIndex === steps.length - 1 && !complete && missingFields.length ? (
          <div className="space-y-1 text-xs text-amber-500">
            <p>Complete the following to unlock Generate Insights:</p>
            <ul className="list-disc pl-5">
              {missingFields.map((field) => (
                <li key={field.label}>
                  {field.label}
                  {field.hint ? ` (${field.hint})` : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={handlePrimary}
            disabled={isPending || (stepIndex === steps.length - 1 && !complete)}
          className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {stepIndex === steps.length - 1 ? (isPending ? "Generating..." : "Generate Insights") : "Next"}
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
    return "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-400/60 dark:bg-emerald-900/40 dark:text-emerald-100";
  }
  if (status === "current") {
    return "border-[rgb(var(--accent))] bg-[rgb(var(--accent))] text-white dark:border-white/80 dark:bg-white/10 dark:text-white";
  }
  return "border-border bg-card text-text dark:border-white/15 dark:bg-white/5 dark:text-slate-200";
}
