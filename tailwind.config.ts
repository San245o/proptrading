import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f1013"
      },
      boxShadow: {
        glass: "0 8px 40px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
};

export default config;
