type KPI = {
  label: string;
  value: string;
  helper?: string;
};

type KPIGroupProps = {
  kpis: KPI[];
};

export function KPIGroup({ kpis }: KPIGroupProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <p className="text-[0.75rem] uppercase tracking-wide text-text-muted">{kpi.label}</p>
          <p className="mt-1 text-2xl font-semibold text-text">{kpi.value}</p>
          {kpi.helper && <p className="text-xs text-text-muted">{kpi.helper}</p>}
        </div>
      ))}
    </div>
  );
}
