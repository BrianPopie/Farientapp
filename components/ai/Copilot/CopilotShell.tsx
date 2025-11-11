import type { ReactNode } from "react";
import { Ambience } from "./Ambience";

type CopilotShellProps = {
  chips?: ReactNode;
  conversation: ReactNode;
  contextRail: ReactNode;
  commandBar: ReactNode;
};

export function CopilotShell({ chips, conversation, contextRail, commandBar }: CopilotShellProps) {
  return (
    <section className="card relative flex min-h-[70vh] flex-col overflow-hidden p-0">
      <Ambience />
      <header className="relative z-10 sticky top-0 border-b border-border bg-card/85 px-5 py-4 backdrop-blur supports-[backdrop-filter]:bg-card/70">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Farient Copilot</p>
            <h2 className="text-lg font-semibold text-text">Role-aware Farient Copilot</h2>
          </div>
        </div>
        {chips}
      </header>

      <div className="relative z-10 flex-1">
        <div className="grid min-h-[60vh] grid-cols-1 divide-y divide-border lg:grid-cols-[minmax(0,1fr)_340px] lg:divide-x lg:divide-y-0">
          <div className="min-h-0">{conversation}</div>
          <div className="min-h-0 bg-card/70">{contextRail}</div>
        </div>
      </div>

      <footer className="relative z-10 sticky bottom-0 border-t border-border bg-card/85 px-5 py-4 backdrop-blur supports-[backdrop-filter]:bg-card/70">
        {commandBar}
      </footer>
    </section>
  );
}
