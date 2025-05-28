import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "zenn.dev",
      "placehold.jp",
      "res.cloudinary.com",
      "storage.googleapis.com",
      "img.clerk.com",
    ],
  },
};

export default nextConfig;
