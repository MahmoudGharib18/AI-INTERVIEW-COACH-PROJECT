/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#0a0a0c",
          surface: "#121215",
          border: "#26262b",
          neonGreen: "#00ff66",
          neonOrange: "#ff5500",
          neonRed: "#ff0033",
          textMuted: "#8a8a93"
        }
      },
      boxShadow: {
        brutal: '4px 4px 0px 0px #000000',
        neon: '0 0 15px rgba(0, 255, 102, 0.2)',
      }
    },
  },
  plugins: [],
}