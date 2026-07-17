/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Teko"', "Impact", "sans-serif"],
        body: ['"Karla"', "ui-sans-serif", "sans-serif"],
      },
      colors: {
        pitch: {
          950: "#070708",
          900: "#0E0E10",
          800: "#16161A",
          700: "#222228",
        },
        united: {
          red: "#DA291C",
          crimson: "#A01A14",
          gold: "#F5C518",
          bone: "#F4EDE4",
          mist: "#C8C2BA",
        },
      },
      boxShadow: {
        jumbo: "0 0 0 1px rgba(218,41,28,0.35), 0 28px 80px rgba(0,0,0,0.55)",
        glow: "0 0 40px rgba(218,41,28,0.35)",
      },
      keyframes: {
        pulseLive: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        pulseLive: "pulseLive 1.2s ease-in-out infinite",
        riseIn: "riseIn 0.7s ease-out both",
        marquee: "marquee 40s linear infinite",
        scan: "scan 6s linear infinite",
      },
    },
  },
  plugins: [],
};
