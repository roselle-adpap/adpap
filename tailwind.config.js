/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#050B18",
          900: "#0A1633",
          800: "#0F2049",
          700: "#152B61",
          600: "#1C3A7E",
        },
        royal: {
          700: "#1E40AF",
          600: "#2554D6",
          500: "#3366FF",
          400: "#5B85FF",
        },
        gold: {
          600: "#A87B1F",
          500: "#C9982F",
          400: "#E0B94D",
          300: "#EFD48A",
        },
        mist: {
          50: "#F7F8FA",
          100: "#EEF1F5",
          200: "#E2E6ED",
          300: "#C9D0DB",
          400: "#9AA4B2",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      opacity: Object.fromEntries(Array.from({ length: 101 }, (_, i) => [i, (i / 100).toString()])),
      boxShadow: {
        card: "0 1px 2px rgba(10,22,51,0.06), 0 8px 24px -8px rgba(10,22,51,0.15)",
        elevated: "0 20px 60px -15px rgba(10,22,51,0.35)",
      },
      backgroundImage: {
        "navy-grid":
          "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
