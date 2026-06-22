import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/assets/:path*',
        destination: `${process.env.CLOUDFLARE_R2_PUBLIC_DEV_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
