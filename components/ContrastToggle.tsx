"use client";

import { Highlighter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContrastToggle() {
  const handleToggle = () => {
    const el = document.documentElement;
    const isHigh = el.getAttribute("data-contrast") === "high";
    el.setAttribute("data-contrast", isHigh ? "normal" : "high");
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-label="Toggle high contrast mode"
      className="gap-2 rounded-full border border-border px-3 text-sm text-text"
      onClick={handleToggle}
    >
      <Highlighter className="h-4 w-4 text-accent" />
      Contrast
    </Button>
  );
}
