import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  poweredByHeader: false,
};

// Disable telemetry during the build
process.env.NEXT_TELEMETRY_DISABLED = "1";

export default nextConfig;
