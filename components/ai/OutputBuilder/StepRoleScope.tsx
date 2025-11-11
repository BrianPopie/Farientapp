"use client";

import { useMemo } from "react";
import { RoleScope } from "@/lib/farient/types";
import { cn } from "@/lib/utils";
import { ROLE_BANDS } from "@/lib/roles";
import type { RoleBandSelection } from "./state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

type RoleDraft = Partial<RoleScope>;

type StepRoleScopeProps = {
  value?: RoleDraft;
  bandSelection?: RoleBandSelection;
  onChange: (value: RoleDraft) => void;
  onBandChange: (value: RoleBandSelection) => void;
};

const DIRECT_OPTIONS: RoleScope["directs"][] = ["<5", "5-15", "15-50", "50-100", "100+"];

export default function StepRoleScope({
  value,
  bandSelection,
  onChange,
  onBandChange
}: StepRoleScopeProps) {
  const activeHasPNL = value?.hasPNL;
  const activeDirects = value?.directs;

  const selectedBand = useMemo(() => {
    if (!bandSelection?.bandKey) return undefined;
    return ROLE_BANDS.find((band) => band.key === bandSelection.bandKey);
  }, [bandSelection?.bandKey]);

  const description = useMemo(() => {
    if (activeHasPNL === undefined || !activeDirects) return "Capture P&L ownership and leadership span.";
    const pnl = activeHasPNL ? "owns" : "does not own";
    return `Role ${pnl} a P&L with ${activeDirects} directs.`;
  }, [activeHasPNL, activeDirects]);

  const update = (patch: RoleDraft) => onChange({ ...(value ?? {}), ...patch });

  const handleBandChange = (bandKey: string) => {
    const target = ROLE_BANDS.find((band) => band.key === bandKey) ?? ROLE_BANDS[0];
    onBandChange({ bandKey: target.key, roleLabel: target.roles[0] });
  };

  const handleRoleChange = (roleLabel: string) => {
    const key = selectedBand?.key ?? ROLE_BANDS[0].key;
    onBandChange({ bandKey: key, roleLabel });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">Role band</p>
        <div className="mt-2">
          <Select value={bandSelection?.bandKey} onValueChange={handleBandChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role band" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_BANDS.map((band) => (
                <SelectItem key={band.key} value={band.key}>
                  {band.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {selectedBand?.why ?? "Choose the band that best matches the leadership archetype."}
          </p>
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
            Specific role
          </p>
          <Select
            value={bandSelection?.roleLabel}
            onValueChange={handleRoleChange}
            disabled={!selectedBand}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {(selectedBand?.roles ?? []).map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
          P&L ownership
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          {[true, false].map((option) => (
            <button
              key={String(option)}
              type="button"
              onClick={() => update({ hasPNL: option })}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                activeHasPNL === option
                  ? "border-emerald-600 bg-emerald-600/15 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-400/20 dark:text-emerald-100"
                  : "border-slate-200 text-slate-600 hover:border-emerald-200 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-400"
              )}
            >
              {option ? "Owns a P&L" : "No P&L"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">Direct reports</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {DIRECT_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => update({ directs: option })}
              className={cn(
                "rounded-xl border px-3 py-3 text-sm transition",
                activeDirects === option
                  ? "border-blue-600 bg-blue-600/15 text-blue-700 dark:border-blue-400 dark:bg-blue-400/20 dark:text-blue-100"
                  : "border-slate-200 text-slate-600 hover:border-blue-200 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-400"
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
