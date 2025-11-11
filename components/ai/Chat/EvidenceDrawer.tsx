"use client";

const MOCK_EVIDENCE = [
  {
    id: "def14a",
    title: "DEF 14A — MidCap Industrial (2024)",
    source: "mock: DEF 14A",
    summary: "CFO base at $640K, 75% bonus, mix tilts cash-heavy due to leverage targets."
  },
  {
    id: "proxy",
    title: "Proxy — Growth SaaS (2023)",
    source: "mock: Proxy",
    summary: "Equity refresh moved to PSU/RSU 60/40 split; P4P disclosure tied to ARR milestones."
  },
  {
    id: "transcript",
    title: "Earnings call — Consumer (Q2)",
    source: "mock: Transcript",
    summary: "CEO flagged leadership bench rebuild; expect governance pressure on comp mix."
  }
];

export default function EvidenceDrawer() {
  return (
    <section className="card space-y-3 p-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Evidence</p>
        <p className="text-sm text-slate-600 dark:text-slate-300">Mock citations the copilot can reference on demand.</p>
      </div>
      <div className="space-y-3">
        {MOCK_EVIDENCE.map((item) => (
          <article key={item.id} className="rounded-xl border border-border bg-card/70 p-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.source}</p>
              </div>
              <button
                type="button"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                onClick={() => copyEvidence(item)}
              >
                Copy
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">{item.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function copyEvidence(entry: (typeof MOCK_EVIDENCE)[number]) {
  try {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    void navigator.clipboard.writeText(`${entry.source} — ${entry.summary}`);
  } catch {
    // ignore
  }
}
