export const ROLE_BANDS = [
  {
    key: "c_suite",
    label: "C-Suite (beyond CEO)",
    roles: ["CFO", "COO", "CHRO", "CTO/CIO", "CCO/CRO", "General Counsel"],
    why: "Critical strategic hires; align with industry benchmarks + retention risk."
  },
  {
    key: "pnl",
    label: "Business Unit & P&L Leaders",
    roles: ["Division President", "EVP", "SVP", "GM - Business Line"],
    why: "Revenue & margin drivers; boards scrutinize retention."
  },
  {
    key: "critical_tech",
    label: "Critical Technical & Transformation",
    roles: ["Head of Product", "VP Engineering", "Chief Data/AI", "Principal ML", "Platform Architect"],
    why: "Opaque, rapidly changing markets; scarcity premiums."
  },
  {
    key: "successors",
    label: "Successor Pipeline",
    roles: ["Ready-now CFO", "COO->CEO path", "VP Finance->CFO", "CTO successor"],
    why: "Succession + retention risk for upcoming transitions."
  }
] as const;
