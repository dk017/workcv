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
        // Backdrop behind product pictures and CV thumbnails.
        sand: "#F1EFE9",
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
        // Interface text. CV and cover-letter documents use cvmuted so redesigns never change them.
        muted: "#4B5563",
        cvmuted: "#6B7280",
        line: {
          DEFAULT: "#E5E2DB",
          strong: "#C9C5BC",
        },
        success: "#2D7D52",
        redsoft: "#FFF5F5",
        greensoft: "#F0FDF4",
      },
      fontFamily: {
        // Interface headings.
        display: ["var(--font-dm-sans)", "Arial", "sans-serif"],
        // The name line on CVs and cover letters (and their PDFs); lib/cv-typography.ts measures it.
        cvname: ["var(--font-fraunces)", "Georgia", "serif"],
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
