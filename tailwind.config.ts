import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./node_modules/@shadcn/ui/dist/*.js"
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      borderRadius: {
        xl: "var(--radius)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      colors: {
        bg: "hsl(var(--bg) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        text: "hsl(var(--text) / <alpha-value>)",
        "text-muted": "hsl(var(--text-muted) / <alpha-value>)",
        accent: "hsl(var(--accent) / <alpha-value>)",
        "accent-foreground": "hsl(var(--accent-foreground) / <alpha-value>)",
        success: "hsl(var(--success) / <alpha-value>)",
        warning: "hsl(var(--warning) / <alpha-value>)",
        danger: "hsl(var(--danger) / <alpha-value>)",
        // legacy tokens mapped to new system for backward compatibility
        background: "hsl(var(--bg) / <alpha-value>)",
        foreground: "hsl(var(--text) / <alpha-value>)",
        card: "hsl(var(--surface) / <alpha-value>)",
        "card-foreground": "hsl(var(--text) / <alpha-value>)",
        mutedLegacy: "hsl(var(--muted) / <alpha-value>)",
        "muted-foreground": "hsl(var(--text-muted) / <alpha-value>)",
        input: "hsl(var(--border) / <alpha-value>)",
        primary: "hsl(var(--accent) / <alpha-value>)",
        "primary-foreground": "hsl(var(--accent-foreground) / <alpha-value>)"
      },
      fontSize: {
        xs: ["0.85rem", "1.45"],
        sm: ["0.95rem", "1.55"],
        base: ["1rem", "1.65"],
        lg: ["1.125rem", "1.75"],
        xl: ["1.35rem", "1.35"],
        "2xl": ["1.65rem", "1.3"],
        "3xl": ["2rem", "1.2"]
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
