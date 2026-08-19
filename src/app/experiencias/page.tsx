import type { Metadata } from "next";
import { ActivityGrid } from "@/components/ActivityGrid";
import { AdventureFinder } from "@/components/AdventureFinder";
import { SectionHeading } from "@/components/SectionHeading";
import { activities, categoryLabels } from "@/data/activities";

export const metadata: Metadata = {
  title: "Experiencias",
  description: "Catálogo de experiencias de trekking, astronomía, camping, viajes, familia y grupos."
};

export default function ExperiencesPage() {
  return (
    <main className="pt-16">
      <section className="bg-carbon py-20 text-fog">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Catálogo"
            title="Experiencias para explorar la montaña"
            body="Actividades organizadas por categoria, destino, duracion y dificultad."
            light
          />
        </div>
      </section>
      <section className="bg-fog py-16">
        <div className="section-shell">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <a
                key={key}
                href={`#${key}`}
                className="focus-ring rounded-full bg-white px-5 py-4 text-sm font-black uppercase tracking-wide shadow-sm transition hover:bg-pine hover:text-fog"
              >
                {label}
              </a>
            ))}
          </div>
          <div className="mt-12">
            <ActivityGrid activities={activities} />
          </div>
        </div>
      </section>
      <AdventureFinder />
    </main>
  );
}
