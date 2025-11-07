import { create } from "zustand";
import type { CitationDrawerState, Citation, PolicyDelta } from "@/lib/types";
import companies from "@/data/companies.json";
import citations from "@/data/citations.json";
import policies from "@/data/policies.json";

type UIState = {
  citationDrawer: CitationDrawerState;
  openCitation: (citationId: string | (Citation & { companyId: string })) => void;
  openPolicy: (policyId: string | PolicyDelta) => void;
  closeDrawer: () => void;
  handleDrawerVisibility: (open: boolean) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (value: string) => void;
};

const companyNameById = Object.fromEntries(companies.map((c) => [c.id, c.name]));
const typedCitations = citations as Citation[];
const citationById = Object.fromEntries(typedCitations.map((citation) => [citation.id, citation]));
const CLOSED_STATE: CitationDrawerState = {};

export const useUIStore = create<UIState>((set, get) => ({
  citationDrawer: CLOSED_STATE,
  globalSearchQuery: "",
  setGlobalSearchQuery: (value) => {
    if (get().globalSearchQuery === value) {
      return;
    }
    set({ globalSearchQuery: value });
  },
  openCitation: (citationData) => {
    const citation = typeof citationData === "string" ? citationById[citationData] : citationData;
    if (!citation) {
      if (get().citationDrawer.payload) {
        set({ citationDrawer: CLOSED_STATE });
      }
      return;
    }

    const nextPayload = {
      type: "citation" as const,
      data: {
        ...citation,
        companyName: companyNameById[citation.companyId]
      }
    };

    const currentPayload = get().citationDrawer.payload;
    if (
      currentPayload?.type === "citation" &&
      currentPayload.data.id === citation.id
    ) {
      return;
    }

    set({
      citationDrawer: {
        payload: nextPayload
      }
    });
  },
  openPolicy: (policyData) => {
    const policy =
      typeof policyData === "string"
        ? (policies.find((item) => item.id === policyData) as PolicyDelta | undefined)
        : policyData;

    if (!policy) {
      if (get().citationDrawer.payload) {
        set({ citationDrawer: CLOSED_STATE });
      }
      return;
    }

    const currentPayload = get().citationDrawer.payload;
    if (currentPayload?.type === "policy" && currentPayload.data.id === policy.id) {
      return;
    }

    set({
      citationDrawer: {
        payload: {
          type: "policy",
          data: policy
        }
      }
    });
  },
  closeDrawer: () => {
    if (!get().citationDrawer.payload) {
      return;
    }
    set({ citationDrawer: CLOSED_STATE });
  },
  handleDrawerVisibility: (open) => {
    const current = get().citationDrawer;
    const currentOpen = Boolean(current.payload);
    if (process.env.NODE_ENV !== "production") {
      console.debug("[useUIStore] handleDrawerVisibility", { requestedOpen: open, currentOpen });
    }
    if (open || !currentOpen) {
      return;
    }
    set({ citationDrawer: CLOSED_STATE });
  }
}));
