import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211B",
        leaf: "#1B7F5C",
        coral: "#E85D4F",
        sky: "#E8F4FF",
        paper: "#F8F7F2"
      }
    }
  },
  plugins: []
};

export default config;
