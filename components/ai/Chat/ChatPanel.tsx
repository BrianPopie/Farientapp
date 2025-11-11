"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { Inputs, Output } from "@/lib/farient/types";
import { systemPrompt } from "@/lib/farient/prompt";
import QuickWorkflows from "./QuickWorkflows";
import EvidenceDrawer from "./EvidenceDrawer";
import PeerList from "./PeerList";
import Handoffs from "./Handoffs";
import { LS_KEY, LS_OUT, readJSON } from "../ls";
import type { BuilderState } from "../OutputBuilder/state";
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

export default function ChatPanel({ onAsk }: ChatPanelProps) {
  const [builderState, setBuilderState] = useState<BuilderState | undefined>();
  const [bands, setBands] = useState<Output | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setBuilderState(readJSON<BuilderState>(LS_KEY));
    setBands(readJSON<Output>(LS_OUT));
  }, []);

  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key === LS_KEY) {
        setBuilderState(event.newValue ? (JSON.parse(event.newValue) as BuilderState) : undefined);
      }
      if (event.key === LS_OUT) {
        setBands(event.newValue ? (JSON.parse(event.newValue) as Output) : undefined);
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
        value: `$${bands.baseMin.toLocaleString()} – $${bands.baseMax.toLocaleString()}`
      });
    }
    return chips;
  }, [bands, inputs, roleBandSummary]);

  const bandSummary = useMemo(() => {
    if (!bands) return undefined;
    return {
      base: `$${bands.baseMin.toLocaleString()} – $${bands.baseMax.toLocaleString()}`,
      bonus: `${bands.bonusPct}%`,
      lti: `$${bands.ltiAnnual.toLocaleString()}`
    };
  }, [bands]);

  const handleSend = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || pending) return;
      const userMessage: Message = { role: "user", content: trimmed };
      const history = [...messages, userMessage];
      setMessages(history);
      setDraft("");
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSend(draft);
  };

  return (
    <div className="flex flex-col gap-6">
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

      <QuickWorkflows
        inputs={inputs}
        bands={bands}
        roleBandSummary={roleBandSummary}
        disabled={pending}
        onSelect={(prompt) => void handleSend(prompt)}
      />

      {!contextReady ? (
        <div className="rounded-2xl border border-dashed border-amber-400 bg-amber-50/60 p-4 text-sm text-amber-700">
          Finish the builder steps and generate bands to unlock fully contextual responses.
        </div>
      ) : null}

      <Section title="Conversation" subtitle="Chat with Farient using the stored context.">
        <div className="card space-y-3 p-4">
          <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
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
                      : "border-border bg-card/70 text-slate-800 dark:text-slate-100"
                  }`}
                >
                  <p className="text-xs uppercase tracking-wide opacity-70">{message.role}</p>
                  <p className="mt-1 whitespace-pre-wrap">{message.content}</p>
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

      <div className="grid gap-4 lg:grid-cols-2">
        <EvidenceDrawer />
        <PeerList />
        <Handoffs />
      </div>
    </div>
  );
}

function buildSystemPrompt(inputs?: Inputs, bands?: Output, roleBandSummary?: string) {
  const base = systemPrompt(inputs, bands);
  if (!roleBandSummary) return base;
  return `${base}\nRole band focus: ${roleBandSummary}`;
}
