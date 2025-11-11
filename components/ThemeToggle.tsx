"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = (mounted ? resolvedTheme : "light") === "dark";

  return (
    <button
      type="button"
      className={cn("btn btn-ghost text-sm", className)}
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      disabled={!mounted}
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
