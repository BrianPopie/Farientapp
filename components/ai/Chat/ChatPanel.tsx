"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Inputs, Output } from "@/lib/farient/types";
import { systemPrompt } from "@/lib/farient/prompt";
import { LS_KEY, LS_OUT, LS_AUTO, readJSON, removeKey } from "../ls";
import type { BuilderState, RoleBandSelection } from "../OutputBuilder/state";
import { ROLE_BANDS } from "@/lib/roles";
import type { AssistantPanelModel, CopilotMessage } from "../Copilot/types";
import { CopilotShell } from "../Copilot/CopilotShell";
import { Conversation } from "../Copilot/Conversation";
import { ContextRail } from "../Copilot/ContextRail";
import { CommandBar } from "../Copilot/CommandBar";
import { stripMarkdownNoise } from "@/lib/text/sanitize";

type MessagePayload = { role: "user" | "assistant"; content: string };

export type AskPayload = {
  system: string;
  messages: MessagePayload[];
};

export type ChatPanelProps = {
  onAsk: (payload: AskPayload) => Promise<string>;
};

type AutoPromptPayload = {
  createdAt: number;
  inputs: Required<Inputs>;
  output: Output;
  roleBand?: RoleBandSelection;
};

export default function ChatPanel({ onAsk }: ChatPanelProps) {
  const [builderState, setBuilderState] = useState<BuilderState | undefined>();
  const [bands, setBands] = useState<Output | undefined>();
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const messagesRef = useRef<CopilotMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoPrompt, setAutoPrompt] = useState<AutoPromptPayload | null>(null);
  const handledAutoRef = useRef<number>(0);
  const requestRef = useRef<number | null>(null);
  const idRef = useRef(0);

  const nextMessageId = () => {
    idRef.current += 1;
    return `msg-${idRef.current}`;
  };

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    setBuilderState(readJSON<BuilderState>(LS_KEY));
    setBands(readJSON<Output>(LS_OUT));
    setAutoPrompt(readJSON<AutoPromptPayload>(LS_AUTO) ?? null);
  }, []);

  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key === LS_KEY) {
        setBuilderState(event.newValue ? (JSON.parse(event.newValue) as BuilderState) : undefined);
      }
      if (event.key === LS_OUT) {
        setBands(event.newValue ? (JSON.parse(event.newValue) as Output) : undefined);
      }
      if (event.key === LS_AUTO) {
        setAutoPrompt(event.newValue ? (JSON.parse(event.newValue) as AutoPromptPayload) : null);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const inputs = useMemo<Inputs | undefined>(() => {
    if (!builderState) return undefined;
    return {
      company: builderState.company,
      location: builderState.location,
      parity: builderState.parity,
      mix: builderState.mix,
      role:
        builderState.role &&
        typeof builderState.role.hasPNL === "boolean" &&
        builderState.role.directs
          ? (builderState.role as Inputs["role"])
          : undefined
    };
  }, [builderState]);

  const roleBandSummary = useMemo(() => describeRoleBand(builderState?.roleBand), [builderState?.roleBand]);

  const contextReady = useMemo(() => {
    if (!inputs || !builderState?.roleBand) return false;
    const hasRole = Boolean(inputs.role);
    return Boolean(inputs.company && hasRole && inputs.location && inputs.parity && inputs.mix && bands);
  }, [inputs, bands, builderState?.roleBand]);

  const commandSuggestions = useMemo(() => {
    if (!contextReady || !roleBandSummary) {
      return ["Benchmark CFO vs mid-cap peers", "Explain pay-mix tradeoffs", "Prep comp committee summary"];
    }
    return [
      `Benchmark ${builderState?.roleBand?.roleLabel ?? "role"} against peer medians`,
      "Prep comp committee slide with gaps + TSR linkage",
      "Outline 30-60 day actions for comp adjustments"
    ];
  }, [contextReady, roleBandSummary, builderState?.roleBand?.roleLabel]);

  const assistantModels = useMemo(() => {
    const base = buildAssistantPanelBase(inputs, bands, builderState?.roleBand);
    return messages.reduce<Record<string, AssistantPanelModel | undefined>>((acc, message) => {
      if (message.role === "assistant") {
        acc[message.id] = buildAssistantPanelModel(message.content, base);
      }
      return acc;
    }, {});
  }, [messages, inputs, bands, builderState?.roleBand]);

  const handleSend = useCallback(
    async (
      content: string,
      options?: { force?: boolean; silent?: boolean; summaryMode?: boolean }
    ) => {
      const trimmed = content.trim();
      if (!trimmed || (!options?.force && pending)) return;

      const payloadContent = options?.summaryMode ? `TL;DR summary: ${trimmed}` : trimmed;
      const userMessage: CopilotMessage = { id: nextMessageId(), role: "user", content: payloadContent };
      const historyWithUser = [...messagesRef.current, userMessage];
      messagesRef.current = historyWithUser;
      setMessages(historyWithUser);
      if (!options?.silent) setDraft("");
      setPending(true);
      setError(null);

      const payloadHistory: MessagePayload[] = historyWithUser.map(({ role, content: value }) => ({
        role,
        content: value
      }));

      const requestId = Date.now();
      requestRef.current = requestId;

      try {
        const response = await onAsk({
          system: buildSystemPrompt(inputs, bands, roleBandSummary),
          messages: payloadHistory
        });
        if (requestRef.current !== requestId) return;
        const assistantMessage: CopilotMessage = {
          id: nextMessageId(),
          role: "assistant",
          content: response
        };
        const historyWithAssistant = [...messagesRef.current, assistantMessage];
        messagesRef.current = historyWithAssistant;
        setMessages(historyWithAssistant);
      } catch (err) {
        if (requestRef.current !== requestId) return;
        setError(err instanceof Error ? err.message : "Unable to reach the copilot right now.");
      } finally {
        if (requestRef.current === requestId) {
          requestRef.current = null;
          setPending(false);
        }
      }
    },
    [bands, inputs, onAsk, pending, roleBandSummary]
  );

  const handleStop = useCallback(() => {
    if (!pending) return;
    requestRef.current = null;
    setPending(false);
    setError("Request canceled.");
  }, [pending]);

  useEffect(() => {
    if (!autoPrompt || !contextReady) return;
    if (handledAutoRef.current >= autoPrompt.createdAt) return;
    const autopMessage = buildAutoPromptMessage(autoPrompt);
    const summaryPrompt = buildAutoSummaryPrompt(autoPrompt);
    if (!autopMessage || !summaryPrompt) return;
    handledAutoRef.current = autoPrompt.createdAt;
    removeKey(LS_AUTO);
    setAutoPrompt(null);
    void handleSend(autopMessage, { force: true, silent: true });
    void handleSend(summaryPrompt, { force: true, silent: true, summaryMode: true });
  }, [autoPrompt, contextReady, handleSend]);

  const conversationNode = (
    <Conversation messages={messages} pending={pending} assistantModels={assistantModels} />
  );

  const contextRailNode = (
    <ContextRail inputs={inputs} roleBand={builderState?.roleBand} bands={bands} ready={contextReady} />
  );

  const commandBarNode = (
    <div className="space-y-2">
      {error ? <p className="text-center text-xs text-red-400">{error}</p> : null}
      <CommandBar
        value={draft}
        onChange={setDraft}
        onSend={() => handleSend(draft)}
        onStop={handleStop}
        pending={pending}
        placeholder="Benchmark peers, prep comp committee slides, or explain pay-mix tradeoffs…"
        suggestions={commandSuggestions}
      />
    </div>
  );

  return <CopilotShell conversation={conversationNode} contextRail={contextRailNode} commandBar={commandBarNode} />;
}

