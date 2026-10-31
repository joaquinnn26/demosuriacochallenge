import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const env = Object.fromEntries((await readFile(".env.local", "utf8")).split(/\r?\n/).filter((line) => line && !line.startsWith("#") && line.includes("=")).map((line) => {
  const index = line.indexOf("=");
  return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
}));

const baseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!baseUrl || !key) throw new Error("La configuración anterior de Supabase no está disponible.");

const response = await fetch(`${baseUrl}/rest/v1/activities?select=*&order=sort_order.asc`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
if (!response.ok) throw new Error(`No se pudo leer Supabase (${response.status}).`);
const rows = await response.json();

const toActivity = (row) => ({
  slug: row.slug, name: row.name, category: row.category, filters: row.filters, status: row.status,
  location: row.location, googleMapsUrl: row.google_maps_url ?? undefined, latitude: row.latitude ?? undefined,
  longitude: row.longitude ?? undefined, difficulty: row.difficulty, duration: row.duration,
  durationDays: row.duration_days ?? undefined, distance: row.distance, distanceKm: row.distance_km ?? undefined,
  elevation: row.elevation, elevationM: row.elevation_m ?? undefined, minAge: row.min_age,
  minAgeYears: row.min_age_years ?? undefined, maxParticipants: row.max_participants,
  maxParticipantsCount: row.max_participants_count ?? undefined, price: row.price, nextDate: row.next_date,
  nextDateIso: row.next_date_iso ?? undefined, image: row.image, images: row.images ?? [], imageAlt: row.image_alt,
  summary: row.summary, description: row.description, routePoints: row.route_points, includes: row.includes,
  requiredGear: row.required_gear, recommendedGear: row.recommended_gear
});

const activities = rows.map(toActivity);
await mkdir(path.join(process.cwd(), "data"), { recursive: true });
await writeFile(path.join(process.cwd(), "data", "admin-activities.json"), `${JSON.stringify(activities, null, 2)}\n`);
console.log(`Migradas ${activities.length} actividades a data/admin-activities.json.`);
