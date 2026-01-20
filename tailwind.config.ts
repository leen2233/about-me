import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: "#2d2d2d",
          green: "#50fa7b",
          greenDim: "#3fb950",
          amber: "#ffb86c",
          blue: "#8be9fd",
          red: "#ff5555",
          fg: "#f8f8f2",
          muted: "#b8b8b8",
          border: "#44475a",
        },
      },
      fontFamily: {
        mono: [
          "'Fira Code'",
          "'JetBrains Mono'",
          "'Monaco'",
          "'Menlo'",
          "monospace",
        ],
      },
      animation: {
        "blink": "blink 1s step-end infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
