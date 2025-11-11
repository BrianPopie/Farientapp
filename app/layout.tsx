import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/lib/theme/tokens.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Farient AI Executive Compensation Intelligence",
  description: "AI-native platform for executive compensation, benchmarking, and governance workflows.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg" }]
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[rgb(var(--bg))] text-[rgb(var(--text))] antialiased">{children}</body>
    </html>
  );
}
