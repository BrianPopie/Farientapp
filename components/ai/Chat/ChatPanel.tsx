"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Inputs, Output } from "@/lib/farient/types";
import { systemPrompt } from "@/lib/farient/prompt";
import { LS_KEY, LS_OUT, LS_AUTO, readJSON, removeKey } from "../ls";
import type { BuilderState, RoleBandSelection } from "../OutputBuilder/state";
import { ROLE_BANDS } from "@/lib/roles";
import { Section } from "../Section";

type Message = { role: "user" | "assistant"; content: string };

export type AskPayload = {
  system: string;
  messages: Message[];
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoPrompt, setAutoPrompt] = useState<AutoPromptPayload | null>(null);
  const handledAutoRef = useRef<number>(0);

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

  const roleBandSummary = useMemo(() => {
    if (!builderState?.roleBand) return undefined;
    const label =
      ROLE_BANDS.find((band) => band.key === builderState.roleBand?.bandKey)?.label ??
      builderState.roleBand.bandKey;
    return `${label} · ${builderState.roleBand.roleLabel}`;
  }, [builderState?.roleBand]);

  const contextReady = useMemo(() => {
    if (!inputs || !builderState?.roleBand) return false;
    const hasRole = Boolean(inputs.role);
    return Boolean(inputs.company && hasRole && inputs.location && inputs.parity && inputs.mix && bands);
  }, [inputs, bands, builderState?.roleBand]);

  const summaryItems = useMemo(() => {
    if (!inputs) return [];
    const items: { label: string; value: string }[] = [];
    if (roleBandSummary) items.push({ label: "Role band", value: roleBandSummary });
    if (inputs.company) items.push({ label: "Company", value: inputs.company });
    if (inputs.location) items.push({ label: "Location", value: inputs.location });
    if (inputs.parity) items.push({ label: "Parity", value: inputs.parity });
    if (inputs.mix) items.push({ label: "Mix", value: inputs.mix });
    return items;
  }, [inputs, roleBandSummary]);

  const heroChips = useMemo(() => {
    const chips: { label: string; value: string }[] = [];
    if (roleBandSummary) chips.push({ label: "Role band", value: roleBandSummary });
    if (inputs?.company) chips.push({ label: "Company size", value: inputs.company });
    if (bands) {
      chips.push({
        label: "Band window",
        value: `$${bands.baseMin.toLocaleString()} - $${bands.baseMax.toLocaleString()}`
      });
    }
    return chips;
  }, [bands, inputs, roleBandSummary]);

  const bandSummary = useMemo(() => {
    if (!bands) return undefined;
    return {
      base: `$${bands.baseMin.toLocaleString()} - $${bands.baseMax.toLocaleString()}`,
      bonus: `${bands.bonusPct}%`,
      lti: `$${bands.ltiAnnual.toLocaleString()}`
    };
  }, [bands]);

  const handleSend = useCallback(
    async (content: string, options?: { force?: boolean; silent?: boolean }) => {
      const trimmed = content.trim();
      if (!trimmed || (!options?.force && pending)) return;
      const userMessage: Message = { role: "user", content: trimmed };
      const history = [...messages, userMessage];
      setMessages(history);
      if (!options?.silent) setDraft("");
      setPending(true);
      setError(null);
      try {
        const response = await onAsk({
          system: buildSystemPrompt(inputs, bands, roleBandSummary),
          messages: history
        });
        setMessages([...history, { role: "assistant", content: response }]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to reach the copilot right now.");
      } finally {
        setPending(false);
      }
    },
    [bands, inputs, messages, onAsk, pending, roleBandSummary]
  );

  useEffect(() => {
    if (!autoPrompt || !contextReady) return;
    if (handledAutoRef.current >= autoPrompt.createdAt) return;
    const autopMessage = buildAutoPromptMessage(autoPrompt);
    if (!autopMessage) return;
    handledAutoRef.current = autoPrompt.createdAt;
    removeKey(LS_AUTO);
    setAutoPrompt(null);
    void handleSend(autopMessage, { force: true, silent: true });
  }, [autoPrompt, contextReady, handleSend]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSend(draft);
  };

  return (
    <div className="flex min-h-0 flex-col gap-6">
      <Section title="Context" subtitle="Persisted inputs + computed bands">
        {heroChips.length ? (
          <div className="flex flex-wrap gap-3">
            {heroChips.map((chip) => (
              <span key={chip.label} className="badge bg-card px-3 py-1 text-xs font-semibold">
                {chip.label}: <span className="font-normal text-slate-600 dark:text-slate-300">{chip.value}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-600 dark:text-slate-400">Complete the builder to push context here.</p>
        )}

        {summaryItems.length ? (
          <dl className="grid gap-3 text-xs text-slate-600 dark:text-slate-300 sm:grid-cols-2">
            {summaryItems.map((item) => (
              <div key={item.label}>
                <dt className="font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {item.label}
                </dt>
                <dd className="text-sm text-slate-700 dark:text-slate-200">{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {bandSummary ? (
          <div className="grid gap-3 text-xs text-slate-600 dark:text-slate-300 sm:grid-cols-3">
            <div>
              <p className="font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Base</p>
              <p className="text-sm text-slate-700 dark:text-slate-200">{bandSummary.base}</p>
            </div>
            <div>
              <p className="font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Bonus</p>
              <p className="text-sm text-slate-700 dark:text-slate-200">{bandSummary.bonus}</p>
            </div>
            <div>
              <p className="font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Equity / LTI</p>
              <p className="text-sm text-slate-700 dark:text-slate-200">{bandSummary.lti}</p>
            </div>
          </div>
        ) : null}
      </Section>

      {!contextReady ? (
        <div className="rounded-2xl border border-dashed border-amber-400 bg-amber-50/60 p-4 text-sm text-amber-700">
          Finish the builder steps and generate bands to unlock fully contextual responses.
        </div>
      ) : null}

      <Section title="Conversation" subtitle="Chat with Farient using the stored context." className="flex min-h-0 flex-col">
        <div className="card flex min-h-0 flex-col space-y-3 p-4">
          <div className="flex-1 min-h-0 space-y-3 overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No conversation yet. Kick things off with a quick workflow or type a question below.
              </p>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`rounded-2xl border px-4 py-3 text-sm shadow-soft ${
                    message.role === "user"
                      ? "border-text bg-text text-bg"
                      : "border-slate-200 bg-white/90 text-slate-800 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                  }`}
                >
                  <p className="text-xs uppercase tracking-wide opacity-70">{message.role}</p>
                  <div className="mt-2 text-sm leading-relaxed">
                    {message.role === "assistant" ? (
                      <AssistantMessage content={message.content} />
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </div>
              ))
            )}
            {pending ? <p className="text-xs text-slate-500">Thinking…</p> : null}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask Farient to benchmark, prep a comp committee slide, or explain tradeoffs…"
              className="input min-h-[120px] resize-none"
            />
            <div className="flex items-center justify-between text-xs text-slate-500">
              {error ? <span className="text-red-500">{error}</span> : <span>Answers cite mock sources on demand.</span>}
              <button
                type="submit"
                disabled={pending || !draft.trim()}
                className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Sending…" : "Send"}
              </button>
            </div>
          </form>
        </div>
      </Section>
    </div>
  );
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

function describeRoleBand(selection?: RoleBandSelection) {
  if (!selection) return undefined;
  const displayLabel =
    ROLE_BANDS.find((band) => band.key === selection.bandKey)?.label ?? selection.bandKey;
  return `${displayLabel} - ${selection.roleLabel}`;
}

function buildSystemPrompt(inputs?: Inputs, bands?: Output, roleBandSummary?: string) {
  const base = systemPrompt(inputs, bands);
  if (!roleBandSummary) return base;
  return `${base}\nRole band focus: ${roleBandSummary}`;
}

function AssistantMessage({ content }: { content: string }) {
  const nodes = useMemo(() => formatAssistantContent(content), [content]);
  return <div className="space-y-2">{nodes}</div>;
}

function formatAssistantContent(text: string) {
  const lines = text.split("\n");
  const nodes: ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (!listItems.length) return;
    nodes.push(
      <ul key={`list-${nodes.length}`} className="ml-4 list-disc space-y-1 text-sm text-slate-700 dark:text-slate-200">
        {listItems.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    );
    listItems = [];
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      return;
    }
    if (line.startsWith("### ")) {
      flushList();
      nodes.push(
        <p key={`heading-${nodes.length}`} className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
          {line.replace("### ", "")}
        </p>
      );
      return;
    }
    if (line.startsWith("- ")) {
      listItems.push(line.slice(2));
      return;
    }
    const strongMatch = line.match(/^\*\*(.+?)\*\*:(.*)$/);
    if (strongMatch) {
      flushList();
      nodes.push(
        <p key={`strong-${nodes.length}`} className="text-sm text-slate-700 dark:text-slate-200">
          <span className="font-semibold">{strongMatch[1]}:</span>
          <span>{strongMatch[2]}</span>
        </p>
      );
      return;
    }
    flushList();
    nodes.push(
      <p key={`paragraph-${nodes.length}`} className="text-sm text-slate-700 dark:text-slate-200">
        {line}
      </p>
    );
  });

  flushList();
  return nodes.length ? nodes : [<p key="fallback">{text}</p>];
}

