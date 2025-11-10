import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  description?: string;
  value: string;
  delta?: {
    label: string;
    positive?: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
};

export function StatCard({ title, description, value, delta, icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "bento-card flex min-h-[150px] flex-col justify-between space-y-2 border border-border bg-surface p-6 text-text shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[0.85rem] font-medium uppercase tracking-wide text-text-muted">{title}</p>
          {description && <p className="text-sm text-text-muted">{description}</p>}
        </div>
        {icon && <div className="rounded-2xl bg-muted/60 p-3 text-accent">{icon}</div>}
      </div>
      <div className="text-[2.1rem] font-semibold leading-tight text-text">{value}</div>
      {delta && (
        <p className="text-xs text-text-muted">
          <span className={delta.positive ? "text-success" : "text-danger"}>{delta.label}</span>
        </p>
      )}
    </div>
  );
}
