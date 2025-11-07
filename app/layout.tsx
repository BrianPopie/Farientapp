import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Sidebar } from "@/components/Sidebar";
import { Nav } from "@/components/Nav";
import { CitationDrawer } from "@/components/CitationDrawer";
import { DevConsoleSilencer } from "@/components/DevConsoleSilencer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Farient · Executive Compensation Intelligence",
  description: "AI-native platform for executive compensation, benchmarking, and governance workflows."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("bg-background font-sans text-foreground", inter.variable)}>
        <ThemeProvider>
          <DevConsoleSilencer />
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-1 flex-col bg-[radial-gradient(circle_at_top,_rgba(76,221,255,0.1),_transparent_60%)]">
              <Nav />
              <main className="flex-1 px-6 py-8">{children}</main>
            </div>
          </div>
          {process.env.NODE_ENV === "development" ? null : <CitationDrawer />}
        </ThemeProvider>
      </body>
    </html>
  );
}
