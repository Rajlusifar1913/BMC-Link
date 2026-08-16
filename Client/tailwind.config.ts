import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nu: {
          purple: "#820AD1",
          "purple-hover": "#6D08B1",
          "purple-light": "#8A19D6",
          "purple-soft": "#F4EBFF",
          "purple-soft-hover": "#E8D5FF",
          "purple-dark": "#4C0677",
          "purple-deep": "#1B003A",
          bg: "#F5F5F7",
          charcoal: "#111111",
          muted: "#767676",
          "card-bg": "#FFFFFF",
          ultraviolet: "#120224",
          croma: "#05201A",
          companies: "#091224",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        "nu-soft": "0 10px 30px -10px rgba(130, 10, 209, 0.12)",
        "nu-card": "0 20px 40px -15px rgba(0, 0, 0, 0.08)",
        "nu-glow": "0 0 40px rgba(130, 10, 209, 0.35)",
        "nu-elevated": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s infinite linear",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
