import Link from "next/link";
import type { Activity } from "@/data/activities";
import { categoryLabels } from "@/data/activities";
import { DifficultyBadge } from "./DifficultyBadge";

export function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <article className="group overflow-hidden rounded-sm bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link href={`/experiencias/${activity.slug}`} className="focus-ring block">
        <div className="relative aspect-[4/3] overflow-hidden bg-carbon">
          <img
            src={activity.image}
            alt={activity.imageAlt}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon/70 via-carbon/5 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
            <span className="rounded-sm bg-fog/90 px-3 py-1 text-xs font-black uppercase text-carbon">
              {categoryLabels[activity.category]}
            </span>
            <DifficultyBadge difficulty={activity.difficulty} />
          </div>
        </div>
        <div className="p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-carbon/50">{activity.location}</p>
          <h3 className="mt-2 font-display text-2xl font-black uppercase leading-tight text-carbon">
            {activity.name}
          </h3>
          <p className="mt-3 text-sm leading-6 text-carbon/70">{activity.summary}</p>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <span>{activity.duration}</span>
            <span>{activity.distance}</span>
            <span>{activity.price}</span>
            <span>{activity.nextDate}</span>
          </div>
          <span className="mt-5 inline-flex text-sm font-black uppercase tracking-wide text-pine">
            Ver experiencia
          </span>
        </div>
      </Link>
    </article>
  );
}
