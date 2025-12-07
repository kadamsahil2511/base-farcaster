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
        'pixel-navy': '#020617',
        'pixel-cyan': '#0ea5e9',
        'pixel-lime': '#84cc16',
        'pixel-magenta': '#ec4899',
        'pixel-orange': '#f97316',
      },
      boxShadow: {
        'pixel': '4px 4px 0 0 rgba(0, 0, 0, 0.3)',
        'pixel-sm': '2px 2px 0 0 rgba(0, 0, 0, 0.3)',
        'pixel-lg': '6px 6px 0 0 rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
export default config;
