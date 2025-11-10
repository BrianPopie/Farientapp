export type GuidanceBlock = {
  vehicles?: string;
  metrics?: string;
  vesting?: string;
  rationale?: string;
};

export type InsightPayload = {
  body: string;
  citations: string[];
  guidance?: GuidanceBlock | null;
  raw: string;
};

const GUIDANCE_KEYS = ["vehicles", "metrics", "vesting", "rationale"];
const SECTION_BULLET = "\u2022";

export function splitGuidance(raw: string): { body: string; guidance: GuidanceBlock | null } {
  const markerIndex = raw.toLowerCase().indexOf("guidance");
  if (markerIndex === -1) {
    return { body: raw.trim(), guidance: null };
  }
  const body = raw.slice(0, markerIndex).trim();
  const guidanceSection = raw.slice(markerIndex).trim();
  const guidance: GuidanceBlock = {};
  const lines = guidanceSection.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  lines.forEach((line) => {
    const normalized = line.replace(/^[-\u2022]\s*/, "");
    GUIDANCE_KEYS.forEach((key) => {
      if (normalized.toLowerCase().startsWith(`${key}:`)) {
        guidance[key as keyof GuidanceBlock] = normalized.slice(key.length + 1).trim();
      }
    });
  });

  const hasValues = Object.values(guidance).some((value) => Boolean(value && value.length));
  return { body: body || raw.trim(), guidance: hasValues ? guidance : null };
}

export function extractCitations(text: string): string[] {
  const matches = text.match(/\[cit:[^\]]+\]/gi);
  if (!matches) {
    return [];
  }
  const unique = Array.from(new Set(matches.map((match) => match.replace(/\[|\]/g, "").trim())));
  return unique;
}

export function mapInsightSegments(body: string): {
  recommendation?: string;
  rationale?: string;
  alignment?: string;
} {
  const segments = body
    .split(SECTION_BULLET)
    .map((segment) => segment.trim())
    .filter(Boolean);

  const clean = (value?: string) =>
    value
      ?.replace(/^Insight/i, "")
      ?.replace(/^Why it matters/i, "")
      ?.replace(/^Next step/i, "")
      ?.trim();

  return {
    recommendation: clean(segments[0]) ?? "",
    rationale: clean(segments[1]) ?? "",
    alignment: clean(segments[2]) ?? ""
  };
}

export function buildInsightPayload(raw: string): InsightPayload {
  const { body, guidance } = splitGuidance(raw);
  return {
    body,
    citations: extractCitations(raw),
    guidance,
    raw: raw.trim()
  };
}
