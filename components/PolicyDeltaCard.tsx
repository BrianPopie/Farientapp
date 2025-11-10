import { Card, CardContent } from "@/components/ui/card";
import type { PolicyDelta } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

type PolicyDeltaCardProps = {
  delta: PolicyDelta;
};

export function PolicyDeltaCard({ delta }: PolicyDeltaCardProps) {
  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-text">{delta.section}</p>
          <Badge variant="outline">
            {delta.yearFrom} ? {delta.yearTo}
          </Badge>
        </div>
        <p className="text-xs uppercase tracking-wide text-text-muted">{delta.firm}</p>
        <p className="text-sm text-text-muted">{delta.changeSummary}</p>
      </CardContent>
    </Card>
  );
}
