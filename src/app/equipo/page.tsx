import type { Metadata } from "next";
import { GuideCard } from "@/components/GuideCard";
import { SectionHeading } from "@/components/SectionHeading";
import { guides } from "@/data/guides";

export const metadata: Metadata = {
  title: "Nuestro equipo",
  description: "Guías, coordinadores y roles de Suriaco Challenge."
};

export default function TeamPage() {
  return (
    <main className="pt-16">
      <section className="bg-carbon py-20 text-fog">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Nuestro equipo"
            title="Conocé a quienes acompañan cada salida"
            body="Roles operativos para explicar quién guía, quién coordina y cómo se organiza la experiencia."
            light
          />
        </div>
      </section>
      <section className="bg-fog py-16">
        <div className="section-shell grid gap-6 md:grid-cols-2">
          {guides.map((guide) => (
            <GuideCard key={guide.name} guide={guide} />
          ))}
        </div>
      </section>
    </main>
  );
}
