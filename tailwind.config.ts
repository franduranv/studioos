import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ZXY brand palette
        zxy: {
          bg: "#0A0A0F",
          surface: "#12121A",
          border: "#1E1E2E",
          accent: "#6C63FF",
          "accent-2": "#FF6B6B",
          "accent-3": "#43D9A2",
          muted: "#4A4A6A",
          text: "#E2E2F0",
          "text-dim": "#8888AA",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
