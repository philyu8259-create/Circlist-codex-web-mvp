import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb"
    }
  },
  outputFileTracingRoot: process.cwd(),
  reactStrictMode: true
};

export default nextConfig;
