import type { NextConfig } from "next";

// Some Node setups (e.g. using `--localstorage-file`) inject a non‑DOM
// `localStorage` global into the server runtime, which breaks Next's dev
// overlay when it calls `localStorage.getItem`. Strip it out if it's not
// a real Web Storage implementation so that `typeof localStorage` is
// `undefined` again on the server.
if (typeof globalThis !== "undefined" && "localStorage" in globalThis) {
  const candidate = (globalThis as any).localStorage;
  if (!candidate || typeof candidate.getItem !== "function") {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete (globalThis as any).localStorage;
  }
}

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
