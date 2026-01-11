import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.ticketm.net",
        pathname: "/dam/**",
      },
      {
        protocol: "https",
        hostname: "images.universe.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
