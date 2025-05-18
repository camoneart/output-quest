import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "zenn.dev",
      "placehold.jp",
      "res.cloudinary.com",
      "storage.googleapis.com",
      "img.clerk.com",
    ],
  },
  // async headers() {
  //   return [
  //     {
  //       // Apply these headers to all API routes
  //       source: "/api/:path*",
  //       headers: [
  //         { key: "Access-Control-Allow-Credentials", value: "true" },
  //         // Replace * with your specific allowed origins in production
  //         {
  //           key: "Access-Control-Allow-Origin",
  //           // 必要に応じて clerk.your-domain.com や localhost も追加してください
  //           value: "https://www.outputquest.com, https://clerk.outputquest.com",
  //         },
  //         {
  //           key: "Access-Control-Allow-Methods",
  //           value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  //         },
  //         {
  //           key: "Access-Control-Allow-Headers",
  //           value:
  //             "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
