/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#12172B",
          light: "#1C2340",
          muted: "#3B4266",
        },
        paper: "#F3F5F7",
        brass: {
          DEFAULT: "#C98A3E",
          deep: "#8C5A1E",
          light: "#E8B978",
        },
        success: "#227C5B",
        danger: "#C4453A",
        ink900: "#0B0E1C",
        slate: {
          text: "#1C2333",
          muted: "#6B7280",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(18,23,43,0.04), 0 4px 16px rgba(18,23,43,0.06)",
        rung: "inset 0 0 0 2px rgba(201,138,62,0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
