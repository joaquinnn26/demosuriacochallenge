import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        carbon: "#10130f",
        pine: "#1f3d32",
        moss: "#77966d",
        stone: "#d7d2c8",
        fog: "#f4f2ec",
        ember: "#c36a3d"
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial", "sans-serif"],
        sans: ["var(--font-sans)", "Arial", "sans-serif"]
      },
      boxShadow: {
        lift: "0 24px 60px rgba(16, 19, 15, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;
