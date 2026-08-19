export type Destination = {
  slug: string;
  name: string;
  type: string;
  description: string;
  image: string;
  imageAlt: string;
  activities: string[];
  x: number;
  y: number;
};

export const destinations: Destination[] = [
  {
    slug: "cumbre-suriaco",
    name: "Cumbre Suriaco",
    type: "Montaña",
    description: "Destino final para salidas de trekking con vista panorámica del entorno serrano.",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Cordones de sierra con senderos y vegetación",
    activities: ["Trekking", "Montaña"],
    x: 30,
    y: 42
  },
  {
    slug: "campamento-cielo",
    name: "Campamento Cielo",
    type: "Astronomía",
    description: "Punto de llegada para experiencias nocturnas, observación del cielo y vivac.",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Paisaje abierto preparado para observación astronómica",
    activities: ["Astronomía", "Camping"],
    x: 62,
    y: 30
  },
  {
    slug: "mirador-del-valle",
    name: "Mirador del Valle",
    type: "Mirador",
    description: "Destino accesible para salidas familiares, grupos y caminatas de baja dificultad.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Refugio y paisaje natural de montaña",
    activities: ["Familia", "Empresas", "Trekking"],
    x: 48,
    y: 62
  }
];
