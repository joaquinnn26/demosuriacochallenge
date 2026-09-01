"use client";

import { useEffect, useMemo, useState } from "react";
import { type CircleMarkerOptions, type LatLngBoundsExpression, type LatLngExpression } from "leaflet";
import { categoryLabels, type Activity } from "@/data/activities";
import {
  formatActivityDate,
  formatActivityDistance,
  formatActivityDuration
} from "@/lib/activityUtils";

type ReactLeafletRuntime = Pick<
  typeof import("react-leaflet"),
  "CircleMarker" | "MapContainer" | "Popup" | "TileLayer" | "useMap"
>;

const defaultCenter: LatLngExpression = [40.4168, -3.7038];

function hasCoordinates(activity: Activity) {
  return Number.isFinite(activity.latitude) && Number.isFinite(activity.longitude);
}

function getMarkerStyle(isActive: boolean): CircleMarkerOptions {
  return {
    color: isActive ? "#10130f" : "#f4f2ec",
    fillColor: isActive ? "#c36a3d" : "#77966d",
    fillOpacity: 0.96,
    opacity: 1,
    radius: isActive ? 12 : 8,
    weight: isActive ? 4 : 2
  };
}

function FitBounds({
  activities,
  useMapHook
}: {
  activities: Activity[];
  useMapHook: ReactLeafletRuntime["useMap"];
}) {
  const map = useMapHook();

  useEffect(() => {
    if (!activities.length) return;

    const points = activities.map((activity) => [activity.latitude!, activity.longitude!] as [number, number]);
    if (points.length === 1) {
      map.setView(points[0], 11);
      return;
    }

    map.fitBounds(points as LatLngBoundsExpression, { padding: [40, 40] });
  }, [activities, map]);

  return null;
}

export function LeafletDestinationMap({ initialActivities = [] }: { initialActivities?: Activity[] }) {
  const [leaflet, setLeaflet] = useState<ReactLeafletRuntime | null>(null);
  const mappedActivities = useMemo(() => initialActivities.filter(hasCoordinates), [initialActivities]);
  const [activeSlug, setActiveSlug] = useState(mappedActivities[0]?.slug ?? "");

  useEffect(() => {
    const reactLeaflet = require("react-leaflet") as ReactLeafletRuntime;

    setLeaflet({
      CircleMarker: reactLeaflet.CircleMarker,
      MapContainer: reactLeaflet.MapContainer,
      Popup: reactLeaflet.Popup,
      TileLayer: reactLeaflet.TileLayer,
      useMap: reactLeaflet.useMap
    });
  }, []);

  useEffect(() => {
    if (!mappedActivities.length) {
      setActiveSlug("");
      return;
    }

    if (!mappedActivities.some((activity) => activity.slug === activeSlug)) {
      setActiveSlug(mappedActivities[0].slug);
    }
  }, [activeSlug, mappedActivities]);

  if (!leaflet) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1.45fr_0.55fr]">
        <div className="h-[500px] rounded-sm bg-carbon" />
        <div className="h-[500px] rounded-sm bg-white shadow-sm" />
      </div>
    );
  }

  if (!mappedActivities.length) {
    return (
      <div className="rounded-sm bg-white p-8 text-center shadow-sm">
        <p className="font-bold">Todavía no hay actividades con ubicación de mapa.</p>
        <p className="mt-2 text-carbon/60">Cargá un link de Google Maps con coordenadas desde el panel admin.</p>
      </div>
    );
  }

  const active = mappedActivities.find((activity) => activity.slug === activeSlug) ?? mappedActivities[0];
  const activeImage = active.images?.[0] ?? active.image;
  const { CircleMarker, MapContainer, Popup, TileLayer, useMap } = leaflet;

  return (
    <div className="grid gap-5">
      <div className="flex gap-3 overflow-x-auto pb-1">
        {mappedActivities.map((activity) => (
          <button
            key={activity.slug}
            type="button"
            onClick={() => setActiveSlug(activity.slug)}
            className={`focus-ring min-w-fit rounded-full border px-5 py-3 text-left text-xs font-black uppercase tracking-wide transition ${
              activeSlug === activity.slug
                ? "border-ember bg-ember text-white"
                : "border-fog/20 bg-fog text-carbon hover:border-moss hover:bg-white"
            }`}
          >
            <span className="block">{activity.name}</span>
            <span className="mt-1 block text-[0.68rem] font-semibold opacity-70">
              {formatActivityDate(activity)}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="min-h-[500px] overflow-hidden rounded-sm bg-carbon shadow-sm">
          <MapContainer center={defaultCenter} zoom={6} scrollWheelZoom className="h-[500px] w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBounds activities={mappedActivities} useMapHook={useMap} />
            {mappedActivities.map((activity) => (
              <CircleMarker
                key={activity.slug}
                center={[activity.latitude!, activity.longitude!]}
                pathOptions={getMarkerStyle(activeSlug === activity.slug)}
                eventHandlers={{ click: () => setActiveSlug(activity.slug) }}
              >
                <Popup>
                  <strong>{activity.name}</strong>
                  <br />
                  {formatActivityDate(activity)}
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        <article className="max-h-[500px] overflow-y-auto rounded-sm bg-white p-5 shadow-sm lg:h-[500px]">
          <div className="aspect-[16/10] shrink-0 overflow-hidden rounded-sm bg-carbon">
            <img
              src={activeImage}
              alt={active.imageAlt}
              className="h-full w-full object-cover"
            />
          </div>
          <p className="eyebrow mt-4">{categoryLabels[active.category]}</p>
          <h3 className="mt-2 font-display text-2xl font-black uppercase leading-none">{active.name}</h3>
          <p className="mt-1 text-sm font-black uppercase tracking-wide text-carbon/45">{active.location}</p>
          <p className="mt-3 text-sm leading-6 text-carbon/70">{active.summary}</p>

          <div className="mt-4 border-t border-carbon/10 pt-4">
            <p className="text-xs font-black uppercase tracking-wide text-carbon/45">Especificaciones</p>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <Spec label="Fecha" value={formatActivityDate(active)} />
              <Spec label="Duración" value={formatActivityDuration(active)} />
              <Spec label="Distancia" value={formatActivityDistance(active)} />
              <Spec label="Dificultad" value={active.difficulty} />
            </dl>
          </div>

          <a
            href={`/experiencias/${active.slug}`}
            className="focus-ring mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-ember px-5 py-3 text-center text-xs font-black uppercase tracking-wide text-white transition hover:bg-carbon"
          >
            Ver actividad
          </a>
        </article>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm bg-fog p-3">
      <dt className="font-black uppercase text-carbon/50">{label}</dt>
      <dd className="mt-1 font-bold">{value}</dd>
    </div>
  );
}
