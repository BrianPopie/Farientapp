"use client";

import * as React from "react";
import { Search, ExternalLink, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { mockSearch } from "@/lib/mockSearch";
import { useUIStore } from "@/store/useUI";
import type { SearchHit } from "@/lib/types";
import { Button } from "@/components/ui/button";

export function SearchInput() {
  const [value, setValue] = React.useState("");
  const [results, setResults] = React.useState<SearchHit[]>([]);
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const openCitation = useUIStore((state) => state.openCitation);
  const openPolicy = useUIStore((state) => state.openPolicy);

  React.useEffect(() => {
    if (!value) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timeout = window.setTimeout(() => {
      setResults(mockSearch(value).hits);
      setLoading(false);
    }, 200);
    return () => window.clearTimeout(timeout);
  }, [value]);

  React.useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement !== inputRef.current) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleOpen = (hit: SearchHit) => {
    if (hit.type === "citation") {
      openCitation(hit.referenceId);
    } else {
      openPolicy(hit.referenceId);
    }
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
        <Search className="h-4 w-4" />
      </div>
      <Input
        ref={inputRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search filings, policies, citations (press /)"
        className="pl-10"
      />
      {loading && <Loader2 className="absolute right-3 top-3 h-5 w-5 animate-spin text-muted-foreground" />}
      {value && results.length > 0 && (
        <div className="absolute left-0 right-0 top-14 z-30 rounded-2xl border border-white/10 bg-background/95 p-2 shadow-2xl">
          {results.map((hit) => (
            <div key={hit.id} className="flex items-start justify-between gap-3 rounded-2xl px-3 py-2 hover:bg-white/5">
              <div>
                <p className="text-sm font-medium text-white">{hit.title}</p>
                <p className="text-xs text-muted-foreground">{hit.snippet}</p>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{hit.meta}</p>
              </div>
              <Button size="sm" variant="ghost" className="gap-2 text-xs" onClick={() => handleOpen(hit)}>
                View span
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
      {value && !results.length && !loading && (
        <div className="absolute left-0 right-0 top-14 rounded-2xl border border-white/10 bg-background/90 px-4 py-3 text-sm text-muted-foreground">
          No matches yet - ingestion agents will add relevant citations after parsing.
        </div>
      )}
    </div>
  );
}
