import { MetadataRoute } from "next";

/* TODO: generate dynamic sitemap by pages */
/* TODO: update changeFrequency accordingly after official launch */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://guess-what/",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
