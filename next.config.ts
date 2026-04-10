import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "darkanddarker.wiki.spellsandguns.com",
      },
    ],
  },
};

export default nextConfig;
