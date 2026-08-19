import type { Activity } from "@/data/activities";
import { ActivityCard } from "./ActivityCard";

export function ActivityGrid({ activities }: { activities: Activity[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {activities.map((activity) => (
        <ActivityCard key={activity.slug} activity={activity} />
      ))}
    </div>
  );
}
