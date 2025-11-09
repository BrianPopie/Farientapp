"use client";

import { BookOpen } from "lucide-react";
import { useUIStore } from "@/store/useUI";
import type { Citation } from "@/lib/types";
import { Button } from "@/components/ui/button";

type CitationChipProps = {
  citation: Citation;
  size?: "sm" | "md";
};

export function CitationChip({ citation, size = "sm" }: CitationChipProps) {
  const openCitation = useUIStore((state) => state.openCitation);

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`group gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground ${
        size === "md" ? "h-9" : "h-8"
      }`}
      onClick={() => openCitation(citation)}
    >
      <BookOpen className="h-3.5 w-3.5 text-primary" />
      {citation.filing} · p.{citation.page} · ln {citation.lineStart}-{citation.lineEnd}
    </Button>
  );
}
