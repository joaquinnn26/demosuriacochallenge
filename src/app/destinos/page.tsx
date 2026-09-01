import type { Metadata } from "next";
import { DestinationMap } from "@/components/DestinationMap";
import { SectionHeading } from "@/components/SectionHeading";
import { destinations } from "@/data/destinations";
import { readPublicActivitiesFromStore } from "@/lib/activityStore";

export const metadata: Metadata = {
  title: "Destinos",
  description: "Mapa de destinos finales para salidas de Suriaco Challenge."
};

export const dynamic = "force-dynamic";

export default async function DestinationsPage() {
  const activities = await readPublicActivitiesFromStore();

  return (
    <main className="pt-16">
      <section className="bg-carbon py-20 text-fog">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Destinos"
            title="Explora nuestros destinos"
            body="Cada marcador indica el punto final de una salida. Hacé click para ver qué trekking o guía corresponde."
            light
          />
        </div>
      </section>
      <section className="bg-fog py-16">
        <div className="section-shell">
          <DestinationMap initialActivities={activities} />
        </div>
      </section>
      <section className="bg-white py-20">
        <div className="section-shell grid gap-6 md:grid-cols-3">
          {destinations.map((destination) => (
            <article key={destination.slug} id={destination.slug} className="overflow-hidden rounded-sm bg-fog">
              <img src={destination.image} alt={destination.imageAlt} className="h-52 w-full object-cover" loading="lazy" />
              <div className="p-5">
                <p className="eyebrow">{destination.type}</p>
                <h2 className="mt-2 font-display text-2xl font-black uppercase">{destination.name}</h2>
                <p className="mt-3 text-sm leading-6 text-carbon/70">{destination.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
