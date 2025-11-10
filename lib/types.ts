export type Company = {
  id: string;
  name: string;
  ticker: string;
  cik: string;
  sector: string;
  industry: string;
  size: "Large Cap" | "Mid Cap" | "Small Cap";
  logoUrl: string;
};

export type Executive = {
  id: string;
  companyId: string;
  name: string;
  role: string;
  tenureYears: number;
};

export type MetricRef = {
  metricId: string;
  target?: string;
};

export type Grant = {
  id: string;
  companyId: string;
  execId: string;
  year: number;
  type: "RSU" | "StockOption" | "PSU";
  valueUSD: number;
  metrics: MetricRef[];
};

export type Plan = {
  id: string;
  companyId: string;
  name: string;
  year: number;
  metricWeights: {
    metricId: string;
    weightPct: number;
  }[];
};

export type Metric = {
  id: string;
  name: string;
  category: "Financial" | "Market" | "ESG" | "Operational";
  definition: string;
};

export type PeerSet = {
  id: string;
  companyId: string;
  year: number;
  rule: string;
  peers: string[];
};

export type Vote = {
  id: string;
  companyId: string;
  year: number;
  sayOnPayPct: number;
  issReco: "FOR" | "AGAINST" | "NONE";
  glReco: "FOR" | "AGAINST" | "NONE";
};

export type Citation = {
  id: string;
  companyId: string;
  filing: "DEF14A" | "10-K" | "8-K" | "10-Q";
  year: number;
  page: number;
  lineStart: number;
  lineEnd: number;
  text: string;
};

export type PolicyDelta = {
  id: string;
  yearFrom: number;
  yearTo: number;
  firm: "ISS" | "GlassLewis";
  section: string;
  changeSummary: string;
};

export type AgentRunStep = {
  name: string;
  startedAt: string;
  finishedAt?: string;
  logs: string[];
};

export type AgentRun = {
  id: string;
  runAt: string;
  companyId: string;
  status: "queued" | "running" | "success" | "error";
  steps: AgentRunStep[];
};

export type TrendPoint = {
  year: number;
  tsrPct: number;
  compUSD: number;
};

export type PayMixDatum = {
  company: string;
  salary: number;
  bonus: number;
  equity: number;
};

export type RiskAxis =
  | "Leverage"
  | "Time-vesting"
  | "One-time awards"
  | "Metric quality"
  | "Goal rigor"
  | "Pay-performance alignment";

export type RiskProfile = {
  axis: RiskAxis;
  value: number;
};

export type TableColumn<T> = {
  key: keyof T | string;
  header: string;
  align?: "left" | "center" | "right";
  render?: (row: T) => React.ReactNode;
};

export type TableRowAction<T> = {
  label: string;
  onClick: (row: T) => void;
};

export type Capability = {
  id: string;
  name: string;
  icon: string;
  description: string;
  href: string;
  metricLabel: string;
  metricValue: string;
};

export type SearchHit = {
  id: string;
  type: "citation" | "policy";
  title: string;
  snippet: string;
  meta: string;
  referenceId: string;
};

export type SearchResult = {
  query: string;
  hits: SearchHit[];
};

export type UploadedFiling = {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
};

export type DrawerPayload =
  | {
    type: "citation";
    data: Citation & { companyName?: string };
  }
  | {
    type: "policy";
    data: PolicyDelta;
  };

export type CitationDrawerState = {
  payload?: DrawerPayload;
};
