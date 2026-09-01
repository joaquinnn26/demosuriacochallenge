import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { readActivitiesFromStore } from "@/lib/activityStore";
import { isPublicActivity } from "@/lib/activityUtils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
  const activities = await readActivitiesFromStore();

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.baseUrl}${route}`,
      lastModified: new Date()
    })),
    ...activities.filter(isPublicActivity).map((activity) => ({
      url: `${siteConfig.baseUrl}/experiencias/${activity.slug}`,
      lastModified: new Date()
    }))
  ];
}
