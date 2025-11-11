import type { Inputs, Output } from "@/lib/farient/types";
import type { RoleBandSelection } from "../OutputBuilder/state";
import { ROLE_BANDS } from "@/lib/roles";

type ContextRailProps = {
  inputs?: Inputs;
  roleBand?: RoleBandSelection;
  bands?: Output;
  ready?: boolean;
};

const LABELS: Record<string, string> = {
  company: "Company size",
  location: "Location tier",
  parity: "Parity rule",
  mix: "Cash vs equity"
};

export function ContextRail({ inputs, roleBand, bands, ready }: ContextRailProps) {
  const summary = [
    roleBand
      ? {
          label: "Role band",
          value: formatRoleBand(roleBand)
        }
      : null,
    inputs?.company ? { label: LABELS.company, value: inputs.company } : null,
    inputs?.location ? { label: LABELS.location, value: formatLocation(inputs.location) } : null,
    inputs?.parity ? { label: LABELS.parity, value: formatParity(inputs.parity) } : null,
    inputs?.mix ? { label: LABELS.mix, value: formatMix(inputs.mix) } : null
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <aside className="flex h-full flex-col gap-4 bg-card/70 px-5 py-6 text-sm text-text lg:sticky lg:top-[72px] dark:text-white">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Context</p>
        <p className="text-sm text-slate-500 dark:text-slate-300">Persisted inputs powering the copilot.</p>
      </div>

      {ready ? null : (
        <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/80 p-3 text-xs text-amber-700 dark:bg-amber-50/10 dark:text-amber-200">
          Complete the builder and generate insights to hydrate this rail.
        </div>
      )}

      {summary.length ? (
        <div className="space-y-3">
          {summary.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-border bg-white/80 px-4 py-3 text-slate-900 shadow-inner dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
            >
              <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-white/60">{item.label}</p>
              <p className="text-sm font-medium">{item.value}</p>
            </div>
          ))}
        </div>
      ) : null}

      {bands ? (
        <div className="rounded-2xl border border-border bg-gradient-to-br from-white/80 to-transparent p-4 text-slate-900 dark:border-white/10 dark:from-white/5 dark:text-white">
          <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-white/60">Recommended band</p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-slate-500 dark:text-white/60">Base</dt>
              <dd className="font-semibold">{`$${bands.baseMin.toLocaleString()} - $${bands.baseMax.toLocaleString()}`}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500 dark:text-white/60">Bonus</dt>
              <dd className="font-semibold">{bands.bonusPct}%</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500 dark:text-white/60">Equity / LTI</dt>
              <dd className="font-semibold">{`$${bands.ltiAnnual.toLocaleString()}`}</dd>
            </div>
          </dl>
        </div>
      ) : null}
    </aside>
  );
}

function formatRoleBand(selection: RoleBandSelection) {
  const label = ROLE_BANDS.find((band) => band.key === selection.bandKey)?.label ?? selection.bandKey;
  return `${label} - ${selection.roleLabel}`;
}

function formatLocation(value: NonNullable<Inputs["location"]>) {
  switch (value) {
    case "Tier1_NY_SF":
      return "Tier 1 (NY/SF)";
    case "Tier2_BOS_DAL_AUS":
      return "Tier 2 (BOS/DAL/AUS)";
    default:
      return "Tier 3 (other)";
  }
}

function formatParity(value: NonNullable<Inputs["parity"]>) {
  return value === "MatchBands" ? "Match existing bands" : "Flexible";
}

function formatMix(value: NonNullable<Inputs["mix"]>) {
  return value === "FavorCash" ? "Favor cash" : "Favor equity";
}
