import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force webpack builder to avoid Turbopack build issues
  experimental: {
    // turbopack removed
  },
};

export default nextConfig;
