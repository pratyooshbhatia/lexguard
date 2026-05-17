import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { sm: "640px", md: "768px", lg: "960px", xl: "1100px" }
    },
    extend: {
      colors: {
        // Calm, trustworthy palette — fintech / safety oriented
        ink: {
          DEFAULT: "#0F172A",
          muted: "#475569",
          soft: "#64748B"
        },
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F8FAFC",
          raised: "#FFFFFF",
          inverted: "#0F172A"
        },
        brand: {
          50: "#EEF4FF",
          100: "#DCE7FF",
          500: "#3D6BFF",
          600: "#2E55E0",
          700: "#2444B8"
        },
        // Keep custom risk palette for the SVG score dial stroke utilities
        risk: {
          low: "#16A34A",
          medium: "#D97706",
          high: "#DC2626",
          critical: "#991B1B"
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"]
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
        "3xl": "28px"
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -12px rgba(15,23,42,0.12)",
        lift: "0 4px 8px rgba(15,23,42,0.06), 0 20px 40px -16px rgba(15,23,42,0.16)"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" }
        }
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out",
        shimmer: "shimmer 1.4s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
