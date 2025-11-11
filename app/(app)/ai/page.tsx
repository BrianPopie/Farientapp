import OutputBuilder from "@/components/ai/OutputBuilder/Stepper";
import ChatPanel from "@/components/ai/Chat/ChatPanel";
import { generateBands, runRoleAwareChat } from "@/app/ai/actions";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AiPage() {
  return (
    <div className="container py-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 dark:text-slate-300">Farient AI</p>
        <h1 className="text-2xl font-semibold text-text">Unified Output Builder + Copilot</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl">
          Capture the five inputs once, run the band engine via server actions, and keep the role-aware chat in sync with
          your selections for workflows, evidence, and hand-offs.
        </p>
      </div>

      <div className="mt-6 grid min-h-[calc(100vh-96px)] grid-rows-[auto_1fr] gap-6">
        <section className="card p-5 lg:p-6">
          <header className="mb-3">
            <h2 className="text-lg font-semibold text-text">Farient 5-Step Builder</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Capture five inputs and generate a Farient-ready band table.
            </p>
          </header>
          <div className="max-h-[38vh] overflow-y-auto pr-1">
            <OutputBuilder onGenerate={generateBands} />
          </div>
        </section>

        <section className="card flex min-h-0 flex-col p-5 lg:p-6">
          <header className="sticky top-0 z-10 -m-5 -mb-4 border-b border-border bg-card/90 px-5 py-3 backdrop-blur lg:-m-6 lg:-mb-5 lg:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-text">Role-aware Farient Copilot</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">Chat with context from the builder + quick workflows.</p>
              </div>
              <ThemeToggle />
            </div>
          </header>
          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            <ChatPanel onAsk={runRoleAwareChat} />
          </div>
        </section>
      </div>
    </div>
  );
}
