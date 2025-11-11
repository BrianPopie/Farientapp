import type { QuickWorkflowChip } from "./types";

type ChipsProps = {
  items: QuickWorkflowChip[];
  disabled?: boolean;
  onSelect: (chip: QuickWorkflowChip) => void;
};

export function Chips({ items, disabled, onSelect }: ChipsProps) {
  if (!items.length) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map((chip) => (
        <button
          key={chip.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(chip)}
          className="rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-800 transition hover:bg-white dark:border-white/15 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08] disabled:opacity-50"
        >
          <div className="flex flex-col text-left leading-tight">
            <span>{chip.label}</span>
            {chip.helper ? <span className="text-[11px] text-slate-500 dark:text-white/60">{chip.helper}</span> : null}
          </div>
        </button>
      ))}
    </div>
  );
}
