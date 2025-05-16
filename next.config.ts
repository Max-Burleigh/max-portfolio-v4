import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  poweredByHeader: false,
};

export default nextConfig;
