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
        "rounded-xl bg-card ring-1 ring-border p-6 card-glow flex min-h-[140px] flex-col justify-between space-y-2",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {description && <p className="text-xs text-muted-foreground/80">{description}</p>}
        </div>
        {icon && <div className="rounded-2xl bg-muted/40 p-3 text-primary">{icon}</div>}
      </div>
      <div className="text-3xl font-semibold text-foreground">{value}</div>
      {delta && (
        <p className="text-xs text-muted-foreground">
          <span className={delta.positive ? "text-success" : "text-danger"}>{delta.label}</span>
        </p>
      )}
    </div>
  );
}
