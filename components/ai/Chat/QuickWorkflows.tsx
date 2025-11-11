"use client";

import type { Inputs, Output } from "@/lib/farient/types";

type QuickWorkflowsProps = {
  inputs?: Inputs;
  bands?: Output;
  roleBandSummary?: string;
  disabled?: boolean;
  onSelect: (prompt: string) => void;
};

type Workflow = {
  label: string;
  description: string;
  build: (inputs?: Inputs, bands?: Output, roleBandSummary?: string) => string;
};

const WORKFLOWS: Workflow[] = [
  {
    label: "Benchmark CFO vs mid-cap peers",
    description: "Pay mix + TSR framing",
    build: (inputs, bands, roleBandSummary) => {
      const context = describeInputs(inputs);
      const mix = bands ? describeBands(bands) : "no band data yet";
      const roleBand = roleBandSummary ? ` Role band: ${roleBandSummary}.` : "";
      return `Benchmark the CFO role (${context}) against public mid-cap peers.${roleBand} Highlight pay mix vs TSR plus ${mix}, and call out any material gaps or next actions.`;
    }
  },
  {
    label: "P4P alignment (COO)",
    description: "3-year story",
    build: (inputs, bands, roleBandSummary) => {
      const context = describeInputs(inputs);
      const band = bands
        ? `Base range ${currency(bands.baseMin)}–${currency(bands.baseMax)}, bonus ${bands.bonusPct}%`
        : "no computed band yet";
      const roleBand = roleBandSummary ? ` Role band: ${roleBandSummary}.` : "";
      return `Assess pay-for-performance alignment for the COO (${context}).${roleBand} Use the last 3 fiscal years, weave in ${band}, and recommend governance talking points.`;
    }
  },
  {
    label: "Comp committee prep",
    description: "Slides outline",
    build: (inputs, bands, roleBandSummary) => {
      const context = describeInputs(inputs);
      const tilt = inputs?.mix === "FavorEquity" ? "equity-heavy" : inputs?.mix === "FavorCash" ? "cash-heavy" : "balanced";
      const band = bands ? describeBands(bands) : "banding still pending";
      const roleBand = roleBandSummary ? `Role band: ${roleBandSummary}. ` : "";
      return `Draft a comp committee update outline for the upcoming meeting. ${roleBand}Context: ${context}. Emphasize ${tilt} mix, ${band}, internal parity (${inputs?.parity ?? "unspecified"}), and what diligence is still outstanding.`;
    }
  },
  {
    label: "Offer calibration",
    description: "Candidate-facing",
    build: (_inputs, bands, roleBandSummary) => {
      const band = bands
        ? `${currency(bands.baseMin)}–${currency(bands.baseMax)} base, ${bands.bonusPct}% bonus, ${currency(
            bands.ltiAnnual
          )} LTI`
        : "band TBD";
      const roleBand = roleBandSummary ? ` Role band: ${roleBandSummary}.` : "";
      return `Help me position this offer with a candidate.${roleBand} The current Farient band is ${band}. Outline the tradeoffs, negotiation flex, and any parity guardrails.`;
    }
  }
];

export default function QuickWorkflows({ inputs, bands, roleBandSummary, disabled, onSelect }: QuickWorkflowsProps) {
  return (
    <section className="card space-y-4 p-4 lg:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
            Quick workflows
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Seed the copilot with a structured ask that references stored context.
          </p>
        </div>
        {!inputs || !bands ? (
          <span className="text-xs text-amber-600">Add inputs + bands to unlock full prompts</span>
        ) : null}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {WORKFLOWS.map((workflow) => (
          <button
            key={workflow.label}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(workflow.build(inputs, bands, roleBandSummary))}
            className="rounded-xl border border-border bg-card/80 px-4 py-3 text-left text-sm shadow-soft transition hover:border-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="font-semibold text-slate-800 dark:text-slate-100">{workflow.label}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">{workflow.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function describeInputs(inputs?: Inputs) {
  if (!inputs) return "context still missing";
  const parts: string[] = [];
  if (inputs.company) parts.push(inputs.company);
  if (inputs.role) {
    parts.push(inputs.role.hasPNL ? "owns P&L" : "no P&L");
    if (inputs.role.directs) parts.push(`${inputs.role.directs} directs`);
  }
  if (inputs.location) parts.push(inputs.location.replace(/_/g, " "));
  return parts.join(" · ") || "context still missing";
}

function describeBands(bands: Output) {
  return `${currency(bands.baseMin)}–${currency(bands.baseMax)} base, ${bands.bonusPct}% bonus, ${currency(
    bands.ltiAnnual
  )} LTI`;
}

function currency(value: number) {
  return `$${value.toLocaleString()}`;
}
