import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        paper: "#fbfaf7",
        clay: "#d6c7b8",
        moss: "#7b8672",
        blush: "#d9b8ad"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(17, 17, 17, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
