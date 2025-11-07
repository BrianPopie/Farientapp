import { create } from "zustand";
import runsData from "@/data/runs.json";
import type { AgentRun } from "@/lib/types";

type RunState = {
  runs: AgentRun[];
  addRun: (run: AgentRun) => void;
  updateRunStatus: (id: string, status: AgentRun["status"]) => void;
};

export const useMockRuns = create<RunState>((set) => ({
  runs: runsData as AgentRun[],
  addRun: (run) =>
    set((state) => ({
      runs: [run, ...state.runs]
    })),
  updateRunStatus: (id, status) =>
    set((state) => ({
      runs: state.runs.map((run) => (run.id === id ? { ...run, status } : run))
    }))
}));
