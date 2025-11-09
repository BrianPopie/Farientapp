import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/globals.css";
import { AppChrome } from "@/components/AppChrome";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Farient AI Executive Compensation Intelligence",
  description: "AI-native platform for executive compensation, benchmarking, and governance workflows."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased flex justify-center w-full">
        <ThemeProvider>
          <AppChrome>{children}</AppChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
