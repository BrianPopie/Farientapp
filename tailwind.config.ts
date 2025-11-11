import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1400px" }
    },
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        text: "rgb(var(--text) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        surface: "rgb(var(--card) / <alpha-value>)",
        "text-muted": "rgb(var(--text-muted) / <alpha-value>)",
        accent: "rgb(var(--muted) / <alpha-value>)",
        "accent-foreground": "rgb(var(--accent-foreground) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)"
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.06)"
      },
      borderRadius: { xl2: "1rem" }
    }
  },
  plugins: []
} satisfies Config;
