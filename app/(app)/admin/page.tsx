"use client";

import { DataBadge } from "@/components/DataBadge";
import { PageHeading, BodyText } from "@/components/ui/typography";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const controls = [
  {
    title: "Role band access",
    detail: "Limit which teams can edit benchmarks for C-suite minus CEO, P&L, critical tech, and successor roles.",
    action: "Manage policies"
  },
  {
    title: "Workflow presets",
    detail: "Toggle ingestion, chatbot, and report templates for each client pod. Mock switches only.",
    action: "Review presets"
  },
  {
    title: "Audit log",
    detail: "Track who injected AI insights into one-pagers and when citations were refreshed.",
    action: "Open log"
  }
];

export default function AdminPage() {
  return (
    <div className="space-y-8 text-text">
      <div className="flex flex-col gap-2">
        <DataBadge tone="info">Workspace controls</DataBadge>
        <PageHeading>Admin console</PageHeading>
        <BodyText muted>
          Manage access, feature flags, and audit trails around the non-CEO roles focus. All switches below are mock-only for demo
          purposes.
        </BodyText>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {controls.map((control) => (
          <Card key={control.title} className="border-border/80 bg-surface/90">
            <CardHeader>
              <CardTitle className="text-lg">{control.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-text-muted">{control.detail}</p>
              <Button variant="secondary" className="w-full rounded-full" disabled>
                {control.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