function buildAssistantPanelBase(
  inputs?: Inputs,
  bands?: Output,
  roleBand?: RoleBandSelection
): Pick<AssistantPanelModel, "contextChips" | "kpis" | "bands"> {
  const contextChips: { label: string; value: string }[] = [];
  if (roleBand) contextChips.push({ label: "Role", value: describeRoleBand(roleBand) ?? "Role band" });
  if (inputs?.company) contextChips.push({ label: "Company", value: inputs.company });
  if (inputs?.location) contextChips.push({ label: "Location", value: formatLocation(inputs.location) });

  const kpis = [
    inputs?.parity ? { label: "Parity guardrail", value: formatParity(inputs.parity) } : null,
    inputs?.mix ? { label: "Cash vs equity", value: formatMix(inputs.mix) } : null,
    inputs?.role?.directs
      ? {
          label: "Scope",
          value: `${inputs.role.directs} directs`,
          help: inputs.role.hasPNL ? "Owns P&L" : "No P&L ownership"
        }
      : null
  ].filter(Boolean) as AssistantPanelModel["kpis"];

  const bandStats = bands
    ? {
        base: `$${bands.baseMin.toLocaleString()} – $${bands.baseMax.toLocaleString()}`,
        bonus: `${bands.bonusPct}% of base`,
        lti: `$${bands.ltiAnnual.toLocaleString()}`
      }
    : undefined;

  return { contextChips, kpis, bands: bandStats };
}

