"use client";

import { useMemo, useState } from "react";
import { ROLE_BANDS } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { GuidanceCallout } from "@/components/GuidanceCallout";
import { useAiChat } from "@/hooks/useAiChat";
import peersData from "@/data/peer-universe.json";
import type { PeerRuleInput } from "@/lib/peers";
import { recommendPeers } from "@/lib/peers";
import { splitGuidance } from "@/lib/insights";

const COMPANIES = ["Aurelius (AUR)", "Borealis (BOR)", "Northwind (NWD)"];
type BandKey = (typeof ROLE_BANDS)[number]["key"];
const peerUniverse = peersData as PeerRuleInput[];

const evidenceMock = [
  "cit_aur_sct_pg32 - DEF 14A, Summary Comp Table (p.32 lines 10-22)",
  "cit_aur_pvp_pg52 - DEF 14A, Pay vs Performance (p.52 lines 1-25)",
  "cit_bor_retention - 8-K retention award (p.3 lines 15-24)",
  "iss_2026_policy - ISS 2026 Policy section 2.1 P4P overlay"
];

const handOffs = [
  "Add insight to One-Pager",
  "Open P&L peer grid",
  "Create appendix row"
];

export function RoleAwareCopilot() {
  const [band, setBand] = useState<BandKey>(ROLE_BANDS[0].key);
  const selectedBand = ROLE_BANDS.find((b) => b.key === band) ?? ROLE_BANDS[0];
  const roles = useMemo(() => selectedBand.roles, [selectedBand]);
  const [role, setRole] = useState<string>(roles[0]);
  const [company, setCompany] = useState(COMPANIES[0]);
  const { messages, send, streaming } = useAiChat(systemFor(band, role, company));
  const [input, setInput] = useState("");

  const ticker = extractTicker(company);
  const peerSeed = peerUniverse.find((entry) => entry.ticker === ticker);
  const peers = useMemo(() => {
    if (!peerSeed) return [];
    return recommendPeers(peerSeed, peerUniverse);
  }, [peerSeed]);

  const ask = (question?: string) => {
    const prompt = (question ?? input).trim();
    if (!prompt) return;
    send(userPrompt(band, role, company, prompt));
    if (!question) {
      setInput("");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[290px_1fr_320px]">
      <aside className="space-y-4">
        <Card className="space-y-3 border-border/70 bg-surface/80 p-4">
          <div className="text-sm font-medium">Role band</div>
          <Select
            value={band}
            onValueChange={(value) => {
              const next = value as BandKey;
              setBand(next);
              const fallbackBand = ROLE_BANDS.find((b) => b.key === next) ?? ROLE_BANDS[0];
              setRole(fallbackBand.roles[0]);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLE_BANDS.map((bandDef) => (
                <SelectItem key={bandDef.key} value={bandDef.key}>
                  {bandDef.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-text-muted">{selectedBand.why}</p>

          <div className="text-sm font-medium">Specific role</div>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map((roleOption) => (
                <SelectItem key={roleOption} value={roleOption}>
                  {roleOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="text-sm font-medium">Company</div>
          <Select value={company} onValueChange={setCompany}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMPANIES.map((co) => (
                <SelectItem key={co} value={co}>
                  {co}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <p className="text-xs text-text-muted">
            Mock answers must include citations like [cit: id] or say &quot;need source&quot; when data is missing.
          </p>
          <div className="flex flex-wrap gap-2">
            {["DEF 14A", "10-K", "8-K", "ISS/GL"].map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="space-y-3 border-border/70 bg-surface/80 p-4">
          <div className="text-sm font-medium">Quick workflows</div>
          <div className="grid gap-2">
            {quickFor(band).map((workflow) => (
              <Button
                key={workflow}
                variant="secondary"
                size="sm"
                className="justify-start"
                onClick={() => ask(workflow)}
              >
                {workflow}
              </Button>
            ))}
          </div>
        </Card>
      </aside>

      <section className="flex flex-col rounded-3xl border border-border bg-surface/90 p-4 shadow-sm">
        <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl bg-muted/40 p-4">
          {messages.length === 0 && (
            <p className="text-sm text-text-muted">
              Ask any question to procure insights around any compensation related question!
            </p>
          )}
          {messages.map((message, index) => {
            const { body, guidance } = splitGuidance(message.content);
            const display = message.role === "assistant" ? body : message.content;
            return (
              <div key={`${message.role}-${index}`} className="space-y-2 text-sm">
                <p className={`mb-1 font-medium ${message.role === "user" ? "text-accent" : "text-text"}`}>
                  {message.role === "user" ? "You" : "Farient AI"}
                </p>
                <div className="whitespace-pre-wrap leading-6">{display}</div>
                {message.role === "assistant" ? <GuidanceCallout guidance={guidance} dense /> : null}
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex gap-2">
          <Input
            value={input}
            placeholder={`Ask about ${role} at ${company}...`}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && input.trim()) {
                event.preventDefault();
                ask();
              }
            }}
          />
          <Button disabled={streaming || !input.trim()} onClick={() => ask()}>
            {streaming ? "Streaming..." : "Ask"}
          </Button>
        </div>
      </section>

      <aside className="space-y-4">
        <Card className="border-border/70 bg-surface/80 p-4">
          <div className="text-sm font-medium">Evidence (mock)</div>
          <ul className="mt-2 space-y-2 text-xs text-text-muted">
            {evidenceMock.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
        <Card className="space-y-3 border-border/70 bg-surface/80 p-4">
          <div className="text-sm font-medium">Peer set recommendations</div>
          {peers.length === 0 ? (
            <p className="text-xs text-text-muted">Need comparable tickers before recommending peers.</p>
          ) : (
            <ul className="space-y-2 text-xs">
              {peers.map((peer) => (
                <li key={peer.ticker} className="rounded-xl border border-border/60 bg-surface/60 p-2">
                  <p className="font-semibold text-text">{peer.ticker}</p>
                  <p className="text-text-muted">{peer.why}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="space-y-3 border-border/70 bg-surface/80 p-4">
          <div className="text-sm font-medium">Hand-offs</div>
          <div className="grid gap-2">
            {handOffs.map((item) => (
              <Button key={item} size="sm" variant="secondary" className="justify-start" disabled>
                {item}
              </Button>
            ))}
          </div>
        </Card>
      </aside>
    </div>
  );
}

function systemFor(band: string, role: string, company: string) {
  return [
    `You are Farient's Exec-Comp Copilot. Company=${company}. RoleBand=${band}. Role=${role}.`,
    `Answer with: "Insight * Why it matters * Next step".`,
    `Use verified spans where possible: [cit: id] (for example, cit_aur_sct_pg32).`,
    `If no span exists for this role, say "need source" and suggest where to look (proxy section, 10-K footnote, ISS/GL pack, client tracker).`,
    `Align answers to one of: Benchmarking/P4P, Policy risk, Board outputs, or Succession/retention.`,
    `After your answer, output a "Guidance" block:\n- Vehicles: RSU % / Option % / PSU %\n- Metrics: (e.g., TSR, Rev CAGR, Margin) with weight\n- Vesting: time vs performance cadence\n- Rationale: one sentence\nInclude [cit: id] when guidance references a filing or policy; else say "need source".`
  ].join("\n");
}

function userPrompt(band: string, role: string, company: string, question: string) {
  return `Band=${band}; Role=${role}; Company=${company}; Q=${question}`;
}

function quickFor(band: string) {
  if (band === "c_suite") {
    return [
      "Benchmark CFO vs mid-cap peers (pay mix + TSR)",
      "Any pre-vote retention grants for CHRO?",
      "P4P alignment for COO - last 3 years"
    ];
  }
  if (band === "pnl") {
    return [
      "Model comp for Division President vs segment margin",
      "Flag anomalies in bonus metrics for P&L leader",
      "Peer set suggestions for SVP running Cloud biz"
    ];
  }
  if (band === "critical_tech") {
    return [
      "Market range for Head of Product in growth mode",
      "Equity refresh guidance for Chief Data/AI",
      "Scarcity premium notes for VP Eng"
    ];
  }
  return [
    "Retention-risk for ready-now CFO successor",
    "Successor comp ladders vs policy constraints",
    "Create board memo bullets for succession plan"
  ];
}

function extractTicker(label: string) {
  const match = label.match(/\(([^)]+)\)/);
  return match ? match[1] : label;
}
