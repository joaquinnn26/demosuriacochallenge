import Link from "next/link";
import { ButtonLink } from "@/components/ButtonLink";
import { DestinationMap } from "@/components/DestinationMap";
import { Hero } from "@/components/Hero";

const teamPhotos = [
  {
    src: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=900&q=82",
    alt: "Guias en una cumbre durante una salida de trekking"
  },
  {
    src: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=500&q=82",
    alt: "Grupo caminando por un sendero de montana"
  },
  {
    src: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=500&q=82",
    alt: "Campamento en la montana durante una salida"
  }
];

const experiences = [
  {
    name: "Cerro Champaqui",
    place: "Cordoba",
    difficulty: "Media",
    duration: "2 dias",
    href: "/experiencias/fin-de-semana-suriaco",
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=900&q=82"
  },
  {
    name: "Cumbre Suriaco",
    place: "Suriaco",
    difficulty: "Media",
    duration: "1 dia",
    href: "/experiencias/trekking-cumbre-suriaco",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=82"
  },
  {
    name: "Noche bajo las estrellas",
    place: "Zona de vivac",
    difficulty: "Media",
    duration: "Fin de semana",
    href: "/experiencias/noche-bajo-las-estrellas",
    image: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=900&q=82"
  }
];

const reasons = [
  ["Guias certificados", "Acompanamiento profesional antes y durante cada actividad."],
  ["Seguridad", "Rutas planificadas, requisitos claros y ritmo acorde al grupo."],
  ["Experiencia", "Salidas pensadas para disfrutar la montana con criterio."],
  ["Grupos reducidos", "Mejor comunicacion, mejor ritmo y una experiencia mas cuidada."]
];

const gallery = [
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=82",
  "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=700&q=82",
  "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=700&q=82",
  "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=700&q=82",
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=700&q=82",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=82"
];

export default function HomePage() {
  return (
    <main>
      <Hero />

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
            <p className="eyebrow">Quienes somos</p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase leading-none md:text-6xl">
              Somos el puente entre tu grupo y la montana
            </h2>
            <p className="mt-6 text-lg leading-8 text-carbon/68">
              Suriaco Challenge organiza salidas de trekking, ascensos y experiencias de naturaleza con guias profesionales. Antes de cada aventura revisamos nivel, objetivos, equipo y condiciones para recomendar una salida disfrutable y responsable.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-5 border-y border-carbon/10 py-6 text-center">
              <div>
                <strong className="block font-display text-4xl font-black text-moss">8+</strong>
                <span className="text-xs font-black uppercase tracking-wide text-carbon/55">Experiencias</span>
              </div>
              <div>
                <strong className="block font-display text-4xl font-black text-moss">3</strong>
                <span className="text-xs font-black uppercase tracking-wide text-carbon/55">Niveles</span>
              </div>
              <div>
                <strong className="block font-display text-4xl font-black text-moss">100%</strong>
                <span className="text-xs font-black uppercase tracking-wide text-carbon/55">Guiado</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="experiencias" className="scroll-mt-20 bg-fog py-20">
        <div className="section-shell">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Experiencias y destinos</p>
              <h2 className="mt-3 font-display text-4xl font-black uppercase leading-none md:text-6xl">
                Explora tu proxima aventura
              </h2>
            </div>
            <ButtonLink href="/experiencias" variant="secondary" className="shrink-0">
              Ver todas
            </ButtonLink>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {experiences.map((experience) => (
              <article key={experience.name} className="group overflow-hidden rounded-sm bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                <Link href={experience.href} className="focus-ring block">
                  <div className="aspect-[4/3] overflow-hidden bg-carbon">
                    <img
                      src={experience.image}
                      alt={experience.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-black uppercase tracking-wide text-carbon/45">{experience.place}</p>
                    <h3 className="mt-2 font-display text-3xl font-black uppercase leading-tight">{experience.name}</h3>
                    <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <dt className="font-black uppercase text-carbon/45">Dificultad</dt>
                        <dd className="mt-1 font-bold">{experience.difficulty}</dd>
                      </div>
                      <div>
                        <dt className="font-black uppercase text-carbon/45">Duracion</dt>
                        <dd className="mt-1 font-bold">{experience.duration}</dd>
                      </div>
                    </dl>
                    <span className="mt-6 inline-flex text-sm font-black uppercase tracking-wide text-pine">
                      Ver experiencia
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="mapa" className="scroll-mt-20 bg-carbon py-20 text-fog">
        <div className="section-shell">
          <div className="max-w-3xl">
            <p className="eyebrow">Mapa interactivo</p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase leading-none md:text-6xl">
              Toca un punto y elegi tu aventura
            </h2>
            <p className="mt-5 text-lg leading-8 text-fog/72">
              El diferencial de la landing: puntos sobre el mapa con foto, nombre, dificultad y accion directa para consultar.
            </p>
          </div>
          <div className="mt-10 text-carbon">
            <DestinationMap />
          </div>
        </div>
      </section>

      <section id="por-que" className="scroll-mt-20 bg-white py-20">
        <div className="section-shell">
          <div className="max-w-3xl">
            <p className="eyebrow">Por que elegirnos</p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase leading-none md:text-6xl">
              Aventura con criterio, no improvisacion
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
            <p className="eyebrow">Galeria</p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase leading-none md:text-6xl">
              Momentos reales que venden mas que el texto
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
            <p className="eyebrow">CTA final</p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase leading-none md:text-6xl">
              Cual va a ser tu proxima aventura?
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-fog/72">
              Contanos que experiencia estas buscando y te ayudamos a elegir.
            </p>
          </div>
          <ButtonLink href="/contacto" variant="accent" className="md:min-w-64">
            Hablar con un guia
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
