import { ProtectedRouteBoundary } from "@/components/ProtectedRouteBoundary";
import { AppChrome } from "@/components/AppChrome";
import OutputBuilder from "@/components/ai/OutputBuilder/Stepper";
import ChatPanel from "@/components/ai/Chat/ChatPanel";
import { generateBands, runRoleAwareChat } from "@/app/ai/actions";
import { ThemeToggle } from "@/components/ThemeToggle";
export default function AiPage() {
  return (
    <ProtectedRouteBoundary>
      <AppChrome>
        <main className="container space-y-8 py-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 dark:text-slate-300">
              Farient AI
            </p>
            <h1 className="text-2xl font-semibold text-text">Unified Output Builder + Copilot</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl">
              Capture the five inputs once, run the band engine via server actions, and keep the role-aware chat in sync with
              your selections for workflows, evidence, and hand-offs.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <section className="card relative p-5 lg:p-6">
              <header className="sticky top-0 z-10 -mt-2 border-b border-border bg-card/80 py-3 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                <h2 className="text-lg font-semibold text-text">Farient 5-Step Builder</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Capture five inputs and generate a Farient-ready band table.
                </p>
              </header>
              <div className="min-h-[60vh] max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                <OutputBuilder onGenerate={generateBands} />
              </div>
            </section>

            <aside className="card relative p-5 lg:p-6">
              <header className="sticky top-0 z-10 -mt-2 border-b border-border bg-card/80 py-3 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-text">Role-aware Farient Copilot</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Chat with context from the builder + quick workflows.
                    </p>
                  </div>
                  <ThemeToggle />
                </div>
              </header>
              <div className="min-h-[60vh] max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                <ChatPanel onAsk={runRoleAwareChat} />
              </div>
            </aside>
          </div>
        </main>
      </AppChrome>
    </ProtectedRouteBoundary>
  );
}
