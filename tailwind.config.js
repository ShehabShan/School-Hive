/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sora: ["Sora", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(15 23 42 / 0.05), 0 4px 16px -2px rgb(15 23 42 / 0.08)",
        lift: "0 12px 32px -8px rgb(15 23 42 / 0.18)",
      },
    },
  },
  daisyui: {
    themes: [
      {
        schoolhive: {
          primary: "#4f46e5",
          "primary-content": "#ffffff",
          secondary: "#312e81",
          "secondary-content": "#ffffff",
          accent: "#f59e0b",
          "accent-content": "#1f2937",
          neutral: "#0f172a",
          "neutral-content": "#f8fafc",
          "base-100": "#ffffff",
          "base-200": "#f1f5f9",
          "base-300": "#e2e8f0",
          "base-content": "#0f172a",
          info: "#0ea5e9",
          "info-content": "#082f49",
          success: "#16a34a",
          "success-content": "#ffffff",
          warning: "#d97706",
          "warning-content": "#ffffff",
          error: "#dc2626",
          "error-content": "#ffffff",
        },
      },
    ],
  },
  plugins: [typography, daisyui],
};
