import { AdventureFinder } from "@/components/AdventureFinder";
import { ButtonLink } from "@/components/ButtonLink";
import { DestinationMap } from "@/components/DestinationMap";
import { Hero } from "@/components/Hero";
import { readPublicActivitiesFromStore } from "@/lib/activityStore";

export const dynamic = "force-dynamic";

const teamPhotos = [
  {
    src: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=900&q=82",
    alt: "Guías en una cumbre durante una salida de trekking"
  },
  {
    src: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=500&q=82",
    alt: "Grupo caminando por un sendero de montaña"
  },
  {
    src: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=500&q=82",
    alt: "Campamento en la montaña durante una salida"
  }
];

const reasons = [
  ["Guías certificados", "Acompañamiento profesional antes y durante cada actividad."],
  ["Seguridad", "Rutas planificadas, requisitos claros y ritmo acorde al grupo."],
  ["Agenda dinámica", "Salidas nuevas durante el año, cargadas por fecha, zona y tipo de actividad."],
  ["Grupos reducidos", "Mejor comunicación, mejor ritmo y una experiencia más cuidada."]
];

const gallery = [
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=82",
  "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=700&q=82",
  "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=700&q=82",
  "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=700&q=82",
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=700&q=82",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=82"
];

export default async function HomePage() {
  const activities = await readPublicActivitiesFromStore();

  return (
    <main>
      <Hero />

      <section id="experiencias" className="scroll-mt-20 bg-fog py-20">
        <div className="section-shell">
          <AdventureFinder compact initialActivities={activities} />
        </div>
      </section>

      <section id="quienes-somos" className="scroll-mt-20 bg-white py-20">
        <div className="section-shell grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative min-h-[420px]">
            <img
              src={teamPhotos[0].src}
              alt={teamPhotos[0].alt}
              className="absolute left-8 top-6 h-[320px] w-[72%] rotate-[-3deg] rounded-sm border-8 border-white object-cover shadow-lift"
            />
            <img
              src={teamPhotos[1].src}
              alt={teamPhotos[1].alt}
              className="absolute bottom-8 left-0 h-36 w-48 rotate-[-8deg] rounded-sm border-8 border-white object-cover shadow-lift"
            />
            <img
              src={teamPhotos[2].src}
              alt={teamPhotos[2].alt}
              className="absolute right-0 top-0 h-40 w-56 rotate-[5deg] rounded-sm border-8 border-white object-cover shadow-lift"
            />
          </div>

          <div>
            <p className="eyebrow">Quiénes somos</p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase leading-none md:text-6xl">
              Somos el puente entre tu grupo y la montaña
            </h2>
            <p className="mt-6 text-lg leading-8 text-carbon/68">
              Suriaco Challenge organiza salidas de trekking, ascensos, viajes y experiencias de naturaleza con guías profesionales. La agenda cambia durante el año, con actividades de día, propuestas con pernocta y viajes especiales.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-5 border-y border-carbon/10 py-6 text-center">
              <div>
                <strong className="block font-display text-4xl font-black text-moss">50</strong>
                <span className="text-xs font-black uppercase tracking-wide text-carbon/55">Actividades al año</span>
              </div>
              <div>
                <strong className="block font-display text-4xl font-black text-moss">7</strong>
                <span className="text-xs font-black uppercase tracking-wide text-carbon/55">Zonas</span>
              </div>
              <div>
                <strong className="block font-display text-4xl font-black text-moss">100%</strong>
                <span className="text-xs font-black uppercase tracking-wide text-carbon/55">Guiado</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="mapa" className="scroll-mt-20 bg-carbon py-20 text-fog">
        <div className="section-shell">
          <div className="max-w-3xl">
            <p className="eyebrow">Mapa interactivo</p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase leading-none md:text-6xl">
              Tocá un punto y elegí tu aventura
            </h2>
            <p className="mt-5 text-lg leading-8 text-fog/72">
              Puntos sobre el mapa con foto, nombre, dificultad y acción directa para consultar.
            </p>
          </div>
          <div className="mt-10 text-carbon">
            <DestinationMap initialActivities={activities} />
          </div>
        </div>
      </section>

      <section id="por-que" className="scroll-mt-20 bg-white py-20">
        <div className="section-shell">
          <div className="max-w-3xl">
            <p className="eyebrow">Por qué elegirnos</p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase leading-none md:text-6xl">
              Aventura con criterio, no improvisación
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {reasons.map(([title, body]) => (
              <article key={title} className="border-t border-carbon/15 pt-5">
                <h3 className="font-display text-2xl font-black uppercase leading-tight">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-carbon/65">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="galeria" className="scroll-mt-20 bg-fog py-20">
        <div className="section-shell">
          <div className="max-w-3xl">
            <p className="eyebrow">Galería</p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase leading-none md:text-6xl">
              Momentos reales que venden más que el texto
            </h2>
          </div>
          <div className="mt-10 grid auto-rows-[220px] grid-cols-2 gap-4 md:grid-cols-4">
            {gallery.map((src, index) => (
              <img
                key={src}
                src={src}
                alt={`Salida de trekking ${index + 1}`}
                className={`h-full w-full rounded-sm object-cover shadow-sm ${index === 0 || index === 5 ? "md:col-span-2" : ""}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="consulta" className="scroll-mt-20 bg-carbon py-20 text-fog">
        <div className="section-shell grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="eyebrow">Consulta</p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase leading-none md:text-6xl">
              Cuál va a ser tu próxima aventura?
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-fog/72">
              Contanos qué actividad estás buscando y te ayudamos a elegir.
            </p>
          </div>
          <ButtonLink href="/contacto" variant="accent" className="md:min-w-64">
            Hablar con un guía
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
