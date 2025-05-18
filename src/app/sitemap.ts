import { MetadataRoute } from "next";

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  const defaultPages: MetadataRoute.Sitemap = [
    {
      url: process.env.NEXT_PUBLIC_BASE_URL!,
    },
  ];

  return Promise.resolve(defaultPages);
}
