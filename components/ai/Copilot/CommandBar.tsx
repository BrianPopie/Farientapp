"use client";

import { useId } from "react";
import { Paperclip, SendHorizonal, Square } from "lucide-react";

type CommandBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop?: () => void;
  pending?: boolean;
  placeholder?: string;
  suggestions?: string[];
};

export function CommandBar({
  value,
  onChange,
  onSend,
  onStop,
  pending,
  placeholder,
  suggestions = []
}: CommandBarProps) {
  const inputId = useId();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-4xl">
      <label
        htmlFor={inputId}
        className="relative flex items-end gap-3 rounded-full border border-border bg-white px-4 py-2.5 text-text shadow-[0_10px_40px_rgba(0,0,0,0.15)] focus-within:ring-2 focus-within:ring-[rgb(var(--ring))] dark:border-white/10 dark:bg-white/5 dark:text-white dark:shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
      >
        <Paperclip className="hidden h-4 w-4 shrink-0 text-slate-500 dark:text-white/60 sm:block" aria-hidden />
        <textarea
          id={inputId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="h-10 w-full resize-none bg-transparent text-[15px] leading-6 text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
        />
        {pending ? (
          <button
            type="button"
            onClick={onStop}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-semibold text-slate-900 transition hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          >
            <Square className="h-3 w-3" />
            Stop
          </button>
        ) : (
          <button
            type="button"
            onClick={onSend}
            disabled={!value.trim()}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-slate-900 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 dark:border-white/20 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90"
          >
            Send
            <SendHorizonal className="h-3.5 w-3.5" />
          </button>
        )}
      </label>

      {suggestions.length ? (
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onChange(suggestion)}
              className="rounded-full border border-border bg-white/70 px-2.5 py-1 text-[11px] text-slate-700 transition hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:text-white/80 dark:hover:bg-white/[0.08]"
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
