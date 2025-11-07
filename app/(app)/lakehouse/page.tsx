"use client";

import * as React from "react";
import { mockSearch } from "@/lib/mockSearch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CitationChip } from "@/components/CitationChip";
import citations from "@/data/citations.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUIStore } from "@/store/useUI";
import type { Citation } from "@/lib/types";

const schemaNodes = ["Companies", "Executives", "Grants", "Plans", "Metrics", "Peers", "Votes", "Citations"];

export default function LakehousePage() {
  const [policyPack, setPolicyPack] = React.useState("ISS 2026");
  const [template, setTemplate] = React.useState("Template v4.3");
  const [modelConfig, setModelConfig] = React.useState("LangGraph v2");
  const [query, setQuery] = React.useState("retention grants before SOP vote");
  const [results, setResults] = React.useState(() => mockSearch("retention grants"));

  const openCitation = useUIStore((state) => state.openCitation);
  const openPolicy = useUIStore((state) => state.openPolicy);

  const runSearch = (value: string) => {
    setQuery(value);
    setResults(mockSearch(value));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Capability 02</p>
        <h1 className="text-3xl font-semibold">Structured data lake + semantic search</h1>
        <p className="text-muted-foreground">
          Hybrid relational plus vector store with source-bounded retrieval. Demo below shows how semantic prompts only surface verified
          spans.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Schema relationships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
              <svg viewBox="0 0 600 260" className="h-64 w-full">
                {schemaNodes.map((node, index) => {
                  const angle = (index / schemaNodes.length) * Math.PI * 2;
                  const cx = 300 + Math.cos(angle) * 200;
                  const cy = 130 + Math.sin(angle) * 90;
                  return (
                    <g key={node}>
                      <circle cx={cx} cy={cy} r={42} className="fill-[#0f172a] stroke-[#1f2937] stroke-2" />
                      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="fill-white text-xs font-semibold">
                        {node}
                      </text>
                      <line x1={cx} y1={cy} x2={300} y2={130} className="stroke-white/15" />
                    </g>
                  );
                })}
                <circle cx={300} cy={130} r={55} className="fill-[#1d2839] stroke-[#4cddff] stroke-2" />
                <text x={300} y={130} textAnchor="middle" dominantBaseline="middle" className="fill-white text-sm font-semibold">
                  Postgres + pgvector
                </text>
              </svg>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Versioned controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Policy pack</p>
              <Select value={policyPack} onValueChange={setPolicyPack}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ISS 2026">ISS 2026</SelectItem>
                  <SelectItem value="ISS 2025">ISS 2025</SelectItem>
                  <SelectItem value="Glass Lewis 2026">Glass Lewis 2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Extraction template</p>
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Template v4.3">Template v4.3</SelectItem>
                  <SelectItem value="Template v4.2">Template v4.2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Model config</p>
              <Select value={modelConfig} onValueChange={setModelConfig}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LangGraph v2">LangGraph v2</SelectItem>
                  <SelectItem value="LangGraph v1">LangGraph v1</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="rounded-3xl border border-white/5 bg-white/5 p-6">
        <p className="text-sm font-semibold">Semantic search (mocked)</p>
        <div className="mt-4 flex flex-col gap-3 lg:flex-row">
          <Input
            value={query}
            onChange={(event) => runSearch(event.target.value)}
            className="lg:flex-1"
            placeholder="e.g., retention grants before SOP vote"
          />
          <Button variant="ghost" className="lg:w-48" onClick={() => runSearch(query)}>
            Run mock search
          </Button>
        </div>
        <div className="mt-4 space-y-3">
          {results.hits.length === 0 && <p className="text-sm text-muted-foreground">No hits yet — try another phrase.</p>}
          {results.hits.map((hit) => (
            <div key={hit.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold">{hit.title}</p>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{hit.meta}</p>
                </div>
                <Button
                  variant="ghost"
                  className="gap-2 text-sm"
                  onClick={() => (hit.type === "citation" ? openCitation(hit.referenceId) : openPolicy(hit.referenceId))}
                >
                  Show cited span
                </Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{hit.snippet}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Source-bounded rag</p>
        <p className="text-sm text-muted-foreground">
          Link below shows how citations from the lakehouse reference the same provenance drawer the filings page uses.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(citations as Citation[]).slice(0, 2).map((citation) => (
            <CitationChip key={citation.id} citation={citation} />
          ))}
        </div>
      </section>
    </div>
  );
}
