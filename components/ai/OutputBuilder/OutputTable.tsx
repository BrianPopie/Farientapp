import { Output } from "@/lib/farient/types";

export default function OutputTable({ output }: { output: Output }) {
  return (
    <div className="mt-2">
      <div className="mt-3 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-[rgb(var(--bg))]">
            <tr className="text-slate-700 dark:text-slate-200">
              <th className="p-3 text-left">Component</th>
              <th className="p-3 text-left">Recommended Band</th>
              <th className="p-3 text-left">Notes / Tradeoffs</th>
            </tr>
          </thead>
          <tbody className="[&_tr]:border-t [&_tr]:border-border">
            <tr>
              <td className="p-3 font-medium text-slate-700 dark:text-slate-200">Base Salary</td>
              <td className="p-3 text-slate-700 dark:text-slate-100">
                ${output.baseMin.toLocaleString()} – ${output.baseMax.toLocaleString()}
              </td>
              <td className="p-3 text-slate-600 dark:text-slate-400">
                Relative to market percentile + location factor
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-slate-700 dark:text-slate-200">Target Bonus</td>
              <td className="p-3 text-slate-700 dark:text-slate-100">{output.bonusPct}% of base</td>
              <td className="p-3 text-slate-600 dark:text-slate-400">With clarity on variable comp conditions</td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-slate-700 dark:text-slate-200">Equity / LTI</td>
              <td className="p-3 text-slate-700 dark:text-slate-100">
                ${output.ltiAnnual.toLocaleString()} TDC value (annualized)
              </td>
              <td className="p-3 text-slate-600 dark:text-slate-400">Vehicle type + vesting schedule</td>
            </tr>
          </tbody>
        </table>
      </div>
      {output.notes?.length ? (
        <ul className="mt-3 list-disc pl-6 text-sm text-slate-600 dark:text-slate-400">
          {output.notes.map((note, idx) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
