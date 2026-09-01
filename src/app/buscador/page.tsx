import type { Metadata } from "next";
import { AdventureFinder } from "@/components/AdventureFinder";
import { readPublicActivitiesFromStore } from "@/lib/activityStore";

export const metadata: Metadata = {
  title: "Buscador de actividades",
  description: "Filtra próximas actividades por duración, zona, tipo de salida y dificultad."
};

export const dynamic = "force-dynamic";

export default async function FinderPage() {
  const activities = await readPublicActivitiesFromStore();

  return (
    <main className="pt-16">
      <AdventureFinder initialActivities={activities} />
    </main>
  );
}
