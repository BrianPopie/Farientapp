import type { AssistantPanelBands, AssistantPanelEvidence, AssistantPanelKpi } from "./types";

type ContextChip = { label: string; value: string };

export type AssistantPanelProps = {
  title: string;
  subtitle?: string;
  contextChips?: ContextChip[];
  kpis?: AssistantPanelKpi[];
  bands?: AssistantPanelBands;
  materialGaps?: string[];
  tradeoffs?: string[];
  actions?: string[];
  evidence?: AssistantPanelEvidence[];
};

export function AssistantPanel(props: AssistantPanelProps) {
  const { title, subtitle, contextChips, kpis, bands, materialGaps, tradeoffs, actions, evidence } = props;

  return (
    <div className="rounded-2xl border border-border bg-card/80 px-5 py-4 text-text shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-white supports-[backdrop-filter]:bg-card/70">
      <div className="mb-3 space-y-2">
        <div>
          <h3 className="text-[15px] font-semibold leading-6 text-text dark:text-white">{title}</h3>
          {subtitle ? <p className="text-sm text-slate-500 dark:text-slate-300">{subtitle}</p> : null}
        </div>
        {contextChips?.length ? (
          <div className="flex flex-wrap gap-2">
            {contextChips.map((chip) => (
              <span
                key={`${chip.label}-${chip.value}`}
                className="inline-flex items-center rounded-full border border-border bg-white/70 px-3 py-1 text-xs text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
              >
                <span className="text-slate-500 dark:text-white/60">{chip.label}:</span>&nbsp;{chip.value}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {kpis?.length ? (
        <div className="mb-4 grid grid-cols-1 gap-3 text-text sm:grid-cols-3 dark:text-white">
          {kpis.map((kpi, index) => (
            <div
              key={`${kpi.label}-${index}`}
              className="rounded-xl border border-border bg-white/70 px-3 py-2 shadow-inner dark:border-white/10 dark:bg-white/5"
            >
              <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{kpi.label}</div>
              <div className="text-[15px] font-medium text-slate-900 dark:text-white">{kpi.value}</div>
              {kpi.help ? <div className="text-[11px] text-slate-500 dark:text-slate-400">{kpi.help}</div> : null}
            </div>
          ))}
        </div>
      ) : null}

      {bands ? (
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label="Base" value={bands.base} />
          <Stat label="Bonus" value={bands.bonus} />
          <Stat label="Equity / LTI" value={bands.lti} />
        </div>
      ) : null}

      <PanelSection title="Material gaps vs peers" items={materialGaps} />
      <PanelSection title="Pay-mix tradeoffs" items={tradeoffs} />
      <PanelSection title="Recommended actions (30-60 days)" items={actions} ordered />

      {evidence?.length ? (
        <div className="mt-4 rounded-xl border border-border bg-white/60 p-3 dark:border-white/10 dark:bg-white/[0.03]">
          <div className="mb-2 text-[12px] font-semibold tracking-wide text-slate-500 dark:text-slate-400">
            Evidence (mock)
          </div>
          <ul className="space-y-1">
            {evidence.map((item, index) => (
              <li
                key={`${item.label}-${index}`}
                className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"
              >
                <span className="inline-flex rounded-full border border-border bg-white/70 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
                  {item.source}
                </span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

    </div>
  );
}

function PanelSection({ title, items, ordered }: { title: string; items?: string[]; ordered?: boolean }) {
  if (!items?.length) return null;

  if (ordered) {
    return (
      <div className="mt-3">
        <div className="mb-1 text-[12px] font-semibold tracking-wide text-slate-500 dark:text-slate-400">{title}</div>
        <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-6 text-slate-700 dark:text-slate-200">
          {items.map((item, index) => (
            <li key={`${title}-${index}`} className="relative">
              {item}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="mb-1 text-[12px] font-semibold tracking-wide text-slate-500 dark:text-slate-400">{title}</div>
      <ul className="space-y-1.5 text-sm leading-6 text-slate-700 dark:text-slate-200">
        {items.map((item, index) => (
          <li key={`${title}-${index}`} className="relative pl-4">
            <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-[rgba(120,130,255,0.7)] dark:bg-[rgba(120,130,255,0.9)]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-white/70 px-3 py-2 text-slate-900 shadow-inner dark:border-white/10 dark:bg-white/5 dark:text-white">
      <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="text-[15px] font-medium">{value}</div>
    </div>
  );
}
