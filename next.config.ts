import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['ws'],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
