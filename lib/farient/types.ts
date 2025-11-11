export type CompanySize =
  | "<25/<$10M"
  | "25-100/$10-50M"
  | "100-500/$50-250M"
  | "500-2,000/$250M-$1B"
  | "2,000+/$1B+";

export type RoleScope = {
  hasPNL: boolean;
  directs: "<5" | "5-15" | "15-50" | "50-100" | "100+";
};

export type LocationTier = "Tier1_NY_SF" | "Tier2_BOS_DAL_AUS" | "Tier3_Other";
export type ParityRule = "MatchBands" | "Flexible";
export type CashEquityPref = "FavorCash" | "FavorEquity";

export type Inputs = {
  company?: CompanySize;
  role?: RoleScope;
  location?: LocationTier;
  parity?: ParityRule;
  mix?: CashEquityPref;
};

export type Output = {
  baseMin: number;
  baseMax: number;
  bonusPct: number;
  ltiAnnual: number;
  notes: string[];
};

export type WizardRoleScope = {
  hasPNL: boolean | null;
  directs: RoleScope["directs"] | null;
};

export type WizardAnswers = {
  company?: CompanySize;
  role: WizardRoleScope;
  location?: LocationTier;
  parity?: ParityRule;
  mix?: CashEquityPref;
};
