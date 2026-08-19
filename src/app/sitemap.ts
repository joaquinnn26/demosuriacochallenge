import type { MetadataRoute } from "next";
import { activities } from "@/data/activities";
import { siteConfig } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/experiencias",
    "/destinos",
    "/buscador",
    "/equipo",
    "/nosotros",
    "/sostenibilidad",
    "/opiniones",
    "/contacto"
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.baseUrl}${route}`,
      lastModified: new Date()
    })),
    ...activities.map((activity) => ({
      url: `${siteConfig.baseUrl}/experiencias/${activity.slug}`,
      lastModified: new Date()
    }))
  ];
}
