"use client";

import type { Output } from "@/lib/farient/types";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

type OutputTableProps = {
  output: Output;
};

export function OutputTable({ output }: OutputTableProps) {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-text-muted">
            <tr>
              <th className="px-4 py-3">Component</th>
              <th className="px-4 py-3">Recommended Band</th>
              <th className="px-4 py-3">Notes / Tradeoffs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-text">
            <tr>
              <td className="px-4 py-4 font-medium">Base Salary</td>
              <td className="px-4 py-4">{`${currency.format(output.baseMin)} – ${currency.format(output.baseMax)}`}</td>
              <td className="px-4 py-4 text-sm text-text-muted">
                Relative to market percentile + location factor
              </td>
            </tr>
            <tr>
              <td className="px-4 py-4 font-medium">Target Bonus</td>
              <td className="px-4 py-4">{`${output.bonusPct}% of base`}</td>
              <td className="px-4 py-4 text-sm text-text-muted">
                With clarity on variable comp conditions
              </td>
            </tr>
            <tr>
              <td className="px-4 py-4 font-medium">Equity / LTI</td>
              <td className="px-4 py-4">{`${currency.format(output.ltiAnnual)} TDC value (annualized)`}</td>
              <td className="px-4 py-4 text-sm text-text-muted">
                Vehicle type + vesting schedule
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <p className="text-sm font-semibold text-text">Why this band?</p>
        <ul className="mt-3 space-y-2 text-sm text-text-muted">
          {output.notes.map((note, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="text-accent">•</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
