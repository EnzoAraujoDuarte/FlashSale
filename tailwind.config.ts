import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        flash: "var(--color-flash)",
        drop: "var(--color-drop)",
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)"
        }
      },
      fontFamily: {
        body: ["var(--font-body)"],
        display: ["var(--font-display)"]
      },
      borderRadius: {
        card: "var(--radius-card)",
        panel: "var(--radius-lg)"
      },
      spacing: {
        section: "var(--section-gap)",
        "section-sm": "var(--section-gap-sm)"
      }
    }
  }
};

export default config;

