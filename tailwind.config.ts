import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        paper: "#fffdf6",
        clay: "#fff2a3",
        moss: "#1d9fc9",
        blush: "#e774c8"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(17, 17, 17, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
