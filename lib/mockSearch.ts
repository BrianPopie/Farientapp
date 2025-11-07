import citations from "@/data/citations.json";
import policies from "@/data/policies.json";
import companies from "@/data/companies.json";
import type { SearchResult, SearchHit } from "./types";

type ScoredHit = SearchHit & { score: number };

const tokenize = (text: string) =>
  text
    .toLowerCase()
    .split(/[\s,.;:()]+/)
    .filter(Boolean);

const scoreMatch = (queryTokens: string[], target: string) => {
  const haystack = tokenize(target);
  const hits = queryTokens.filter((token) => haystack.some((word) => word.startsWith(token)));
  return hits.length / (queryTokens.length || 1);
};

export function mockSearch(query: string): SearchResult {
  const trimmed = query.trim();
  const result: SearchResult = { query: trimmed, hits: [] };
  if (!trimmed) return result;

  const queryTokens = tokenize(trimmed);
  const companyNameById = Object.fromEntries(companies.map((c) => [c.id, c.name]));

  const citationHits: ScoredHit[] = citations
    .map((citation) => ({
      citation,
      score: scoreMatch(queryTokens, `${citation.text} ${citation.filing} ${citation.year}`)
    }))
    .filter(({ score }) => score > 0)
    .map(({ citation, score }) => ({
      id: `citation-${citation.id}`,
      type: "citation" as const,
      title: `${companyNameById[citation.companyId] ?? citation.companyId} · ${citation.filing} ${citation.year}`,
      snippet: citation.text,
      meta: `p.${citation.page} · lines ${citation.lineStart}-${citation.lineEnd}`,
      referenceId: citation.id,
      score
    }));

  const policyHits: ScoredHit[] = policies
    .map((policy) => ({
      policy,
      score: scoreMatch(queryTokens, `${policy.section} ${policy.changeSummary} ${policy.firm}`)
    }))
    .filter(({ score }) => score > 0)
    .map(({ policy, score }) => ({
      id: `policy-${policy.id}`,
      type: "policy" as const,
      title: `${policy.firm} · ${policy.section}`,
      snippet: policy.changeSummary,
      meta: `${policy.yearFrom}→${policy.yearTo}`,
      referenceId: policy.id,
      score
    }));

  result.hits = [...citationHits, ...policyHits]
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 8)
    .map((hit) => {
      const { score, ...rest } = hit;
      void score;
      return rest;
    });

  return result;
}
