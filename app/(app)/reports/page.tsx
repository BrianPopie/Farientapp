"use client";

import * as React from "react";
import { ReportPreview } from "@/components/ReportPreview";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function ReportsPage() {
  const [template, setTemplate] = React.useState("Board ready v3");
  const [brandColor, setBrandColor] = React.useState("#3b82f6");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Capability 06</p>
        <h1 className="text-3xl font-semibold">Board-ready report generation</h1>
        <p className="text-muted-foreground">
          Generate one-pagers, benchmark decks, and appendix tables with embedded citations. Buttons below are disabled until you connect
          Google Slides or Docs.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <ReportPreview />
        <Card>
          <CardHeader>
            <CardTitle>Template controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Template</p>
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Board ready v3">Board ready v3</SelectItem>
                  <SelectItem value="Investor lens">Investor lens</SelectItem>
                  <SelectItem value="Audit deep dive">Audit deep dive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Brand color</p>
              <div className="mt-2 flex items-center gap-3">
                <Input
                  type="color"
                  value={brandColor}
                  onChange={(event) => setBrandColor(event.target.value)}
                  className="h-12 w-12 cursor-pointer rounded-2xl border border-border p-1"
                />
                <Input value={brandColor} onChange={(event) => setBrandColor(event.target.value)} />
              </div>
            </div>
            <div className="space-y-3">
              <Button className="w-full" disabled>
                Export to Google Slides (mock)
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Export to Google Docs (mock)
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
