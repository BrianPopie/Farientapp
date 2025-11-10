import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/globals.css";
import { AppChrome } from "@/components/AppChrome";
import { ThemeProvider } from "@/components/theme-provider";
import ClientRuntimeListener from "@/app/(instrumentation)/client-runtime-listener";

export const metadata: Metadata = {
  title: "Farient AI Executive Compensation Intelligence",
  description: "AI-native platform for executive compensation, benchmarking, and governance workflows."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex w-full min-h-screen justify-center bg-bg text-text antialiased">
        <ThemeProvider>
          <AppChrome>{children}</AppChrome>
        </ThemeProvider>
        <ClientRuntimeListener />
      </body>
    </html>
  );
}
