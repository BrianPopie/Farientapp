"use client";

import { useCallback, useReducer } from "react";
import { WizardStepper } from "@/components/CompWizard/Stepper";
import { StepCompany } from "@/components/CompWizard/StepCompany";
import { StepRoleScope } from "@/components/CompWizard/StepRoleScope";
import { StepLocation } from "@/components/CompWizard/StepLocation";
import { StepParity } from "@/components/CompWizard/StepParity";
import { StepCashEquity } from "@/components/CompWizard/StepCashEquity";
import { OutputTable } from "@/components/CompWizard/OutputTable";
import type {
  CashEquityPref,
  CompanySize,
  Inputs,
  LocationTier,
  Output,
  ParityRule,
  WizardAnswers,
  WizardRoleScope
} from "@/lib/farient/types";
import { Button } from "@/components/ui/button";

const steps = ["Company Size", "Role Scope", "Location Tier", "Internal Parity", "Cash vs Equity"];

type Step = 1 | 2 | 3 | 4 | 5;

type CollectState = {
  mode: "collect";
  step: Step;
  answers: WizardAnswers;
  submitting: boolean;
  error: string | null;
};

type CompleteState = {
  mode: "complete";
  answers: Required<Inputs>;
  output: Output;
  submitting: boolean;
  error: string | null;
};

type WizardState = CollectState | CompleteState;

type Action =
  | { type: "setCompany"; value: CompanySize }
  | { type: "setRole"; value: WizardRoleScope }
  | { type: "setLocation"; value: LocationTier }
  | { type: "setParity"; value: ParityRule }
  | { type: "setMix"; value: CashEquityPref }
  | { type: "next" }
  | { type: "back" }
  | { type: "submitting" }
  | { type: "success"; inputs: Required<Inputs>; output: Output }
  | { type: "error"; message: string }
  | { type: "edit" }
  | { type: "regenerateStart" }
  | { type: "regenerateSuccess"; output: Output };

const initialState: CollectState = {
  mode: "collect",
  step: 1,
  answers: {
    role: { hasPNL: null, directs: null }
  },
  submitting: false,
  error: null
};

function reducer(state: WizardState, action: Action): WizardState {
  switch (action.type) {
    case "setCompany":
      if (state.mode !== "collect") return state;
      return { ...state, answers: { ...state.answers, company: action.value }, error: null };
    case "setRole":
      if (state.mode !== "collect") return state;
      return { ...state, answers: { ...state.answers, role: action.value }, error: null };
    case "setLocation":
      if (state.mode !== "collect") return state;
      return { ...state, answers: { ...state.answers, location: action.value }, error: null };
    case "setParity":
      if (state.mode !== "collect") return state;
      return { ...state, answers: { ...state.answers, parity: action.value }, error: null };
    case "setMix":
      if (state.mode !== "collect") return state;
      return { ...state, answers: { ...state.answers, mix: action.value }, error: null };
    case "next":
      if (state.mode !== "collect") return state;
      return { ...state, step: (state.step >= 5 ? 5 : ((state.step + 1) as Step)) };
    case "back":
      if (state.mode !== "collect") return state;
      return { ...state, step: (state.step <= 1 ? 1 : ((state.step - 1) as Step)) };
    case "submitting":
      return { ...state, submitting: true, error: null };
    case "success":
      return {
        mode: "complete",
        answers: action.inputs,
        output: action.output,
        submitting: false,
        error: null
      };
    case "error":
      return { ...state, submitting: false, error: action.message };
    case "edit":
      if (state.mode !== "complete") return state;
      return {
        mode: "collect",
        step: 1,
        answers: {
          company: state.answers.company,
          location: state.answers.location,
          parity: state.answers.parity,
          mix: state.answers.mix,
          role: {
            hasPNL: state.answers.role.hasPNL,
            directs: state.answers.role.directs
          }
        },
        submitting: false,
        error: null
      };
    case "regenerateStart":
      if (state.mode !== "complete") return state;
      return { ...state, submitting: true, error: null };
    case "regenerateSuccess":
      if (state.mode !== "complete") return state;
      return { ...state, output: action.output, submitting: false, error: null };
    default:
      return state;
  }
}

