"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const roles = [
  { role: "Admin", owner: "Brian", status: "Active" },
  { role: "Engineering", owner: "Dom / Aris", status: "Active" },
  { role: "Design", owner: "Rodj", status: "Active" },
  { role: "QA", owner: "TBD", status: "Pending" }
];

const integrations = [
  { name: "Google Slides", connected: false },
  { name: "Google Docs", connected: false },
  { name: "Slack Webhook", connected: true },
  { name: "Salesforce", connected: false },
  { name: "Email Digest", connected: true }
];

export default function AdminPage() {
  const [policyYear, setPolicyYear] = React.useState("2026");
  const [peerSet, setPeerSet] = React.useState("HelioDyne, Nordessa, VastWind, Polar Grid");
  const [template, setTemplate] = React.useState("## Highlights\n- TSR vs peers\n- Pay mix\n- Policy deltas");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Capability 07</p>
        <h1 className="text-3xl font-semibold">Administrative & integrations</h1>
        <p className="text-muted-foreground">Connect SSO, override peer sets, manage templates, and view system health.</p>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>SSO & roles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {roles.map((role) => (
              <div key={role.role} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
                <div>
                  <p className="text-sm font-semibold">{role.role}</p>
                  <p className="text-xs text-muted-foreground">{role.owner}</p>
                </div>
                <Badge variant={role.status === "Active" ? "success" : "warning"}>{role.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Overrides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Policy year</p>
              <Select value={policyYear} onValueChange={setPolicyYear}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Peer-set editor</p>
              <Textarea value={peerSet} onChange={(event) => setPeerSet(event.target.value)} className="mt-1" />
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Template markdown</p>
              <Textarea value={template} onChange={(event) => setTemplate(event.target.value)} className="mt-1" />
            </div>
            <Button variant="ghost" className="w-full">
              Save overrides
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System health</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs uppercase text-muted-foreground">Rate limit</p>
              <p className="text-2xl font-semibold">62%</p>
              <p className="text-xs text-muted-foreground">Auto backoff enabled</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs uppercase text-muted-foreground">Retry queue</p>
              <p className="text-2xl font-semibold">4 jobs</p>
              <p className="text-xs text-muted-foreground">Last failure 7m ago</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs uppercase text-muted-foreground">Audit log</p>
              <p className="text-2xl font-semibold">132 events</p>
              <p className="text-xs text-muted-foreground">View in Supabase</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs uppercase text-muted-foreground">Extraction accuracy</p>
              <p className="text-2xl font-semibold">96.8%</p>
              <p className="text-xs text-muted-foreground">QA trend +1.2%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {integrations.map((integration) => (
              <div key={integration.name} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
                <div>
                  <p className="text-sm font-semibold">{integration.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {integration.connected ? "Connected - click to disconnect" : "Not connected - mocked"}
                  </p>
                </div>
                <Switch checked={integration.connected} onCheckedChange={() => {}} aria-label={`${integration.name} toggle`} />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
