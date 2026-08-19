"use client";

import dynamic from "next/dynamic";

const LeafletDestinationMap = dynamic(
  () => import("@/components/LeafletDestinationMap").then((module) => module.LeafletDestinationMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid gap-6 lg:grid-cols-[1.45fr_0.55fr]">
        <div className="h-[500px] rounded-sm bg-carbon" />
        <div className="h-[500px] rounded-sm bg-white shadow-sm" />
      </div>
    )
  }
);

export function DestinationMap() {
  return <LeafletDestinationMap />;
}
