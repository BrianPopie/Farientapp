"use client";

const HANDOFFS = [
  { id: "pep", owner: "IR", task: "Prep board-ready P4P appendix", due: "Nov 18", status: "In progress" },
  { id: "benchmark", owner: "Comp team", task: "Refresh CFO peer file", due: "Nov 20", status: "Queued" },
  { id: "offer", owner: "TA", task: "Align offer letter with Farient bands", due: "Nov 22", status: "Blocked" }
];

export default function Handoffs() {
  return (
    <section className="card space-y-3 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Hand-offs</p>
        <span className="text-xs text-slate-400">Owners + due dates</span>
      </div>
      <ul className="space-y-2 text-sm">
        {HANDOFFS.map((handoff) => (
          <li key={handoff.id} className="rounded-xl border border-border bg-card/70 px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-100">{handoff.task}</span>
              <span className="text-xs text-slate-500">{handoff.due}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>{handoff.owner}</span>
              <span className={statusClass(handoff.status)}>{handoff.status}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function statusClass(status: string) {
  switch (status) {
    case "In progress":
      return "text-emerald-600";
    case "Queued":
      return "text-slate-500";
    case "Blocked":
      return "text-red-500";
    default:
      return "text-slate-500";
  }
}
