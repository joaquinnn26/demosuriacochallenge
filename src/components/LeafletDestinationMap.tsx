"use client";

import { useState } from "react";
import L, { type CircleMarkerOptions, type Layer, type LatLngExpression } from "leaflet";
import type { Feature, Point } from "geojson";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import { demoGeoJson, type DemoFeatureProperties } from "@/data/demoGeoJson";

const mapCenter: LatLngExpression = [-31.212, -64.781];

function getMarkerStyle(feature?: Feature<Point, DemoFeatureProperties>, activeId?: string): CircleMarkerOptions {
  const isActive = feature?.properties.id === activeId;

  return {
    color: isActive ? "#10130f" : "#f4f2ec",
    fillColor: isActive ? "#c36a3d" : "#77966d",
    fillOpacity: 0.96,
    opacity: 1,
    radius: isActive ? 12 : 8,
    weight: isActive ? 4 : 2
  };
}

export function LeafletDestinationMap() {
  const [activeId, setActiveId] = useState(demoGeoJson.features[0].properties.id);
  const active =
    demoGeoJson.features.find((feature) => feature.properties.id === activeId) ?? demoGeoJson.features[0];

  const onEachFeature = (feature: Feature<Point, DemoFeatureProperties>, layer: Layer) => {
    layer.on({
      click: () => setActiveId(feature.properties.id)
    });

    layer.bindPopup(
      `<strong>${feature.properties.name}</strong><br />${feature.properties.difficulty} - ${feature.properties.duration}`
    );
  };

  return (
    <div className="grid gap-5">
      <div className="flex gap-3 overflow-x-auto pb-1">
        {demoGeoJson.features.map((feature) => (
          <button
            key={feature.properties.id}
            type="button"
            onClick={() => setActiveId(feature.properties.id)}
            className={`focus-ring min-w-fit rounded-full border px-5 py-3 text-left text-xs font-black uppercase tracking-wide transition ${
              activeId === feature.properties.id
                ? "border-ember bg-ember text-white"
                : "border-fog/20 bg-fog text-carbon hover:border-moss hover:bg-white"
            }`}
          >
            <span className="block">{feature.properties.name}</span>
            <span className="mt-1 block text-[0.68rem] font-semibold opacity-70">
              {feature.properties.difficulty} - {feature.properties.duration}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="min-h-[500px] overflow-hidden rounded-sm bg-carbon shadow-sm">
          <MapContainer center={mapCenter} zoom={13} scrollWheelZoom className="h-[500px] w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON
              key={activeId}
              data={demoGeoJson}
              pointToLayer={(feature, latlng) =>
                L.circleMarker(latlng, getMarkerStyle(feature as Feature<Point, DemoFeatureProperties>, activeId))
              }
              onEachFeature={onEachFeature}
            />
          </MapContainer>
        </div>

        <article className="max-h-[500px] overflow-y-auto rounded-sm bg-white p-5 shadow-sm lg:h-[500px]">
          <div className="aspect-[16/10] shrink-0 overflow-hidden rounded-sm bg-carbon">
            <img
              src={active.properties.image}
              alt={active.properties.imageAlt}
              className="h-full w-full object-cover"
            />
          </div>
          <p className="eyebrow mt-4">{active.properties.category}</p>
          <h3 className="mt-2 font-display text-2xl font-black uppercase leading-none">{active.properties.name}</h3>
          <p className="mt-1 text-sm font-black uppercase tracking-wide text-carbon/45">{active.properties.trek}</p>
          <p className="mt-3 text-sm leading-6 text-carbon/70">{active.properties.summary}</p>

          <div className="mt-4 border-t border-carbon/10 pt-4">
            <p className="text-xs font-black uppercase tracking-wide text-carbon/45">Especificaciones</p>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl bg-fog p-3">
                <dt className="font-black uppercase text-carbon/50">Dificultad</dt>
                <dd className="mt-1 font-bold">{active.properties.difficulty}</dd>
              </div>
              <div className="rounded-xl bg-fog p-3">
                <dt className="font-black uppercase text-carbon/50">Duracion</dt>
                <dd className="mt-1 font-bold">{active.properties.duration}</dd>
              </div>
              <div className="rounded-xl bg-fog p-3">
                <dt className="font-black uppercase text-carbon/50">Guia</dt>
                <dd className="mt-1 font-bold">{active.properties.guide}</dd>
              </div>
              <div className="rounded-xl bg-fog p-3">
                <dt className="font-black uppercase text-carbon/50">Encuentro</dt>
                <dd className="mt-1 font-bold">{active.properties.meetingPoint}</dd>
              </div>
            </dl>
          </div>

          <a
            href="/contacto"
            className="focus-ring mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-ember px-5 py-3 text-center text-xs font-black uppercase tracking-wide text-white transition hover:bg-carbon"
          >
            Quiero hacer esta aventura
          </a>
        </article>
      </div>
    </div>
  );
}
