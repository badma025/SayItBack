import type { Config } from "tailwindcss";

// Palette: cool sage ground, warm paper for the letter, one deep-green accent.
// Red / amber / green are reserved for teach-back status and never decorate.
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./packages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ground: "#EDF0EC",
        paper: "#FFFEFA",
        ink: "#17201C",
        muted: "#58645E",
        faint: "#8A948F",
        line: "#D5DBD5",
        accent: { DEFAULT: "#1E5B4C", hover: "#164638", soft: "#E1ECE7" },
        ok: { DEFAULT: "#22693F", soft: "#E3F0E7", line: "#9CC7AC" },
        bad: { DEFAULT: "#B0281F", soft: "#FBE8E4", line: "#E9A79E" },
        warn: { DEFAULT: "#865400", soft: "#FAEFD7", line: "#E2C27E" },
      },
      fontFamily: {
        sans: ["var(--font-ui)", "Atkinson Hyperlegible", "Segoe UI", "system-ui", "sans-serif"],
        serif: ["var(--font-letter)", "Newsreader", "Georgia", "serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "ui-monospace", "Consolas", "monospace"],
      },
      fontSize: {
        // UI runs larger than default: the people reading it are often 70+.
        sm: ["0.9375rem", { lineHeight: "1.45" }],
        base: ["1.0625rem", { lineHeight: "1.6" }],
        lg: ["1.25rem", { lineHeight: "1.5" }],
      },
      borderRadius: {
        sheet: "14px",
      },
      boxShadow: {
        sheet: "0 1px 0 rgba(23,32,28,0.04), 0 12px 32px -18px rgba(30,60,48,0.28)",
      },
    },
  },
  plugins: [],
};

export default config;
