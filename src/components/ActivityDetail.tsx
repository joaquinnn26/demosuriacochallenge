import type { Activity } from "@/data/activities";
import { categoryLabels } from "@/data/activities";
import { DifficultyBadge } from "./DifficultyBadge";
import { InfoCard } from "./InfoCard";
import { ButtonLink } from "./ButtonLink";

export function ActivityDetail({ activity }: { activity: Activity }) {
  const info = [
    ["Ubicación", activity.location],
    ["Duración", activity.duration],
    ["Distancia", activity.distance],
    ["Desnivel", activity.elevation],
    ["Dificultad", activity.difficulty],
    ["Edad minima", activity.minAge],
    ["Participantes", activity.maxParticipants],
    ["Precio", activity.price]
  ];

  return (
    <main>
      <section className="relative min-h-[72svh] bg-carbon text-fog">
        <img src={activity.image} alt={activity.imageAlt} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-carbon/58" />
        <div className="section-shell relative flex min-h-[72svh] items-end pb-14 pt-28">
          <div className="max-w-4xl">
            <p className="eyebrow">{categoryLabels[activity.category]}</p>
            <h1 className="mt-4 font-display text-5xl font-black uppercase leading-none md:text-7xl">
              {activity.name}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-lg font-bold">{activity.location}</span>
              <DifficultyBadge difficulty={activity.difficulty} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-fog py-14">
        <div className="section-shell">
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {info.map(([label, value]) => (
              <InfoCard key={label} label={label} value={value} />
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="eyebrow">Experiencia</p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase leading-none">
              En qué consiste?
            </h2>
          </div>
          <div className="text-lg leading-8 text-carbon/72">
            <p>{activity.description}</p>
            <p className="mt-6 text-base leading-7 text-carbon/65">
              Antes de reservar se confirma fecha, punto de encuentro, cupo disponible y equipo necesario para llegar preparado.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-carbon py-20 text-fog">
        <div className="section-shell grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-80 overflow-hidden rounded-sm bg-pine">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
              alt="Mapa visual del destino"
              className="absolute inset-0 h-full w-full object-cover opacity-50"
              loading="lazy"
            />
            <div className="absolute inset-0 grid place-items-center bg-carbon/35 p-8 text-center">
              <div>
                <p className="eyebrow">Ubicación del destino</p>
                <p className="mt-3 max-w-md text-lg font-semibold">
                  Esta salida termina en {activity.location}. En el mapa de destinos podes ver el punto final de referencia.
                </p>
              </div>
            </div>
          </div>
          <div>
            <p className="eyebrow">La salida</p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase">Puntos principales</h2>
            <ol className="mt-8 grid gap-4">
              {activity.routePoints.map((point, index) => (
                <li key={point} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-moss text-sm font-black text-carbon">
                    {index + 1}
                  </span>
                  <span className="pt-1 text-lg font-semibold">{point}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-fog py-20">
        <div className="section-shell grid gap-8 lg:grid-cols-2">
            <ListBlock title="Qué incluye" items={activity.includes} />
          <div className="grid gap-6">
            <ListBlock title="Equipo obligatorio" items={activity.requiredGear} />
            <ListBlock title="Equipo recomendado" items={activity.recommendedGear} />
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="section-shell rounded-sm bg-carbon p-8 text-fog md:p-12">
          <p className="eyebrow">Antes de reservar</p>
          <h2 className="mt-3 font-display text-4xl font-black uppercase">Consultá si esta salida es para vos</h2>
          <p className="mt-4 max-w-2xl text-lg text-fog/72">
            Contanos tu experiencia previa, edad, condición física, disponibilidad y si venís solo o en grupo. Con eso podemos recomendarte fecha, dificultad y equipo necesario.
          </p>
          <div className="mt-8">
            <ButtonLink href="/contacto">Consultar salida</ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-sm bg-white p-6 shadow-sm">
      <h3 className="font-display text-3xl font-black uppercase">{title}</h3>
      <ul className="mt-5 grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-carbon/72">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-moss" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
