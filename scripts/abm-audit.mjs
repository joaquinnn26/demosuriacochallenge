import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((line) => /^\s*[^#][^=]+=/.test(line))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
    })
);

const baseUrl = process.env.ABM_BASE_URL ?? "http://localhost:3006";
const auditEmail = process.env.ABM_EMAIL ?? env.SUPABASE_ADMIN_EMAILS?.split(",")[0]?.trim();
const auditPassword = process.env.ABM_PASSWORD;
const storageBucket = "activity-images";
const imageBytes = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNsWm6rBwADGgFqMFSsfwAAAABJRU5ErkJggg==",
  "base64"
);

async function readJson(response, label) {
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${label} ${response.status} ${text.slice(0, 500)}`);
  }

  return text ? JSON.parse(text) : null;
}

function assert(value, message) {
  if (!value) throw new Error(message);
}

async function saveActivities(authHeaders, activities, label) {
  return readJson(
    await fetch(`${baseUrl}/api/activities`, {
      method: "PUT",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ activities })
    }),
    label
  );
}

async function uploadAuditImage(authHeaders) {
  const formData = new FormData();
  formData.append("images", new File([imageBytes], "abm-audit.png", { type: "image/png" }));

  const data = await readJson(
    await fetch(`${baseUrl}/api/admin/images`, {
      method: "POST",
      headers: authHeaders,
      body: formData
    }),
    "image upload"
  );

  assert(Array.isArray(data.images) && data.images.length === 1, "image upload did not return one image");
  assert(String(data.images[0]).includes(`/${storageBucket}/`), "image upload did not return a storage public URL");
  return data.images[0];
}

function getStoragePath(publicUrl) {
  const marker = `/storage/v1/object/public/${storageBucket}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) return null;

  return decodeURIComponent(publicUrl.slice(index + marker.length).split("?")[0]);
}

async function cleanupAuditImage(publicUrl) {
  const path = getStoragePath(publicUrl);
  if (!path) return;

  await supabaseAdmin.storage.from(storageBucket).remove([path]);
}

function adminActivitiesUrl() {
  return `${baseUrl}/api/activities?scope=admin&audit=${Date.now()}`;
}

if (!auditEmail || !auditPassword) {
  throw new Error("Configura ABM_EMAIL y ABM_PASSWORD para ejecutar la auditoria.");
}

const auth = await readJson(
  await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: auditEmail,
      password: auditPassword
    })
  }),
  "auth"
);

