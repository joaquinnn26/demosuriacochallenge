import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActivityDetail } from "@/components/ActivityDetail";
import { activities, getActivityBySlug } from "@/data/activities";

type PageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return activities.map((activity) => ({ slug: activity.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const activity = getActivityBySlug(params.slug);
  if (!activity) return {};

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

export default function ActivityPage({ params }: PageProps) {
  const activity = getActivityBySlug(params.slug);
  if (!activity) notFound();

  return <ActivityDetail activity={activity} />;
}
