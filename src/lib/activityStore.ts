import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { activities as seedActivities, type Activity } from "@/data/activities";
import { isPublicActivity } from "@/lib/activityUtils";
import { createSupabaseAdminClient, hasSupabaseServerEnv } from "@/lib/supabase";

type ActivityRow = {
  slug: string;
  name: string;
  category: Activity["category"];
  filters: Activity["filters"];
  status: Activity["status"];
  location: string;
  google_maps_url?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  difficulty: Activity["difficulty"];
  duration: Activity["duration"];
  duration_days?: number | null;
  distance: string;
  distance_km?: number | null;
  elevation: string;
  elevation_m?: number | null;
  min_age: string;
  min_age_years?: number | null;
  max_participants: string;
  max_participants_count?: number | null;
  price: string;
  next_date: string;
  next_date_iso?: string | null;
  image: string;
  images?: string[] | null;
  image_alt: string;
  summary: string;
  description: string;
  route_points: string[];
  includes: string[];
  required_gear: string[];
  recommended_gear: string[];
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "admin-activities.json");

function toActivity(row: ActivityRow): Activity {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    filters: row.filters,
    status: row.status,
    location: row.location,
    googleMapsUrl: row.google_maps_url ?? undefined,
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    difficulty: row.difficulty,
    duration: row.duration,
    durationDays: row.duration_days ?? undefined,
    distance: row.distance,
    distanceKm: row.distance_km ?? undefined,
    elevation: row.elevation,
    elevationM: row.elevation_m ?? undefined,
    minAge: row.min_age,
    minAgeYears: row.min_age_years ?? undefined,
    maxParticipants: row.max_participants,
    maxParticipantsCount: row.max_participants_count ?? undefined,
    price: row.price,
    nextDate: row.next_date,
    nextDateIso: row.next_date_iso ?? undefined,
    image: row.image,
    images: row.images ?? undefined,
    imageAlt: row.image_alt,
    summary: row.summary,
    description: row.description,
    routePoints: row.route_points,
    includes: row.includes,
    requiredGear: row.required_gear,
    recommendedGear: row.recommended_gear
  };
}

type ActivityUpsertRow = ActivityRow & { sort_order: number };

function toRow(activity: Activity, sortOrder: number): ActivityUpsertRow {
  return {
    slug: activity.slug,
    name: activity.name,
    category: activity.category,
    filters: activity.filters,
    status: activity.status ?? "published",
    location: activity.location,
    google_maps_url: activity.googleMapsUrl ?? null,
    latitude: activity.latitude ?? null,
    longitude: activity.longitude ?? null,
    difficulty: activity.difficulty,
    duration: activity.duration,
    duration_days: activity.durationDays ?? null,
    distance: activity.distance,
    distance_km: activity.distanceKm ?? null,
    elevation: activity.elevation,
    elevation_m: activity.elevationM ?? null,
    min_age: activity.minAge,
    min_age_years: activity.minAgeYears ?? null,
    max_participants: activity.maxParticipants,
    max_participants_count: activity.maxParticipantsCount ?? null,
    price: activity.price,
    next_date: activity.nextDate,
    next_date_iso: activity.nextDateIso ?? null,
    image: activity.image,
    images: activity.images ?? [],
    image_alt: activity.imageAlt,
    summary: activity.summary,
    description: activity.description,
    route_points: activity.routePoints,
    includes: activity.includes,
    required_gear: activity.requiredGear,
    recommended_gear: activity.recommendedGear,
    sort_order: sortOrder
  };
}

function withoutOptionalColumns(row: ActivityUpsertRow) {
  const {
    google_maps_url,
    latitude,
    longitude,
    duration_days,
    distance_km,
    elevation_m,
    min_age_years,
    max_participants_count,
    next_date_iso,
    images,
    ...legacyRow
  } = row;

  return legacyRow;
}

function comparableRow(row: ActivityUpsertRow | ActivityRow) {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    filters: row.filters,
    status: row.status,
    location: row.location,
    google_maps_url: row.google_maps_url ?? null,
    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,
    difficulty: row.difficulty,
    duration: row.duration,
    duration_days: row.duration_days ?? null,
    distance: row.distance,
    distance_km: row.distance_km ?? null,
    elevation: row.elevation,
    elevation_m: row.elevation_m ?? null,
    min_age: row.min_age,
    min_age_years: row.min_age_years ?? null,
    max_participants: row.max_participants,
    max_participants_count: row.max_participants_count ?? null,
    price: row.price,
    next_date: row.next_date,
    next_date_iso: row.next_date_iso ?? null,
    image: row.image,
    images: row.images ?? [],
    image_alt: row.image_alt,
    summary: row.summary,
    description: row.description,
    route_points: row.route_points,
    includes: row.includes,
    required_gear: row.required_gear,
    recommended_gear: row.recommended_gear
  };
}