function buildAssistantPanelModel(content: string, base: ReturnType<typeof buildAssistantPanelBase>) {
  const sections = parseSections(content);
  const title = stripMarkdownNoise(sections.headings[0] ?? "Compensation insight");
  const subtitle = stripMarkdownNoise(sections.summary);
  const materialGaps = cleanList(getSectionItems(sections, ["gap"]));
  const tradeoffs = cleanList(getSectionItems(sections, ["tradeoff", "mix"]));
  const actions = cleanList(getSectionItems(sections, ["action", "next", "plan"]));
  const evidenceLines = getSectionItems(sections, ["evidence", "source"]);
  const evidence = evidenceLines
    .map(parseEvidenceLine)
    .filter((entry): entry is { label: string; source: string } => Boolean(entry))
    .map((item) => ({
      label: stripMarkdownNoise(item.label),
      source: stripMarkdownNoise(item.source)
    })) as AssistantPanelModel["evidence"];

  return {
    title,
    subtitle,
    contextChips: base.contextChips,
    kpis: base.kpis,
    bands: base.bands,
    materialGaps: materialGaps.length ? materialGaps : cleanList(sections.defaultBullets),
    tradeoffs,
    actions,
    evidence
  };
}

function parseSections(content: string) {
  const lines = content.split(/\r?\n/).map((line) => line.trim());
  const headings: string[] = [];
  const sectionMap = new Map<string, string[]>();
  let current = "summary";
  sectionMap.set(current, []);

  lines.forEach((line) => {
    if (!line) return;
    if (line.startsWith("### ")) {
      current = line.slice(4).toLowerCase();
      headings.push(line.replace("### ", ""));
      if (!sectionMap.has(current)) sectionMap.set(current, []);
      return;
    }
    if (!sectionMap.has(current)) sectionMap.set(current, []);
    sectionMap.get(current)?.push(line);
  });

  const defaultBullets =
    sectionMap
      .get("summary")
      ?.filter((item) => item.startsWith("-"))
      .map((item) => item.replace(/^-+\s?/, "")) ?? [];

  const summaryText = sectionMap.get("summary")?.find((item) => !item.startsWith("-")) ?? undefined;

  return { headings, sectionMap, defaultBullets, summary: summaryText };
}

function getSectionItems(parsed: ReturnType<typeof parseSections>, keywords: string[]): string[] {
  const entry = Array.from(parsed.sectionMap.entries()).find(([key]) =>
    keywords.some((kw) => key.includes(kw))
  );
  if (!entry) return [];
  const [, values] = entry;
  return values.map((value) => value.replace(/^-+\s?/, "")).filter(Boolean);
}

function parseEvidenceLine(line: string) {
  if (!line) return null;
  const match = line.match(/(.+)\((.+)\)$/);
  if (match) {
    return { label: match[1].trim(), source: match[2].replace(")", "").trim() };
  }
  return { label: line, source: "mock" };
}

function cleanList(items?: string[]) {
  return (items ?? [])
    .map((item) => stripMarkdownNoise(item))
    .map((item) => item.replace(/^\d+\.\s*/, ""))
    .filter(Boolean);
}

