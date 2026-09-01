"use client";

import { useMemo, useState } from "react";
import {
  filterLabels,
  type Activity,
  type ActivityFilter
} from "@/data/activities";
import { ActivityGrid } from "./ActivityGrid";

const durationFilters: ActivityFilter[] = ["un-dia", "pernocta"];
const placeFilters: ActivityFilter[] = [
  "madrid-centro",
  "espana",
  "europa-africa",
  "sudamerica",
  "argentina"
];
const typeFilters: ActivityFilter[] = ["trekking", "invernales", "escalada", "astronomia-picos"];

export function AdventureFinder({
  compact = false,
  initialActivities = []
}: {
  compact?: boolean;
  initialActivities?: Activity[];
}) {
  const [duration, setDuration] = useState<ActivityFilter | "todas">("todas");
  const [place, setPlace] = useState<ActivityFilter | "todas">("todas");
  const [activityType, setActivityType] = useState<ActivityFilter | "todas">("todas");

  const filtered = useMemo(
    () =>
      initialActivities.filter((activity) => {
        return (
          (duration === "todas" || activity.filters.includes(duration)) &&
          (place === "todas" || activity.filters.includes(place)) &&
          (activityType === "todas" || activity.filters.includes(activityType))
        );
      }),
    [activityType, duration, initialActivities, place]
  );

  const hasActiveFilters = duration !== "todas" || place !== "todas" || activityType !== "todas";

  const resetFilters = () => {
    setDuration("todas");
    setPlace("todas");
    setActivityType("todas");
  };

  return (
    <section className={compact ? "" : "bg-fog py-20"}>
      <div className={compact ? "" : "section-shell"}>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.4fr]">
          <div>
            <p className="eyebrow">Buscador de salidas</p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase leading-none md:text-6xl">
              Próximas actividades
            </h2>
            <p className="mt-5 text-lg leading-8 text-carbon/68">
              Filtrá el mosaico por duración, destino o tipo de actividad según las categorías de selección de Suriaco Challenge.
            </p>
          </div>
          <div className="rounded-sm border border-carbon/10 bg-white p-4 shadow-sm md:p-5">
            <div className="grid items-end gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)_minmax(0,1fr)_auto]">
              <FilterSelect
                label="Duración"
                value={duration}
                options={durationFilters}
                onChange={setDuration}
              />
              <FilterSelect
                label="Lugares"
                value={place}
                options={placeFilters}
                onChange={setPlace}
              />
              <FilterSelect
                label="Tipo"
                value={activityType}
                options={typeFilters}
                onChange={setActivityType}
              />
              <button
                type="button"
                onClick={resetFilters}
                disabled={!hasActiveFilters}
                className="focus-ring h-12 rounded-sm border border-carbon/15 px-5 text-xs font-black uppercase tracking-wide text-carbon transition hover:border-pine disabled:cursor-not-allowed disabled:opacity-40"
              >
                Limpiar
              </button>
            </div>
            <div className="mt-4 border-t border-carbon/10 pt-4">
              <p className="text-sm font-bold text-carbon/60">
                {filtered.length} actividad{filtered.length === 1 ? "" : "es"} encontrada{filtered.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-10">
          {filtered.length ? (
            <ActivityGrid activities={filtered} />
          ) : (
            <div className="rounded-sm border border-carbon/10 bg-white p-8 text-center">
              <p className="font-bold">No hay actividades cargadas para esa combinación.</p>
              <p className="mt-2 text-carbon/60">Probá ampliar los filtros o consultar por una salida a medida.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: ActivityFilter | "todas";
  options: ActivityFilter[];
  onChange: (value: ActivityFilter | "todas") => void;
}) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className="text-xs font-black uppercase tracking-wide text-carbon/55">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as ActivityFilter | "todas")}
        className="focus-ring h-12 w-full min-w-0 rounded-sm border border-carbon/15 bg-fog px-4 text-sm font-bold text-carbon"
      >
        <option value="todas">Todas</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {filterLabels[option]}
          </option>
        ))}
      </select>
    </label>
  );
}

