import type { Config } from "tailwindcss";
import tailwindConfig from "../tailwind.config";

export default {
  content: ["./src/**/*.{ts,tsx}", "./tests/**/*.{ts,tsx}"],
  theme: tailwindConfig.theme,
  plugins: tailwindConfig.plugins,
} satisfies Config;