function buildAutoPromptMessage(payload: AutoPromptPayload) {
  if (!payload?.inputs || !payload?.output) return null;
  const { inputs, output, roleBand } = payload;
  const lines: string[] = [
    "Create a Farient-style compensation insight using the latest builder run. Keep the tone board-ready and explain pay mix tradeoffs plus recommended actions.",
    "",
    "### Builder Snapshot"
  ];

  const snapshot = [
    roleBand ? `Role band: ${describeRoleBand(roleBand)}` : null,
    `Company size: ${inputs.company}`,
    `Location tier: ${inputs.location}`,
    `Parity rule: ${inputs.parity}`,
    `Cash vs equity mix: ${inputs.mix}`,
    `Role scope: ${inputs.role.directs} directs; ${inputs.role.hasPNL ? "owns P&L" : "no P&L ownership"}`
  ].filter(Boolean) as string[];

  lines.push(...snapshot.map((entry) => `- ${entry}`));
  lines.push("", "### Generated Bands");
  lines.push(
    `- Base salary: $${output.baseMin.toLocaleString()} - $${output.baseMax.toLocaleString()}`,
    `- Bonus target: ${output.bonusPct}% of base`,
    `- LTI annualized: $${output.ltiAnnual.toLocaleString()}`
  );

  if (output.notes?.length) {
    lines.push("", "### Notes / Tradeoffs");
    output.notes.forEach((note) => lines.push(`- ${note}`));
  }

  lines.push(
    "",
    "### Deliverable",
    "- Provide a concise benchmarking summary, call out material gaps vs peers, and list 2-3 next actions or workflows.",
    "- Reference the stored bands directly; cite mock sources if needed."
  );

  return lines.join("\n");
}

function buildAutoSummaryPrompt(payload: AutoPromptPayload) {
  if (!payload?.inputs || !payload?.output) return null;
  const { inputs, output, roleBand } = payload;
  const chips = [
    roleBand ? `Role band: ${describeRoleBand(roleBand)}` : null,
    inputs.company ? `Company size: ${inputs.company}` : null,
    inputs.location ? `Location tier: ${inputs.location}` : null,
    inputs.parity ? `Parity rule: ${inputs.parity}` : null,
    inputs.mix ? `Cash vs equity mix: ${inputs.mix}` : null,
    inputs.role ? `Scope: ${inputs.role.directs} directs; ${inputs.role.hasPNL ? "owns P&L" : "no P&L"}` : null
  ]
    .filter(Boolean)
    .join(" • ");

  return [
    "Summarize the latest compensation insight you generated into a crisp TL;DR paragraph (max 3 sentences).",
    "Tone: executive summary, highlight the biggest takeaway and any notable risk or action.",
    "Context chips:",
    chips,
    "Bands:",
    `Base: $${output.baseMin.toLocaleString()} - $${output.baseMax.toLocaleString()}; Bonus: ${output.bonusPct}%; LTI: $${output.ltiAnnual.toLocaleString()}`,
    "Do not repeat numbering or markdown headings."
  ]
    .filter(Boolean)
    .join("\n");
}

function describeRoleBand(selection?: RoleBandSelection) {
  if (!selection) return undefined;
  const displayLabel =
    ROLE_BANDS.find((band) => band.key === selection.bandKey)?.label ?? selection.bandKey;
  return `${displayLabel} – ${selection.roleLabel}`;
}

function formatLocation(value: NonNullable<Inputs["location"]>) {
  switch (value) {
    case "Tier1_NY_SF":
      return "Tier 1 (NY/SF)";
    case "Tier2_BOS_DAL_AUS":
      return "Tier 2 (BOS/DAL/AUS)";
    default:
      return "Tier 3 (Other)";
  }
}

function formatParity(value: NonNullable<Inputs["parity"]>) {
  return value === "MatchBands" ? "Match existing bands" : "Flexible";
}

function formatMix(value: NonNullable<Inputs["mix"]>) {
  return value === "FavorCash" ? "Favor cash" : "Favor equity";
}

function buildSystemPrompt(inputs?: Inputs, bands?: Output, roleBandSummary?: string) {
  const base = systemPrompt(inputs, bands);
  if (!roleBandSummary) return base;
  return `${base}\nRole band focus: ${roleBandSummary}`;
}
