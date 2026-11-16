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
        pharmadi: {
          blue: "#0284C7",
          "blue-dark": "#0369A1",
          "blue-light": "#EEF9FF",
          "blue-subtle": "#E0F2FE",
          accent: "#0284C7",
          green: "#059669",
          "green-subtle": "#ECFDF5",
          red: "#EF4444",
          "red-subtle": "#FEF2F2",
          gray: {
            50: "#F8FAFC",
            100: "#F1F5F9",
            200: "#E2E8F0",
            400: "#94A3B8",
            500: "#64748B",
            700: "#334155",
            900: "#0F172A",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
