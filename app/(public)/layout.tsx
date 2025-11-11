"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemes } from "next-themes";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="light" enableSystem>
      {children}
    </NextThemes>
  );
}
