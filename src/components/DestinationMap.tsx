"use client";

import { useEffect, useState } from "react";
import type { Activity } from "@/data/activities";
import { LeafletDestinationMap } from "@/components/LeafletDestinationMap";

function MapSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.45fr_0.55fr]">
      <div className="h-[500px] rounded-sm bg-carbon" />
      <div className="h-[500px] rounded-sm bg-white shadow-sm" />
    </div>
  );
}

export function DestinationMap({ initialActivities = [] }: { initialActivities?: Activity[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <MapSkeleton />;
  }

  return <LeafletDestinationMap initialActivities={initialActivities} />;
}
