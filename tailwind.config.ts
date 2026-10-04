import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./packages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nhs: {
          blue: "#005EB8",
          darkblue: "#002F6C",
          brightblue: "#0072CE",
          lightpink: "#F4DCD6",
          darkpink: "#E06F65",
          red: "#D5281B",
          darkred: "#8A1538",
          yellow: "#FAE100",
          warmyellow: "#FFB81C",
          green: "#007F3B",
          aqua: "#00A499",
          black: "#212B32",
          darkgrey: "#425563",
          midgrey: "#768692",
          paleblue: "#E8EDEE",
          lightgrey: "#F0F4F5",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