function stableStringify(value: unknown) {
  return JSON.stringify(value, Object.keys(value as Record<string, unknown>).sort());
}

function hasRowChanges(nextRow: ActivityUpsertRow, existingRow: ActivityRow | undefined) {
  if (!existingRow) return true;

  return stableStringify(comparableRow(nextRow)) !== stableStringify(comparableRow(existingRow));
}

function isMissingColumnError(error: { message: string; code?: string }) {
  const message = error.message.toLowerCase();

  return (
    error.code === "PGRST204" ||
    message.includes("schema cache") ||
    message.includes("could not find") ||
    message.includes("column of") ||
    message.includes("column ") ||
    message.includes("does not exist")
  );
}

async function readActivitiesFromJson(): Promise<Activity[]> {
  try {
    const raw = await readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return seedActivities;
    return parsed as Activity[];
  } catch (error) {
    return seedActivities;
  }
}

async function writeActivitiesToJson(activities: Activity[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, `${JSON.stringify(activities, null, 2)}\n`, "utf8");
}

export async function readActivitiesFromStore(): Promise<Activity[]> {
  if (!hasSupabaseServerEnv()) return readActivitiesFromJson();

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return ((data ?? []) as ActivityRow[]).map(toActivity);
}

export async function readPublicActivitiesFromStore(): Promise<Activity[]> {
  const activities = await readActivitiesFromStore();

  return activities.filter(isPublicActivity);
}

export async function writeActivitiesToStore(activities: Activity[]) {
  if (!hasSupabaseServerEnv()) {
    await writeActivitiesToJson(activities);
    return;
  }

  const supabase = createSupabaseAdminClient();
  const rows = activities.map((activity, index) => toRow(activity, index));
  const slugs = activities.map((activity) => activity.slug);

  const { data: existingRows, error: selectError } = await supabase
    .from("activities")
    .select("*");

  if (selectError) throw new Error(selectError.message);

  const existingBySlug = new Map(
    ((existingRows ?? []) as ActivityRow[]).map((row) => [row.slug, row])
  );
  const rowsToUpsert = rows.filter((row) => hasRowChanges(row, existingBySlug.get(row.slug)));
  const rowsToUpsertSlugs = rowsToUpsert.map((row) => row.slug);

  if (rowsToUpsert.length) {
    const confirmedUpsertSlugs = new Set<string>();

    const { data: upsertedRows, error: upsertError } = await supabase
      .from("activities")
      .upsert(rowsToUpsert, { onConflict: "slug" })
      .select("slug");

    if (upsertError) {
      if (!isMissingColumnError(upsertError)) throw new Error(upsertError.message);

      const { data: legacyUpsertedRows, error: legacyUpsertError } = await supabase
        .from("activities")
        .upsert(rowsToUpsert.map(withoutOptionalColumns), { onConflict: "slug" })
        .select("slug");

      if (legacyUpsertError) throw new Error(legacyUpsertError.message);
      legacyUpsertedRows?.forEach((row) => confirmedUpsertSlugs.add(row.slug));
    } else {
      upsertedRows?.forEach((row) => confirmedUpsertSlugs.add(row.slug));
    }

    const missingConfirmedSlugs = rowsToUpsertSlugs.filter((slug) => !confirmedUpsertSlugs.has(slug));

    if (missingConfirmedSlugs.length) {
      throw new Error(`Supabase no confirmo el guardado de: ${missingConfirmedSlugs.join(", ")}`);
    }
  }

  const deletedSlugs = ((existingRows ?? []) as Array<{ slug: string }>)
    .map((row) => row.slug)
    .filter((slug) => !slugs.includes(slug));

  if (deletedSlugs.length) {
    const { error: deleteError } = await supabase
      .from("activities")
      .delete()
      .in("slug", deletedSlugs);

    if (deleteError) throw new Error(deleteError.message);
  }

  const { data: savedRows, error: savedSelectError } = rowsToUpsertSlugs.length
    ? await supabase.from("activities").select("slug").in("slug", rowsToUpsertSlugs)
    : { data: [], error: null };

  if (savedSelectError) throw new Error(savedSelectError.message);

  const savedSlugs = new Set((savedRows ?? []).map((row) => row.slug));
  const missingSavedSlugs = rowsToUpsertSlugs.filter((slug) => !savedSlugs.has(slug));

  if (missingSavedSlugs.length) {
    throw new Error(`Supabase no confirmó el guardado de: ${missingSavedSlugs.join(", ")}`);
  }
}

export async function getActivityBySlugFromStore(slug: string) {
  if (!hasSupabaseServerEnv()) {
    const activities = await readActivitiesFromJson();
    return activities.find((activity) => activity.slug === slug);
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? toActivity(data as ActivityRow) : undefined;
}
