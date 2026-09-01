import type { Activity } from "@/data/activities";

export function isPublicActivity(activity: Activity) {
  return activity.status !== "draft" && activity.status !== "archived";
}

export function slugifyActivityName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ensureUniqueSlug(baseSlug: string, existingSlugs: string[]) {
  const cleanBase = baseSlug || "actividad";
  let candidate = cleanBase;
  let index = 2;

  while (existingSlugs.includes(candidate)) {
    candidate = `${cleanBase}-${index}`;
    index += 1;
  }

  return candidate;
}

export function formatActivityDate(activity: Activity) {
  if (!activity.nextDateIso) return activity.nextDate;

  const date = new Date(`${activity.nextDateIso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return activity.nextDate;

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

export function formatActivityDuration(activity: Activity) {
  if (!activity.durationDays) return activity.duration;
  return `${activity.durationDays} ${activity.durationDays === 1 ? "día" : "días"}`;
}

export function formatActivityDistance(activity: Activity) {
  if (!activity.distanceKm) return activity.distance;
  return `${activity.distanceKm} km`;
}

export function formatActivityElevation(activity: Activity) {
  if (!activity.elevationM) return activity.elevation;
  return `${activity.elevationM} m`;
}

export function formatActivityMinAge(activity: Activity) {
  if (!activity.minAgeYears) return activity.minAge;
  return `${activity.minAgeYears} años`;
}

export function formatActivityParticipants(activity: Activity) {
  if (!activity.maxParticipantsCount) return activity.maxParticipants;
  return `${activity.maxParticipantsCount} personas`;
}

export function getGenericRoutePoints(activity: Pick<Activity, "durationDays">) {
  if (activity.durationDays && activity.durationDays > 1) {
    return [
      "Encuentro y presentación del grupo",
      "Organización de jornadas, horarios y logística",
      "Actividades principales según clima y condiciones",
      "Acompañamiento durante todo el programa",
      "Cierre de experiencia y regreso"
    ];
  }

  return [
    "Punto de encuentro confirmado con el grupo",
    "Inicio con charla técnica y revisión de equipo",
    "Desarrollo de la experiencia según ritmo y condiciones",
    "Pausas, asistencia y acompañamiento durante la salida",
    "Regreso y cierre de actividad"
  ];
}

export function parseGoogleMapsCoordinates(url: string) {
  const patterns = [
    /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
    /[?&](?:q|ll|query)=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (!match) continue;

    const latitude = Number(match[1]);
    const longitude = Number(match[2]);

    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      return { latitude, longitude };
    }
  }

  return null;
}
