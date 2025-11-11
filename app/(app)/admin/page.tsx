"use client";

import { DataBadge } from "@/components/DataBadge";
import { PageHeading, BodyText } from "@/components/ui/typography";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

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

export default function AdminPage() {
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
    <div className="space-y-8 text-text">
      <div className="flex flex-col gap-2">
        <DataBadge tone="info">Workspace controls</DataBadge>
        <PageHeading>Admin console</PageHeading>
        <BodyText muted>
          Manage access, feature flags, and audit trails around the non-CEO roles focus. All switches below are mock-only for demo
          purposes.
        </BodyText>
      </div>

      {status ? (
        <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{status}</div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {controls.map((control) => (
          <Card key={control.title} className="border-border/80 bg-surface/90">
            <CardHeader>
              <CardTitle className="text-lg">{control.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-text-muted">{control.detail}</p>
              <Button
                variant="secondary"
                className={cn("w-full rounded-full")}
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
