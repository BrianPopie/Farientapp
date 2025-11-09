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
        <div key={kpi.label} className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{kpi.label}</p>
          <p className="mt-1 text-2xl font-semibold">{kpi.value}</p>
          {kpi.helper && <p className="text-xs text-muted-foreground">{kpi.helper}</p>}
        </div>
      ))}
    </div>
  );
}
