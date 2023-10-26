module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "fade-in": "fade-in 0.4s",
        "heartbeat": "heartbeat 2s ease-out infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "heartbeat": {
          "0%": { transform: "scale(1)" },
          "80%": { transform: "scale(1)" },
          "90%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        }
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
};
