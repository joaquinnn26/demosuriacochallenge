export type ActivityCategory =
  | "trekking"
  | "astronomia"
  | "camping"
  | "montana"
  | "familia"
  | "viajes"
  | "grupos"
  | "especiales";

export type ActivityDifficulty = "Fácil" | "Media" | "Difícil";
export type ActivityDuration = "Medio día" | "1 día" | "Fin de semana" | "Varios días";

export type Activity = {
  slug: string;
  name: string;
  category: ActivityCategory;
  location: string;
  difficulty: ActivityDifficulty;
  duration: ActivityDuration;
  distance: string;
  elevation: string;
  minAge: string;
  maxParticipants: string;
  price: string;
  nextDate: string;
  image: string;
  imageAlt: string;
  summary: string;
  description: string;
  routePoints: string[];
  includes: string[];
  requiredGear: string[];
  recommendedGear: string[];
};

export const categoryLabels: Record<ActivityCategory, string> = {
  trekking: "Trekking",
  astronomia: "Astronomía",
  camping: "Camping / Vivac",
  montana: "Montaña",
  familia: "Familia",
  viajes: "Viajes",
  grupos: "Empresas / grupos",
  especiales: "Especiales"
};

export const activities: Activity[] = [
  {
    slug: "trekking-cumbre-suriaco",
    name: "Trekking Cumbre Suriaco",
    category: "trekking",
    location: "Cumbre Suriaco, Córdoba",
    difficulty: "Media",
    duration: "1 día",
    distance: "14 km",
    elevation: "+750 m",
    minAge: "12 años",
    maxParticipants: "12 personas",
    price: "Consultar valor",
    nextDate: "Próxima fecha a confirmar",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Grupo caminando por sendero de montaña al atardecer",
    summary:
      "Una salida de día completo para llegar a un punto panorámico y vivir el ritmo real de la montaña.",
    description:
      "La propuesta combina caminata, pausas de interpretación del entorno y acompañamiento profesional durante toda la salida. Es una buena opción para personas con estado físico activo que quieren una experiencia exigente pero alcanzable.",
    routePoints: ["Punto de encuentro", "Inicio del sendero", "Mirador intermedio", "Cumbre Suriaco", "Regreso guiado"],
    includes: ["Guía a cargo del grupo", "Coordinación previa", "Botiquín de primeros auxilios", "Asistencia durante la actividad"],
    requiredGear: ["Calzado de trekking", "Agua", "Mochila chica", "Abrigo"],
    recommendedGear: ["Gorra", "Gafas", "Bastones", "Protección solar"]
  },
  {
    slug: "trekking-astronomico",
    name: "Trekking Astronómico",
    category: "astronomia",
    location: "Campamento Cielo, Suriaco",
    difficulty: "Fácil",
    duration: "Medio día",
    distance: "3 km",
    elevation: "+80 m",
    minAge: "8 años",
    maxParticipants: "18 personas",
    price: "Consultar valor",
    nextDate: "Próxima fecha a confirmar",
    image:
      "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Cielo nocturno estrellado sobre silueta de montañas",
    summary:
      "Una caminata suave al atardecer con observación del cielo y cierre nocturno.",
    description:
      "Pensada para quienes buscan una salida tranquila y visual. El ritmo es amable, con tiempo para llegar al punto de observación, acomodarse y reconocer constelaciones, planetas y referencias del cielo nocturno.",
    routePoints: ["Punto de encuentro", "Caminata corta", "Campamento Cielo", "Observación guiada", "Regreso"],
    includes: ["Guía/coordinador", "Coordinación previa", "Orientación durante la observación", "Asistencia durante la actividad"],
    requiredGear: ["Calzado cómodo", "Agua", "Abrigo", "Linterna"],
    recommendedGear: ["Manta ligera", "Gorro", "Cámara", "Repelente"]
  },
  {
    slug: "noche-bajo-las-estrellas",
    name: "Noche bajo las estrellas",
    category: "camping",
    location: "Zona de vivac Suriaco",
    difficulty: "Media",
    duration: "Fin de semana",
    distance: "10 km",
    elevation: "+420 m",
    minAge: "14 años",
    maxParticipants: "10 personas",
    price: "Consultar valor",
    nextDate: "Próxima fecha a confirmar",
    image:
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Carpa iluminada en un paisaje natural durante la noche",
    summary:
      "Vivac, atardecer, noche de montaña y amanecer para bajar el ritmo.",
    description:
      "Una experiencia para pasar más tiempo en la naturaleza y aprender cómo organizar una noche al aire libre con criterio. Incluye caminata de aproximación, armado del espacio y regreso guiado al día siguiente.",
    routePoints: ["Encuentro", "Sendero de aproximación", "Zona de vivac", "Amanecer", "Regreso"],
    includes: ["Guía a cargo del grupo", "Coordinación previa", "Orientación sobre armado de vivac", "Asistencia durante la actividad"],
    requiredGear: ["Calzado de trekking", "Agua", "Mochila", "Abrigo", "Bolsa de dormir"],
    recommendedGear: ["Linterna frontal", "Aislante", "Gorra", "Protección solar"]
  },
  {
    slug: "trekking-gastronomico",
    name: "Trekking gastronómico",
    category: "especiales",
    location: "Mirador del Valle, Suriaco",
    difficulty: "Fácil",
    duration: "1 día",
    distance: "7 km",
    elevation: "+220 m",
    minAge: "10 años",
    maxParticipants: "16 personas",
    price: "Consultar valor",
    nextDate: "Próxima fecha a confirmar",
    image:
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Mesa rústica de comida al aire libre con paisaje de montaña",
    summary:
      "Senderos suaves, paisaje y una pausa gastronómica para compartir en grupo.",
    description:
      "La salida cruza caminata, entorno natural y una experiencia de encuentro. Es ideal para grupos que quieren una actividad accesible, con tiempo para conversar, disfrutar el paisaje y cerrar con una propuesta gastronómica.",
    routePoints: ["Encuentro", "Sendero interpretativo", "Mirador del Valle", "Pausa gastronómica", "Regreso"],
    includes: ["Guía a cargo del grupo", "Coordinación previa", "Pausa planificada", "Asistencia durante la actividad"],
    requiredGear: ["Calzado cómodo", "Agua", "Mochila chica", "Abrigo"],
    recommendedGear: ["Gorra", "Gafas", "Protección solar", "Cámara"]
  },
  {
    slug: "fin-de-semana-suriaco",
    name: "Fin de semana Suriaco",
    category: "viajes",
    location: "Suriaco, Córdoba",
    difficulty: "Media",
    duration: "Fin de semana",
    distance: "Variable según salida",
    elevation: "Variable según salida",
    minAge: "16 años",
    maxParticipants: "14 personas",
    price: "Consultar valor",
    nextDate: "Próxima fecha a confirmar",
    image:
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Montañistas observando un valle desde una cumbre",
    summary:
      "Dos días de senderos, descanso, comunidad y naturaleza con logística guiada.",
    description:
      "Un formato extendido para quienes quieren salir de la rutina y vivir la montaña con más profundidad. La experiencia combina actividad física, pausas, convivencia de grupo y organización previa para llegar preparados.",
    routePoints: ["Salida", "Actividad día 1", "Descanso grupal", "Actividad día 2", "Regreso"],
    includes: ["Guía a cargo del grupo", "Coordinación previa", "Planificación de horarios", "Asistencia durante la actividad"],
    requiredGear: ["Calzado de trekking", "Agua", "Mochila", "Abrigo", "Bolso de viaje"],
    recommendedGear: ["Bastones", "Gorra", "Gafas", "Protección solar"]
  },
  {
    slug: "experiencia-familiar-suriaco",
    name: "Experiencia familiar Suriaco",
    category: "familia",
    location: "Reserva natural Suriaco",
    difficulty: "Fácil",
    duration: "Medio día",
    distance: "4 km",
    elevation: "+90 m",
    minAge: "6 años",
    maxParticipants: "20 personas",
    price: "Consultar valor",
    nextDate: "Próxima fecha a confirmar",
    image:
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Familia caminando por sendero entre montañas",
    summary:
      "Una salida accesible para compartir naturaleza, aprendizaje y movimiento.",
    description:
      "Actividad pensada para familias que quieren tener una primera experiencia al aire libre con ritmo amable. El foco está en caminar, observar, aprender y volver con una referencia clara de cómo prepararse para futuras salidas.",
    routePoints: ["Encuentro", "Sendero corto", "Actividad interpretativa", "Descanso", "Regreso"],
    includes: ["Guía/coordinador", "Coordinación previa", "Actividad interpretativa", "Asistencia durante la actividad"],
    requiredGear: ["Calzado cómodo", "Agua", "Abrigo", "Mochila pequeña"],
    recommendedGear: ["Gorra", "Protección solar", "Snack", "Repelente"]
  },
  {
    slug: "salida-para-empresas",
    name: "Salida para empresas",
    category: "grupos",
    location: "Destino definido según grupo",
    difficulty: "Fácil",
    duration: "1 día",
    distance: "A medida",
    elevation: "A medida",
    minAge: "Adultos",
    maxParticipants: "A definir",
    price: "Presupuesto a medida",
    nextDate: "A coordinar",
    image:
      "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Grupo caminando en fila por sendero de montaña",
    summary:
      "Experiencias de grupo para equipos, universidades y organizaciones.",
    description:
      "Formato adaptable para objetivos de integración, bienestar, liderazgo o celebración. La propuesta se define según cantidad de personas, perfil del grupo, movilidad, tiempos disponibles y nivel de dificultad buscado.",
    routePoints: ["Brief inicial", "Actividad principal", "Pausa de grupo", "Cierre", "Regreso"],
    includes: ["Diseño de actividad", "Coordinación previa", "Guía a cargo del grupo", "Asistencia durante la actividad"],
    requiredGear: ["Calzado cómodo", "Agua", "Abrigo", "Mochila"],
    recommendedGear: ["Gorra", "Protección solar", "Cuaderno si corresponde", "Ropa cómoda"]
  },
  {
    slug: "travesia-varios-dias",
    name: "Travesía de varios días",
    category: "viajes",
    location: "Región serrana a definir",
    difficulty: "Difícil",
    duration: "Varios días",
    distance: "A definir",
    elevation: "A definir",
    minAge: "18 años",
    maxParticipants: "10 personas",
    price: "Consultar valor",
    nextDate: "Próxima fecha a confirmar",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Cordillera con cumbres y valle bajo luz fría",
    summary:
      "Una travesía más exigente para vivir varios días de montaña, ruta y comunidad.",
    description:
      "Experiencia de mayor compromiso físico y logístico. Antes de reservar se revisan experiencia previa, equipo disponible, condición física y expectativas del grupo para confirmar si la salida es adecuada.",
    routePoints: ["Día 1 aproximación", "Día 2 travesía", "Día 3 objetivo principal", "Día 4 regreso"],
    includes: ["Guía a cargo del grupo", "Coordinación previa", "Planificación logística", "Asistencia durante la actividad"],
    requiredGear: ["Calzado técnico", "Agua", "Mochila", "Abrigo", "Equipo personal completo"],
    recommendedGear: ["Bastones", "Gafas", "Protección solar", "Linterna frontal"]
  }
];

export function getActivityBySlug(slug: string) {
  return activities.find((activity) => activity.slug === slug);
}