type WizardProps = {
  onGenerate: (inputs: Required<Inputs>) => Promise<Output>;
};

export function CompWizard({ onGenerate }: WizardProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const toInputs = useCallback((answers: WizardAnswers): (Required<Inputs>) | null => {
    if (
      !answers.company ||
      !answers.location ||
      !answers.parity ||
      !answers.mix ||
      !answers.role ||
      answers.role.hasPNL === null ||
      answers.role.directs === null
    ) {
      return null;
    }
    return {
      company: answers.company,
      location: answers.location,
      parity: answers.parity,
      mix: answers.mix,
      role: {
        hasPNL: answers.role.hasPNL,
        directs: answers.role.directs
      }
    } as Required<Inputs>;
  }, []);

  const handleGenerate = useCallback(
    async (inputs: Required<Inputs>) => {
      dispatch({ type: "submitting" });
      try {
        const output = await onGenerate(inputs);
        dispatch({ type: "success", inputs, output });
      } catch (error) {
        dispatch({
          type: "error",
          message: error instanceof Error ? error.message : "Unable to generate bands right now."
        });
      }
    },
    [onGenerate]
  );

  const handleRegenerate = useCallback(async () => {
    if (state.mode !== "complete") return;
    dispatch({ type: "regenerateStart" });
    try {
      const output = await onGenerate(state.answers);
      dispatch({ type: "regenerateSuccess", output });
    } catch (error) {
      dispatch({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to regenerate bands."
      });
    }
  }, [onGenerate, state]);

  const renderStep = () => {
    if (state.mode !== "collect") {
      return null;
    }
    switch (state.step) {
      case 1:
        return (
          <StepCompany
            value={state.answers.company}
            onSelect={(value) => dispatch({ type: "setCompany", value })}
          />
        );
      case 2:
        return (
          <StepRoleScope
            value={state.answers.role}
            onChange={(value) => dispatch({ type: "setRole", value })}
          />
        );
      case 3:
        return (
          <StepLocation
            value={state.answers.location}
            onSelect={(value) => dispatch({ type: "setLocation", value })}
          />
        );
      case 4:
        return (
          <StepParity
            value={state.answers.parity}
            onSelect={(value) => dispatch({ type: "setParity", value })}
          />
        );
      case 5:
        return (
          <StepCashEquity
            value={state.answers.mix}
            onSelect={(value) => dispatch({ type: "setMix", value })}
          />
        );
      default:
        return null;
    }
  };

  const canProceed =
    state.mode === "collect" &&
    (() => {
      switch (state.step) {
        case 1:
          return Boolean(state.answers.company);
        case 2:
          return state.answers.role.hasPNL !== null && state.answers.role.directs !== null;
        case 3:
          return Boolean(state.answers.location);
        case 4:
          return Boolean(state.answers.parity);
        case 5:
          return Boolean(state.answers.mix);
        default:
          return false;
      }
    })();

  const handleNext = async () => {
    if (state.mode !== "collect") return;
    if (state.step < 5) {
      dispatch({ type: "next" });
      return;
    }
    const inputs = toInputs(state.answers);
    if (!inputs) return;
    await handleGenerate(inputs);
  };

  return (
    <section className="rounded-3xl border border-border bg-surface/95 p-6 shadow-sm">
      <div className="space-y-4">
        <WizardStepper
          steps={steps}
          current={state.mode === "complete" ? steps.length : state.step}
        />
        {state.mode === "collect" ? (
          <div className="space-y-6">
            {renderStep()}
            {state.error && <p className="text-sm text-danger">{state.error}</p>}
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={state.step === 1 || state.submitting}
                onClick={() => dispatch({ type: "back" })}
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canProceed || state.submitting}
              >
                {state.step === 5 ? (state.submitting ? "Generating..." : "Generate bands") : "Next"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <OutputTable output={state.output} />
            {state.error && <p className="text-sm text-danger">{state.error}</p>}
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => dispatch({ type: "edit" })}
                disabled={state.submitting}
              >
                Edit inputs
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleRegenerate}
                disabled={state.submitting}
              >
                {state.submitting ? "Regenerating..." : "Regenerate bands"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
