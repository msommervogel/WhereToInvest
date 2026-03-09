/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["'Cabinet Grotesk'", "'Syne'", "sans-serif"],
        sans:    ["'Inter'", "system-ui", "sans-serif"],
        mono:    ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
      colors: {
        bg:      "#070910",
        surface: "#0f1118",
        card:    "#141720",
        border:  "#1e2235",
        muted:   "#3d4460",
        dim:     "#6b7494",
        text:    "#e2e6f3",
        achat:   "#00e5a0",
        loc:     "#ff6040",
        accent:  "#7b68ee",
      },
      keyframes: {
        "slide-up": { from: { transform: "translateY(100%)", opacity: 0 }, to: { transform: "translateY(0)", opacity: 1 } },
      },
      animation: { "slide-up": "slide-up 0.35s cubic-bezier(0.16,1,0.3,1)" },
    },
  },
  plugins: [],
};