// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Fail builds on type/lint issues
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },

  // Add any production image domains here
  images: {
    remotePatterns: [
      // { protocol: "https", hostname: "cdn.example.com" },
    ],
  },

  // Keep this empty unless you intentionally enable an experiment
  experimental: {},
};

export default nextConfig;
