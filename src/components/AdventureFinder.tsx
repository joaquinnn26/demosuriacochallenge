"use client";

import { useMemo, useState } from "react";
import { activities, categoryLabels, type ActivityCategory, type ActivityDifficulty, type ActivityDuration } from "@/data/activities";
import { ActivityGrid } from "./ActivityGrid";

const categories: ActivityCategory[] = [
  "trekking",
  "astronomia",
  "camping",
  "montana",
  "familia",
  "viajes",
  "grupos",
  "especiales"
];
const durations: ActivityDuration[] = ["Medio día", "1 día", "Fin de semana", "Varios días"];
const difficulties: ActivityDifficulty[] = ["Fácil", "Media", "Difícil"];

export function AdventureFinder({ compact = false }: { compact?: boolean }) {
  const [category, setCategory] = useState<ActivityCategory | "todas">("todas");
  const [duration, setDuration] = useState<ActivityDuration | "todas">("todas");
  const [difficulty, setDifficulty] = useState<ActivityDifficulty | "todas">("todas");

  const filtered = useMemo(
    () =>
      activities.filter((activity) => {
        return (
          (category === "todas" || activity.category === category) &&
          (duration === "todas" || activity.duration === duration) &&
          (difficulty === "todas" || activity.difficulty === difficulty)
        );
      }),
    [category, difficulty, duration]
  );

  return (
    <section className={compact ? "" : "bg-fog py-20"}>
      <div className={compact ? "" : "section-shell"}>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.4fr]">
          <div>
            <p className="eyebrow">Buscador de salidas</p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase leading-none md:text-6xl">
              Qué tipo de salida estás buscando?
            </h2>
            <p className="mt-5 text-lg leading-8 text-carbon/68">
              Filtrá las propuestas según tipo de actividad, duración y dificultad para encontrar una salida compatible con tu nivel.
            </p>
          </div>
          <div className="rounded-sm bg-white p-5 shadow-sm md:p-7">
            <FilterGroup label="Tipo de aventura">
              <FilterButton active={category === "todas"} onClick={() => setCategory("todas")}>
                Todas
              </FilterButton>
              {categories.map((item) => (
                <FilterButton key={item} active={category === item} onClick={() => setCategory(item)}>
                  {categoryLabels[item]}
                </FilterButton>
              ))}
            </FilterGroup>
            <FilterGroup label="Cuanto tiempo tenes?">
              <FilterButton active={duration === "todas"} onClick={() => setDuration("todas")}>
                Cualquiera
              </FilterButton>
              {durations.map((item) => (
                <FilterButton key={item} active={duration === item} onClick={() => setDuration(item)}>
                  {item}
                </FilterButton>
              ))}
            </FilterGroup>
            <FilterGroup label="Que dificultad buscas?">
              <FilterButton active={difficulty === "todas"} onClick={() => setDifficulty("todas")}>
                Cualquiera
              </FilterButton>
              {difficulties.map((item) => (
                <FilterButton key={item} active={difficulty === item} onClick={() => setDifficulty(item)}>
                  {item}
                </FilterButton>
              ))}
            </FilterGroup>
          </div>
        </div>
        <div className="mt-10">
          {filtered.length ? (
            <ActivityGrid activities={filtered} />
          ) : (
            <div className="rounded-sm border border-carbon/10 bg-white p-8 text-center">
              <p className="font-bold">No hay experiencias compatibles con esa combinacion.</p>
              <p className="mt-2 text-carbon/60">Proba ampliar los filtros o consultar por una salida a medida.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-carbon/10 py-5 first:pt-0 last:border-0 last:pb-0">
      <legend className="mb-3 text-xs font-black uppercase tracking-wide text-carbon/55">{label}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function FilterButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`focus-ring rounded-full border px-4 py-2 text-sm font-bold transition ${
        active
          ? "border-pine bg-pine text-fog"
          : "border-carbon/15 bg-fog text-carbon hover:border-pine"
      }`}
    >
      {children}
    </button>
  );
}

