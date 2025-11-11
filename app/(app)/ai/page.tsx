import OutputBuilder from "@/components/ai/OutputBuilder/Stepper";
import ChatPanel from "@/components/ai/Chat/ChatPanel";
import { generateBands, runRoleAwareChat } from "@/app/ai/actions";
import { PageHeading, BodyText, Kicker } from "@/components/ui/typography";
import { md } from "@/lib/docsSync";

const aiSubtitle = md(
  "ai-subtitle",
  "Capture the five inputs once, run the band engine via server actions, and keep the role-aware chat in sync with your selections for workflows, evidence, and hand-offs."
);

export default function AiPage() {
  return (
    <div className="container py-6">
      <div className="space-y-3">
        <Kicker>Farient AI</Kicker>
        <PageHeading>Unified Output Builder + Copilot</PageHeading>
        <BodyText muted className="max-w-3xl">
          {aiSubtitle}
        </BodyText>
      </div>

      <div className="mt-6 grid min-h-[calc(100vh-96px)] grid-rows-[auto_1fr] gap-6">
        <section className="card p-5 lg:p-6">
          <header className="mb-3">
            <h2 className="text-lg font-semibold text-foreground">Farient 5-Step Builder</h2>
            <p className="text-sm text-muted-foreground">
              Capture five inputs and generate a Farient-ready band table.
            </p>
          </header>
          <div className="max-h-[38vh] overflow-y-auto pr-1">
            <OutputBuilder onGenerate={generateBands} />
          </div>
        </section>

        <div>
          <ChatPanel onAsk={runRoleAwareChat} />
        </div>
      </div>
    </div>
  );
}
