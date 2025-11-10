import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ClientRuntimeListener from "@/app/(instrumentation)/client-runtime-listener";

const SHOW_RUNTIME_LISTENER = process.env.NODE_ENV !== "production";

export const metadata: Metadata = {
  title: "Farient AI Executive Compensation Intelligence",
  description: "AI-native platform for executive compensation, benchmarking, and governance workflows."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-bg text-text antialiased">
        <ThemeProvider>{children}</ThemeProvider>
        {SHOW_RUNTIME_LISTENER ? <ClientRuntimeListener /> : null}
      </body>
    </html>
  );
}
