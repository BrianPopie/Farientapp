import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className={cn("relative h-full overflow-hidden bg-gradient-to-br from-white/5 to-white/0", className)} glow>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_55%)]" />
      <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {icon && <div className="rounded-2xl bg-white/5 p-3 text-primary">{icon}</div>}
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-semibold">{value}</div>
        {delta && (
          <p className="text-sm text-muted-foreground">
            <span className={delta.positive ? "text-emerald-300" : "text-rose-300"}>{delta.label}</span> vs. peers
          </p>
        )}
      </CardContent>
    </Card>
  );
}
