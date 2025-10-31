import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zenn.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.jp",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "/**",
      },
    ],
  },
  // React Compiler (Next.js 16)
  reactCompiler: true,
  // Cache Components - "use cache" directive (Next.js 16 stable)
  cacheComponents: true,
};

export default nextConfig;
