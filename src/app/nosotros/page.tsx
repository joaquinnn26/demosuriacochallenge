import type { Metadata } from "next";
import Link from "next/link";
import { GuideCard } from "@/components/GuideCard";
import { SectionHeading } from "@/components/SectionHeading";
import { guides } from "@/data/guides";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Filosofía, equipo y forma de trabajo de Suriaco Challenge."
};

export default function AboutPage() {
  return (
    <main className="pt-16">
      <section className="relative min-h-[68svh] bg-carbon text-fog">
        <img
          src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1800&q=80"
          alt="Grupo en una cumbre mirando un valle de montaña"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-carbon/62" />
        <div className="section-shell relative flex min-h-[68svh] items-end pb-14 pt-24">
          <div className="max-w-4xl">
            <p className="eyebrow">Sobre nosotros</p>
            <h1 className="mt-4 font-display text-5xl font-black uppercase leading-none md:text-7xl">
              Experiencias, no excursiones.
            </h1>
          </div>
        </div>
      </section>
      <section className="bg-fog py-20">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="Filosofía"
            title="Montaña, seguridad y comunidad"
            body="Suriaco Challenge propone salidas guiadas con información clara, lectura responsable del terreno y acompañamiento antes, durante y después de la actividad."
          />
          <div className="rounded-sm bg-white p-7 text-lg leading-8 text-carbon/72 shadow-sm">
            <p>
              La idea no es llevar gente a caminar sin contexto. Cada experiencia busca que el participante entienda el destino, el nivel de dificultad, el equipo necesario y el sentido de la salida.
            </p>
            <p className="mt-5">
              Por eso la consulta previa importa: permite recomendar mejor, cuidar el ritmo del grupo y evitar que alguien reserve una actividad que no se ajusta a su condición o expectativas.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/equipo" className="focus-ring rounded-full bg-pine px-5 py-3 text-sm font-black uppercase text-fog">
                Ver equipo
              </Link>
              <Link href="/sostenibilidad" className="focus-ring rounded-full border border-carbon/15 px-5 py-3 text-sm font-black uppercase">
                Sostenibilidad
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white py-20">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Guías"
            title="Las personas detrás de cada salida"
            body="Perfiles preparados para mostrar roles, especialidades y responsabilidades dentro de Suriaco Challenge."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {guides.map((guide) => (
              <GuideCard key={guide.name} guide={guide} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
