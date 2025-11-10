"use client";

import { BookOpen } from "lucide-react";
import { useUIStore } from "@/store/useUI";
import type { Citation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CitationChipProps = {
  citation: Citation;
  size?: "sm" | "md";
};

export function CitationChip({ citation, size = "sm" }: CitationChipProps) {
  const openCitation = useUIStore((state) => state.openCitation);
  const heightClass = size === "md" ? "h-9" : "h-8";

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "group gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-text-muted",
        heightClass
      )}
      onClick={() => openCitation(citation)}
    >
      <BookOpen className="h-3.5 w-3.5 text-accent" />
      {citation.filing} / p.{citation.page} / ln {citation.lineStart}-{citation.lineEnd}
    </Button>
  );
}
