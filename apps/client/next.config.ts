import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // disable eslint
  eslint: {
    ignoreDuringBuilds: true,
  },
  // allow images from Unsplash
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
