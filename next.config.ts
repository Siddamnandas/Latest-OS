import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Minimal working config for latest Next.js 15 */
  outputFileTracingRoot: process.cwd(),

  // Enable TypeScript error ignoring for demo
  typescript: {
    ignoreBuildErrors: false, // Enable strict mode
  },

  // Basic performance optimizations
  poweredByHeader: false,
  compress: true,
  reactStrictMode: false,

  // Simple image optimization
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    domains: ['localhost'],
  },

  // Minimal webpack config for stability
  webpack: (config, { dev }) => {
    if (dev) {
      // Clean webpack for development
      config.watchOptions = {
        poll: false, // Let Next.js handle watching
      };
    }

    return config;
  },

  // Allow ESLint errors for demo
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
