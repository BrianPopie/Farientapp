import { Inputs, Output, RoleScope } from "./types";

export function compute(inputs: Required<Inputs>): Output {
  let baseMin = 180_000;
  let baseMax = 240_000;
  let bonusPct = 25;
  let ltiAnnual = 80_000;
  const notes: string[] = [];

  const locBump =
    inputs.location === "Tier1_NY_SF" ? 0.2 : inputs.location === "Tier2_BOS_DAL_AUS" ? 0.1 : 0;
  baseMin *= 1 + locBump;
  baseMax *= 1 + locBump;
  if (locBump) notes.push("Tier-1/2 location uplift applied to base.");

  if (inputs.role.hasPNL) {
    baseMin *= 1.1;
    baseMax *= 1.1;
    bonusPct += 10;
    notes.push("P&L scope increases base and bonus.");
  }
  const dirMap: Record<RoleScope["directs"], number> = {
    "<5": 0,
    "5-15": 0.05,
    "15-50": 0.1,
    "50-100": 0.15,
    "100+": 0.2
  };
  const d = dirMap[inputs.role.directs];
  baseMin *= 1 + d;
  baseMax *= 1 + d;

  const size = inputs.company;
  if (size === "<25/<$10M") {
    baseMin *= 0.9;
    baseMax *= 0.9;
    bonusPct -= 5;
    ltiAnnual *= 0.7;
  } else if (size === "25-100/$10-50M") {
    baseMin *= 0.95;
    baseMax *= 0.95;
    ltiAnnual *= 0.95;
  } else if (size === "500-2,000/$250M-$1B") {
    baseMin *= 1.1;
    baseMax *= 1.1;
    ltiAnnual *= 1.2;
  } else if (size === "2,000+/$1B+") {
    baseMin *= 1.2;
    baseMax *= 1.2;
    ltiAnnual *= 1.4;
  }

  if (inputs.parity === "MatchBands") {
    const cap = 1.1 * 240_000;
    baseMax = Math.min(baseMax, cap);
    notes.push("Capped to internal bands; limited stretch.");
  }

  const totalShift = 0.1;
  if (inputs.mix === "FavorCash") {
    baseMin *= 1 + totalShift;
    baseMax *= 1 + totalShift;
    ltiAnnual *= 1 - totalShift;
    notes.push("Cash-tilt: shifted value from LTI to base.");
  } else {
    baseMin *= 1 - totalShift;
    baseMax *= 1 - totalShift;
    ltiAnnual *= 1 + totalShift;
    notes.push("Equity-tilt: shifted value from base to LTI.");
  }

  baseMin = Math.max(120_000, Math.round(baseMin / 1000) * 1000);
  baseMax = Math.max(baseMin + 10_000, Math.round(baseMax / 1000) * 1000);
  bonusPct = Math.min(60, Math.max(10, Math.round(bonusPct)));
  ltiAnnual = Math.max(0, Math.round(ltiAnnual / 1000) * 1000);

  return { baseMin, baseMax, bonusPct, ltiAnnual, notes };
}
