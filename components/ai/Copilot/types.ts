export type CopilotRole = "user" | "assistant";

export type CopilotMessage = {
  id: string;
  role: CopilotRole;
  content: string;
};

export type QuickWorkflowChip = {
  id: string;
  label: string;
  helper?: string;
  prompt: string;
};

export type AssistantPanelKpi = {
  label: string;
  value: string;
  help?: string;
};

export type AssistantPanelBands = {
  base: string;
  bonus: string;
  lti: string;
};

export type AssistantPanelEvidence = {
  label: string;
  source: string;
};

export type AssistantPanelModel = {
  title: string;
  subtitle?: string;
  contextChips?: { label: string; value: string }[];
  kpis?: AssistantPanelKpi[];
  bands?: AssistantPanelBands;
  materialGaps?: string[];
  tradeoffs?: string[];
  actions?: string[];
  evidence?: AssistantPanelEvidence[];
};
