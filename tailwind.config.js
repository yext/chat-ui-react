module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "fade-in": "fade-in 0.4s",
        heartbeat: "heartbeat 2s ease-out infinite",
        "expand-left": "expand-left 0.5s",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        heartbeat: {
          "0%": { transform: "scale(1)" },
          "80%": { transform: "scale(1)" },
          "90%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        "expand-left": {
          "0%": { "margin-left": "100%" },
          "100%": { "margin-left": "0" },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