const sessionResponse = await fetch(`${baseUrl}/api/admin/session`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${auth.access_token}`
  }
});
const cookie = (sessionResponse.headers.get("set-cookie") ?? "").split(";")[0];
const sessionPayload = await readJson(sessionResponse, "admin session");
assert(!sessionPayload?.demo, "admin session API is running in demo mode instead of Supabase mode");
assert(cookie.startsWith("suriaco_admin_session="), "admin session cookie was not created");

const authHeaders = {
  Authorization: `Bearer ${auth.access_token}`,
  Cookie: cookie
};
const supabaseAdmin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
});

let current = await readJson(
  await fetch(adminActivitiesUrl(), { headers: authHeaders }),
  "admin list before"
);
let activities = Array.isArray(current.activities) ? current.activities : [];

const slug = `abm-audit-${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}`;
const copySlug = `${slug}-copia`;
const baseActivity = {
  slug,
  name: "ABM Audit Codex",
  category: "trekking",
  filters: ["un-dia", "madrid-centro", "espana", "trekking"],
  status: "draft",
  location: "Sierra de Guadarrama, Madrid",
  googleMapsUrl: "https://www.google.com/maps?q=40.793,-3.976",
  latitude: 40.793,
  longitude: -3.976,
  difficulty: "Media",
  duration: "1 día",
  durationDays: 1,
  distance: "8 km",
  distanceKm: 8,
  elevation: "350 m",
  elevationM: 350,
  minAge: "16 años",
  minAgeYears: 16,
  maxParticipants: "12 personas",
  maxParticipantsCount: 12,
  price: "Consultar valor",
  nextDate: "30 agosto 2026",
  nextDateIso: "2026-08-30",
  image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
  images: [],
  imageAlt: "Imagen de ABM Audit Codex",
  summary: "Actividad temporal para auditar el ABM.",
  description: "Actividad temporal para auditar crear editar publicar archivar y borrar desde el administrador.",
  routePoints: [
    "Punto de encuentro confirmado con el grupo",
    "Inicio con charla técnica y revisión de equipo",
    "Desarrollo de la experiencia según ritmo y condiciones",
    "Pausas, asistencia y acompañamiento durante la salida",
    "Regreso y cierre de actividad"
  ],
  includes: ["Guía a cargo del grupo", "Coordinación previa"],
  requiredGear: ["Calzado de trekking", "Agua"],
  recommendedGear: ["Protección solar"]
};

await saveActivities(authHeaders, [baseActivity, ...activities], "create draft");
current = await readJson(
  await fetch(adminActivitiesUrl(), { headers: authHeaders }),
  "admin list after create"
);
assert(
  current.activities.some((activity) => activity.slug === slug && activity.status === "draft"),
  `create not persisted as draft. slugs=${current.activities.map((activity) => activity.slug).join(",")}`
);

activities = current.activities;
const copied = {
  ...baseActivity,
  slug: copySlug,
  name: "ABM Audit Codex copia",
  status: "draft"
};

await saveActivities(authHeaders, [copied, ...activities], "duplicate");
current = await readJson(
  await fetch(adminActivitiesUrl(), { headers: authHeaders }),
  "admin list after duplicate"
);
assert(
  current.activities.some((activity) => activity.slug === copySlug && activity.status === "draft"),
  "duplicate not persisted as draft"
);

activities = current.activities;
const uploadedImage = await uploadAuditImage(authHeaders);
const edited = {
  ...activities.find((activity) => activity.slug === slug),
  name: "ABM Audit Codex Editada",
  status: "published",
  image: uploadedImage,
  images: [uploadedImage],
  summary: "Actividad temporal editada con imagen.",
  description: "Actividad temporal editada con una imagen cargada para auditar el home."
};

await saveActivities(
  authHeaders,
  activities.map((activity) => (activity.slug === slug ? edited : activity)),
  "edit publish image"
);
current = await readJson(
  await fetch(adminActivitiesUrl(), { headers: authHeaders }),
  "admin list after edit"
);
const persisted = current.activities.find((activity) => activity.slug === slug);
assert(persisted?.status === "published", "edit/publish not persisted");
assert(persisted?.image === uploadedImage, "image edit not persisted");

const publicList = await readJson(await fetch(`${baseUrl}/api/activities`), "public list");
assert(publicList.activities.some((activity) => activity.slug === slug), "published activity missing from public API");

for (const path of ["/", "/buscador", "/experiencias", `/experiencias/${slug}`]) {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`page ${path} ${response.status} ${(await response.text()).slice(0, 300)}`);
  }
}

activities = current.activities;
await saveActivities(
  authHeaders,
  activities.map((activity) => (activity.slug === slug ? { ...activity, status: "archived" } : activity)),
  "archive"
);
const publicAfterArchive = await readJson(await fetch(`${baseUrl}/api/activities`), "public list after archive");
assert(!publicAfterArchive.activities.some((activity) => activity.slug === slug), "archived activity still public");

current = await readJson(
  await fetch(adminActivitiesUrl(), { headers: authHeaders }),
  "admin list before delete"
);
await saveActivities(
  authHeaders,
  current.activities.filter((activity) => ![slug, copySlug].includes(activity.slug)),
  "delete"
);
current = await readJson(
  await fetch(adminActivitiesUrl(), { headers: authHeaders }),
  "admin list after delete"
);
assert(!current.activities.some((activity) => activity.slug === slug), "delete not persisted");
assert(!current.activities.some((activity) => activity.slug === copySlug), "duplicate delete not persisted");
await cleanupAuditImage(uploadedImage);

console.log(
  JSON.stringify({
    ok: true,
    slug,
    flows: [
      "login",
      "admin-session",
      "create",
      "duplicate",
      "image-upload",
      "edit-with-image",
      "publish",
      "public-api",
      "home",
      "search",
      "listing",
      "detail",
      "archive",
      "delete"
    ]
  })
);
