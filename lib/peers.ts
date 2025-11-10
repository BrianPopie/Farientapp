export type PeerRuleInput = {
  ticker: string;
  industry: string;
  model: "SaaS" | "Non-SaaS";
  rev: number;
  tsr: number;
  margin: number;
};

export type RecommendedPeer = {
  ticker: string;
  why: string;
};

export function recommendPeers(seed: PeerRuleInput, universe: PeerRuleInput[], max = 8): RecommendedPeer[] {
  const sameIndustry = universe.filter((p) => p.industry === seed.industry && p.ticker !== seed.ticker);
  const revOK = sameIndustry.filter((p) => p.rev >= seed.rev * 0.7 && p.rev <= seed.rev * 1.3);
  const modelOK = revOK.filter((p) => p.model === seed.model);
  const scored = modelOK
    .map((p) => ({
      p,
      score: Math.abs(p.tsr - seed.tsr) + Math.abs(p.margin - seed.margin)
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, max)
    .map(({ p }) => ({
      ticker: p.ticker,
      why: `${p.industry}, ${p.model}, rev~${Math.round(p.rev / 1e6)}M, TSR_delta=${(p.tsr - seed.tsr).toFixed(1)}pp`
    }));
  return scored;
}
