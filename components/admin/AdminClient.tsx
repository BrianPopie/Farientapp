"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BodyText, Kicker, PageHeading } from "@/components/ui/typography";

const controls = [
  {
    id: "role",
    title: "Role band access",
    detail: "Limit which teams can edit benchmarks for C-suite minus CEO, P&L, critical tech, and successor roles.",
    action: "Manage policies"
  },
  {
    id: "workflow",
    title: "Workflow presets",
    detail: "Toggle ingestion, chatbot, and report templates for each client pod. Mock switches only.",
    action: "Review presets"
  },
  {
    id: "audit",
    title: "Audit log",
    detail: "Track who injected AI insights into one-pagers and when citations were refreshed.",
    action: "Open log"
  }
];

type AdminClientProps = {
  subtitle: string;
};

export function AdminClient({ subtitle }: AdminClientProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [busyControl, setBusyControl] = useState<string | null>(null);

  const triggerMock = (controlId: string) => {
    setBusyControl(controlId);
    const control = controls.find((c) => c.id === controlId);
    if (!control) return;

    setTimeout(() => {
      setStatus(`${control.title} synced with latest mock policies.`);
      setBusyControl(null);
      setTimeout(() => setStatus(null), 3000);
    }, 700);
  };

  return (
    <div className="space-y-8 text-foreground">
      <div className="flex flex-col gap-3">
        <Kicker>Workspace controls</Kicker>
        <PageHeading>Admin console</PageHeading>
        <BodyText muted>{subtitle}</BodyText>
      </div>

      {status ? (
        <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{status}</div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {controls.map((control) => (
          <Card key={control.title} className="border-border/80 bg-card shadow-elev-0">
            <CardHeader>
              <CardTitle className="text-lg">{control.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{control.detail}</p>
              <Button
                variant="secondary"
                className={cn("w-full rounded-full focus-ring")}
                disabled={Boolean(busyControl)}
                onClick={() => triggerMock(control.id)}
              >
                {busyControl === control.id ? "Syncing…" : control.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
