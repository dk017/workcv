import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F8F7F3",
        surface: "#FFFFFF",
        navy: {
          DEFAULT: "#0F2942",
          hover: "#1A3D5C",
        },
        gold: {
          DEFAULT: "#D4A843",
          tint: "#F5E6C0",
        },
        ink: "#1A1A1A",
        muted: "#6B7280",
        line: {
          DEFAULT: "#E5E2DB",
          strong: "#C9C5BC",
        },
        success: "#2D7D52",
        redsoft: "#FFF5F5",
        greensoft: "#F0FDF4",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "Arial", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 60px rgba(15, 41, 66, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
