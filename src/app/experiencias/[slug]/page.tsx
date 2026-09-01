import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActivityDetail } from "@/components/ActivityDetail";
import { activities } from "@/data/activities";
import { getActivityBySlugFromStore } from "@/lib/activityStore";
import { isPublicActivity } from "@/lib/activityUtils";

type PageProps = {
  params: {
    slug: string;
  };
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return activities.map((activity) => ({ slug: activity.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const activity = await getActivityBySlugFromStore(params.slug);
  if (!activity || !isPublicActivity(activity)) return {};

  return {
    title: activity.name,
    description: activity.summary,
    openGraph: {
      title: activity.name,
      description: activity.summary,
      images: [{ url: activity.image, alt: activity.imageAlt }]
    }
  };
}

export default async function ActivityPage({ params }: PageProps) {
  const activity = await getActivityBySlugFromStore(params.slug);
  if (!activity || !isPublicActivity(activity)) notFound();

  return <ActivityDetail activity={activity} />;
}
