"use client";

import * as React from "react";
import { ReportPreview } from "@/components/ReportPreview";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import AiChatBox from "@/components/AiChatBox";
import { PageHeading, BodyText } from "@/components/ui/typography";

export default function ReportsPage() {
  const [template, setTemplate] = React.useState("Board ready v3");
  const [brandColor, setBrandColor] = React.useState("#3b82f6");

  return (
    <div className="space-y-8 text-text">
      <div className="flex flex-col gap-2">
        <p className="text-[0.75rem] uppercase tracking-wide text-text-muted">Capability 06</p>
        <PageHeading>Board-ready report generation</PageHeading>
        <BodyText muted>
          Generate one-pagers, benchmark decks, and appendix tables with embedded citations. Buttons below are disabled until you connect
          Google Slides or Docs.
        </BodyText>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <ReportPreview />
        <Card>
          <CardHeader>
            <CardTitle>Template controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-xs uppercase text-text-muted">Template</p>
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
              <p className="text-xs uppercase text-text-muted">Brand color</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Board copilot</CardTitle>
          <CardDescription>Draft talking points, summaries, or appendix notes with Farient’s AI assistant.</CardDescription>
        </CardHeader>
        <CardContent>
          <AiChatBox systemPrompt="You are Farient's board-report copilot. Help write concise executive compensation summaries, board chair talking points, and appendix notes grounded in the dashboard context (TSR vs comp, benchmarking deltas, policy risks). Keep answers under 150 words and suggest next steps when possible." />
        </CardContent>
      </Card>
    </div>
  );
}
