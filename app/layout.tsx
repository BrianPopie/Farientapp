import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Farient AI Executive Compensation Intelligence",
  description: "AI-native platform for executive compensation, benchmarking, and governance workflows."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-bg text-text antialiased">{children}</body>
    </html>
  );
}
