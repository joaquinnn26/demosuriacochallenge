import type { Metadata } from "next";
import { AdventureFinder } from "@/components/AdventureFinder";
import { SectionHeading } from "@/components/SectionHeading";
import { readPublicActivitiesFromStore } from "@/lib/activityStore";

export const metadata: Metadata = {
  title: "Próximas actividades",
  description: "Agenda dinámica de salidas de trekking, viajes, astronomía e invernales."
};

export const dynamic = "force-dynamic";

export default async function ExperiencesPage() {
  const activities = await readPublicActivitiesFromStore();

  return (
    <main className="pt-16">
      <section className="bg-carbon py-20 text-fog">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Agenda"
            title="Próximas actividades"
            body="Mosaico de salidas cargadas por fecha, duración, zona y tipo de actividad."
            light
          />
        </div>
      </section>
      <AdventureFinder initialActivities={activities} />
    </main>
  );
}
