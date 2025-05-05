import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add this to help with URL handling
  // async redirects() {
  //   return [
  //     {
  //       source: "/api/auth/signin",
  //       destination: "/",
  //       permanent: true,
  //     },
  //   ];
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
