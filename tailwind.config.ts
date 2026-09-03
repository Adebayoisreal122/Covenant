import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1220",
        cloud: "#F8FAFC",
        call: {
          blue: {
            DEFAULT: "#1E3A8A",
            light: "#3B5BDB",
            50: "#EEF2FF",
          },
          red: {
            DEFAULT: "#DC2626",
            dark: "#B91C1C",
          },
          orange: {
            DEFAULT: "#F97316",
            light: "#FDBA74",
          },
        },
      },
      fontFamily: {
        display: ["var(--font-sora)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "call-gradient": "linear-gradient(135deg, #1E3A8A 0%, #142863 55%, #0B1220 100%)",
        "cta-gradient": "linear-gradient(90deg, #DC2626 0%, #F97316 100%)",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.6" },
          "80%": { transform: "scale(1.8)", opacity: "0" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
