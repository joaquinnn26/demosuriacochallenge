import type { FeatureCollection, Point } from "geojson";

export type DemoFeatureProperties = {
  id: string;
  name: string;
  trek: string;
  guide: string;
  category: string;
  summary: string;
  duration: string;
  difficulty: string;
  meetingPoint: string;
  image: string;
  imageAlt: string;
};

export type DemoFeatureCollection = FeatureCollection<Point, DemoFeatureProperties>;

export const demoGeoJson: DemoFeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "champaqui",
        name: "Cerro Champaqui",
        trek: "Ascenso al Champaqui",
        guide: "Guia Martin R.",
        category: "Ascenso",
        summary: "Una experiencia de dos dias para vivir el ascenso mas clasico de Cordoba.",
        duration: "2 dias",
        difficulty: "Media",
        meetingPoint: "Punto de encuentro a coordinar",
        image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=900&q=82",
        imageAlt: "Montanistas observando un valle desde una cumbre"
      },
      geometry: {
        type: "Point",
        coordinates: [-64.7718, -31.2068]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "cumbre-suriaco",
        name: "Cumbre Suriaco",
        trek: "Trekking Cumbre Suriaco",
        guide: "Guia Carla P.",
        category: "Trekking",
        summary: "Salida de dia completo con ascenso progresivo y vistas abiertas al valle.",
        duration: "1 dia",
        difficulty: "Media",
        meetingPoint: "Base operativa Suriaco",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=82",
        imageAlt: "Grupo caminando por sendero de montana al atardecer"
      },
      geometry: {
        type: "Point",
        coordinates: [-64.7778, -31.2071]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "mirador-del-valle",
        name: "Mirador del Valle",
        trek: "Trekking Miradores",
        guide: "Guia Lucas S.",
        category: "Familia",
        summary: "Destino accesible para grupos familiares, primeras salidas y caminatas suaves.",
        duration: "Medio dia",
        difficulty: "Baja",
        meetingPoint: "Ingreso norte del sendero",
        image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=900&q=82",
        imageAlt: "Familia caminando por un sendero de montana"
      },
      geometry: {
        type: "Point",
        coordinates: [-64.7912, -31.2192]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "campamento-cielo",
        name: "Campamento Cielo",
        trek: "Trekking Astronomico",
        guide: "Guia Sofia M.",
        category: "Nocturna",
        summary: "Caminata al atardecer, observacion del cielo y cierre nocturno.",
        duration: "Noche completa",
        difficulty: "Media",
        meetingPoint: "Estacionamiento principal",
        image: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=900&q=82",
        imageAlt: "Cielo nocturno estrellado sobre montanas"
      },
      geometry: {
        type: "Point",
        coordinates: [-64.7825, -31.1998]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "puesto-alto",
        name: "Puesto Alto",
        trek: "Trekking Puesto Alto",
        guide: "Guia Diego A.",
        category: "Trekking",
        summary: "Recorrido mas exigente para grupos con experiencia previa caminando en desnivel.",
        duration: "6 hs",
        difficulty: "Alta",
        meetingPoint: "Cruce del arroyo",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=82",
        imageAlt: "Cordillera con cumbres y valle bajo luz fria"
      },
      geometry: {
        type: "Point",
        coordinates: [-64.7719, -31.2055]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "vivac-serrano",
        name: "Vivac Serrano",
        trek: "Noche bajo las estrellas",
        guide: "Guia Paula G.",
        category: "Vivac",
        summary: "Salida para dormir en la naturaleza, aprender logistica basica y bajar el ritmo.",
        duration: "Fin de semana",
        difficulty: "Media",
        meetingPoint: "Base operativa Suriaco",
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=900&q=82",
        imageAlt: "Carpa iluminada en un paisaje natural durante la noche"
      },
      geometry: {
        type: "Point",
        coordinates: [-64.7874, -31.2124]
      }
    }
  ]
};
