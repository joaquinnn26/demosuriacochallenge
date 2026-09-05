"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import {
  activities as seedActivities,
  filterLabels,
  type Activity,
  type ActivityCategory,
  type ActivityDifficulty,
  type ActivityFilter
} from "@/data/activities";
import {
  ensureUniqueSlug,
  formatActivityDate,
  formatActivityDistance,
  formatActivityDuration,
  getGenericRoutePoints,
  parseGoogleMapsCoordinates,
  slugifyActivityName
} from "@/lib/activityUtils";
import {
  adminIdleTimeoutMs,
  adminSessionDurationMs,
  adminSessionStartedKey,
  clearAdminSessionTracking,
  formatDuration,
  getAdminSessionExpiredReason,
  markAdminActivity,
  markAdminSessionStarted
} from "@/lib/adminSecurity";
import { createSupabaseBrowserClient, hasSupabaseBrowserEnv } from "@/lib/supabase";
import { ActivityModal } from "./ActivityModal";
import { alerts, notifyError as setError, notifySuccess as setMessage, notifyInfo as setMapMessage } from "@/lib/alerts";
import { AdminLogin } from "./AdminLogin";

type ActivityStatus = NonNullable<Activity["status"]>;

const durationFilters: ActivityFilter[] = ["un-dia", "pernocta"];
const placeFilters: ActivityFilter[] = ["madrid-centro", "espana", "europa-africa", "sudamerica", "argentina"];
const typeFilters: ActivityFilter[] = ["trekking", "invernales", "escalada", "astronomia-picos"];
const difficultyOptions: ActivityDifficulty[] = ["Fácil", "Media", "Difícil"];
const statusOptions: ActivityStatus[] = ["published", "draft", "archived"];
const defaultImage = "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80";

const typeCategoryMap: Record<ActivityFilter, ActivityCategory> = {
  "un-dia": "trekking",
  pernocta: "viajes",
  "madrid-centro": "trekking",
  espana: "viajes",
  "europa-africa": "viajes",
  sudamerica: "viajes",
  argentina: "viajes",
  trekking: "trekking",
  invernales: "invernales",
  escalada: "escalada",
  "astronomia-picos": "astronomia"
};

const includeOptions = [
  "Guía a cargo del grupo",
  "Coordinación previa",
  "Planificación de ruta",
  "Briefing técnico antes de salir",
  "Asistencia durante la actividad",
  "Botiquín de primeros auxilios",
  "Gestión del grupo durante la experiencia",
  "Seguimiento meteorológico previo"
];

const requiredGearOptions = [
  "Calzado de trekking",
  "Mochila chica",
  "Agua",
  "Abrigo",
  "Ropa impermeable",
  "Linterna frontal",
  "Guantes",
  "Gorro",
  "Protección solar",
  "Documento personal"
];

const recommendedGearOptions = [
  "Bastones",
  "Gafas de sol",
  "Gorra",
  "Snack o comida de marcha",
  "Termo",
  "Cámara",
  "Manta ligera",
  "Ropa de recambio",
  "Power bank",
  "Bolsa seca"
];

const statusLabels: Record<ActivityStatus, string> = {
  published: "Publicado",
  draft: "Borrador",
  archived: "Archivado"
};

function cloneActivity(activity: Activity): Activity {
  return JSON.parse(JSON.stringify(activity)) as Activity;
}

function getTodayIso() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function formatIsoDateForAdmin(value: string) {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

function parseNumber(value: string) {
  if (value.trim() === "") return undefined;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function numberValue(value?: number) {
  return value === undefined || value === null ? "" : String(value);
}

function cleanLines(items: string[]) {
  return items.map((item) => item.trim()).filter(Boolean);
}

function durationText(days?: number): Activity["duration"] {
  return days && days > 1 ? "Más de 1 día" : "1 día";
}

function durationFilter(days?: number): ActivityFilter {
  return days && days > 1 ? "pernocta" : "un-dia";
}

function formatOptionalMeasure(value: number | undefined, suffix: string, fallback: string) {
  return value === undefined ? fallback : `${value} ${suffix}`;
}

function buildSummary(description: string, name: string) {
  const text = description.replace(/\s+/g, " ").trim();
  if (text.length > 0 && text.length <= 170) return text;
  if (text.length > 170) return `${text.slice(0, 167).trim()}...`;
  return `Experiencia de Suriaco Challenge: ${name.trim() || "actividad de montaña"}.`;
}

function buildImageAlt(name: string) {
  return name.trim() ? `Imagen de ${name.trim()}` : "Imagen de actividad de Suriaco Challenge";
}

function createEmptyActivity(): Activity {
  return {
    slug: "",
    name: "",
    category: "trekking",
    filters: ["un-dia", "espana", "trekking"],
    status: "draft",
    location: "",
    googleMapsUrl: "",
    latitude: undefined,
    longitude: undefined,
    difficulty: "Media",
    duration: "1 día",
    durationDays: 1,
    distance: "",
    distanceKm: undefined,
    elevation: "",
    elevationM: undefined,
    minAge: "Consultar",
    minAgeYears: undefined,
    maxParticipants: "Cupo limitado",
    maxParticipantsCount: undefined,
    price: "Consultar valor",
    nextDate: "",
    nextDateIso: "",
    image: defaultImage,
    images: [],
    imageAlt: "Imagen de actividad de Suriaco Challenge",
    summary: "",
    description: "",
    routePoints: getGenericRoutePoints({ durationDays: 1 }),
    includes: ["Guía a cargo del grupo", "Coordinación previa", "Asistencia durante la actividad"],
    requiredGear: ["Calzado de trekking", "Agua", "Abrigo"],
    recommendedGear: ["Protección solar", "Snack o comida de marcha"]
  };
}

function normalizeActivity(activity: Activity, existingSlugs: string[]) {
  const baseSlug = slugifyActivityName(activity.slug || activity.name);
  const selectedType = typeFilters.find((filter) => activity.filters.includes(filter)) ?? "trekking";
  const images = (activity.images ?? []).filter(Boolean).slice(0, 3);
  const name = activity.name.trim() || "Actividad sin título";
  const description = activity.description.trim();
  const filters = [
    ...activity.filters.filter((item) => !durationFilters.includes(item) && !typeFilters.includes(item)),
    durationFilter(activity.durationDays),
    selectedType
  ];

  return {
    ...activity,
    slug: ensureUniqueSlug(baseSlug, existingSlugs),
    name,
    category: typeCategoryMap[selectedType],
    location: activity.location.trim(),
    googleMapsUrl: activity.googleMapsUrl?.trim() || undefined,
    duration: durationText(activity.durationDays),
    distance: formatOptionalMeasure(activity.distanceKm, "km", activity.distance.trim()),
    elevation: formatOptionalMeasure(activity.elevationM, "m", activity.elevation.trim()),
    minAge: activity.minAgeYears === undefined ? activity.minAge.trim() || "Consultar" : `${activity.minAgeYears} años`,
    maxParticipants:
      activity.maxParticipantsCount === undefined
        ? activity.maxParticipants.trim() || "Cupo limitado"
        : `${activity.maxParticipantsCount} personas`,
    nextDate: activity.nextDateIso ? formatIsoDateForAdmin(activity.nextDateIso) : activity.nextDate.trim(),
    image: images[0] ?? (activity.image.trim() || defaultImage),
    images,
    imageAlt: buildImageAlt(name),
    summary: buildSummary(description, name),
    description,
    filters: Array.from(new Set(filters)),
    status: activity.status ?? "draft",
    routePoints: getGenericRoutePoints(activity),
    includes: cleanLines(activity.includes),
    requiredGear: cleanLines(activity.requiredGear),
    recommendedGear: cleanLines(activity.recommendedGear)
  };
}

export function AdminActivitiesPanel() {
  const todayIso = useMemo(getTodayIso, []);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [draft, setDraft] = useState<Activity>(() => createEmptyActivity());
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(!hasSupabaseBrowserEnv());
  const [authLoading, setAuthLoading] = useState(hasSupabaseBrowserEnv());
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const filteredActivities = useMemo(() => {
    const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const query = normalize(search.trim());
    return activities.filter((activity) =>
      (statusFilter === "all" || (activity.status ?? "published") === statusFilter) &&
      normalize(`${activity.name} ${activity.location} ${activity.summary} ${activity.description}`).includes(query)
    );
  }, [activities, search, statusFilter]);
  const pageCount = Math.max(1, Math.ceil(filteredActivities.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleActivities = filteredActivities.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  useEffect(() => { setPage((value) => Math.min(value, pageCount)); }, [pageCount]);

  const logout = async () => {
    setModalOpen(false);
    if (!hasSupabaseBrowserEnv()) return;
    const supabase = createSupabaseBrowserClient();
    await fetch("/api/admin/session", { method: "DELETE" }).catch(() => null);
    await supabase.auth.signOut();
    clearAdminSessionTracking();
    setAuthenticated(false);
    setAccessToken(null);
    setActivities([]);
  };

  const establishAdminSession = async (token: string) => {
    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "same-origin"
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.error ?? "No se pudo abrir la sesión de administración.");
    }

    markAdminSessionStarted();
  };

  const loadActivities = (token = accessToken) => {
    setLoading(true);
    fetch("/api/activities?scope=admin", {
      cache: "no-store",
      credentials: "same-origin",
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then((response) => {
        if (response.status === 401 || response.status === 403) {
          void logout();
        }
        if (!response.ok) throw new Error("No se pudieron cargar las actividades.");
        return response.json();
      })
      .then((data) => {
        setActivities(Array.isArray(data.activities) ? data.activities : []);
      })
      .catch((loadError: Error) => {
        setError(loadError.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!hasSupabaseBrowserEnv()) {
      loadActivities();
      return;
    }

    const supabase = createSupabaseBrowserClient();

    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session;
      try {
        if (session) {
          await establishAdminSession(session.access_token);
          setAccessToken(session.access_token);
          setAuthenticated(true);
          loadActivities(session.access_token);
        } else {
          setAccessToken(null);
          setAuthenticated(false);
          setLoading(false);
        }
      } catch (sessionError) {
        setError(sessionError instanceof Error ? sessionError.message : "No se pudo abrir la sesión de administración.");
        void logout();
        setLoading(false);
      } finally {
        setAuthLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setAccessToken(null);
        setAuthenticated(false);
        setActivities([]);
        return;
      }

      establishAdminSession(session.access_token)
        .then(() => {
          setAccessToken(session.access_token);
          setAuthenticated(true);
          loadActivities(session.access_token);
        })
        .catch((sessionError) => {
          setError(sessionError instanceof Error ? sessionError.message : "No se pudo abrir la sesión de administración.");
          void logout();
        });
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authenticated || !hasSupabaseBrowserEnv()) return;

    if (!window.localStorage.getItem(adminSessionStartedKey)) {
      markAdminSessionStarted();
    }

    const recordActivity = () => {
      markAdminActivity();
    };
    const checkSession = () => {
      const expiredReason = getAdminSessionExpiredReason();
      if (!expiredReason) return;
      setError(expiredReason);
      void logout();
    };

    window.addEventListener("click", recordActivity);
    window.addEventListener("keydown", recordActivity);
    window.addEventListener("pointerdown", recordActivity);
    window.addEventListener("focus", checkSession);

    const interval = window.setInterval(checkSession, 30000);

    return () => {
      window.removeEventListener("click", recordActivity);
      window.removeEventListener("keydown", recordActivity);
      window.removeEventListener("pointerdown", recordActivity);
      window.removeEventListener("focus", checkSession);
      window.clearInterval(interval);
    };
  }, [authenticated]);

  const stats = useMemo(() => {
    return {
      total: activities.length,
      published: activities.filter((activity) => activity.status !== "draft" && activity.status !== "archived").length,
      draft: activities.filter((activity) => activity.status === "draft").length,
      archived: activities.filter((activity) => activity.status === "archived").length
    };
  }, [activities]);
  const selectedType = typeFilters.find((filter) => draft.filters.includes(filter)) ?? "trekking";
  const previewImages = draft.images?.length ? draft.images.slice(0, 3) : [draft.image].filter(Boolean);

  const updateDraft = (values: Partial<Activity>) => {
    setDraft((current) => ({ ...current, ...values }));
  };

  const setDate = (value: string) => {
    updateDraft({
      nextDateIso: value,
      nextDate: formatIsoDateForAdmin(value)
    });
  };

  const setDurationDays = (value: string) => {
    const durationDays = parseNumber(value);
    const filter = durationFilter(durationDays);

    updateDraft({
      durationDays,
      duration: durationText(durationDays),
      filters: [...draft.filters.filter((item) => !durationFilters.includes(item)), filter]
    });
  };

  const setTypeFilter = (filter: ActivityFilter) => {
    updateDraft({
      category: typeCategoryMap[filter],
      filters: [...draft.filters.filter((item) => !typeFilters.includes(item)), filter]
    });
  };

  const toggleFilter = (filter: ActivityFilter) => {
    updateDraft({
      filters: draft.filters.includes(filter)
        ? draft.filters.filter((item) => item !== filter)
        : [...draft.filters, filter]
    });
  };

  const applyGoogleMapsCoordinates = () => {
    const coordinates = parseGoogleMapsCoordinates(draft.googleMapsUrl ?? "");

    if (!coordinates) {
      setMapMessage("No pude leer coordenadas del link. Pegá una URL de Google Maps con @lat,lng o completá latitud y longitud manualmente.");
      return;
    }

    updateDraft(coordinates);
    setMapMessage("Coordenadas listas para mostrar esta actividad en el mapa del home.");
  };

  const setActivityImages = (images: string[]) => {
    const nextImages = images.slice(0, 3);
    updateDraft({
      images: nextImages,
      image: nextImages[0] ?? defaultImage,
      imageAlt: buildImageAlt(draft.name)
    });
  };

  const readImageFile = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("No se pudo leer una de las imágenes."));
      reader.readAsDataURL(file);
    });
  };

  const uploadImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const imageFiles = files.filter((file) => file.type.startsWith("image/")).slice(0, 3);
    if (!imageFiles.length) {
      setError("Seleccioná archivos de imagen válidos.");
      return;
    }

    try {
      let images: string[];

      if (hasSupabaseBrowserEnv() && accessToken) {
        const formData = new FormData();
        imageFiles.forEach((file) => formData.append("images", file));

        const response = await fetch("/api/admin/images", {
          method: "POST",
          credentials: "same-origin",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: formData
        });

        if (!response.ok) {
          images = await Promise.all(imageFiles.map(readImageFile));
        } else {
          const data = await response.json();
          images = Array.isArray(data.images) ? data.images : [];
        }
      } else {
        images = await Promise.all(imageFiles.map(readImageFile));
      }

      if (!images.length) throw new Error("No se pudieron cargar las imágenes.");

      setActivityImages(images);
      setError(null);
      setMessage(files.length > 3 ? "Se cargaron las primeras 3 imágenes." : "Imágenes cargadas.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "No se pudieron cargar las imágenes.");
    } finally {
      event.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setActivityImages((draft.images ?? []).filter((_, imageIndex) => imageIndex !== index));
  };

  const toggleListItem = (field: "includes" | "requiredGear" | "recommendedGear", item: string) => {
    const current = draft[field];
    updateDraft({
      [field]: current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item]
    } as Pick<Activity, typeof field>);
  };

  const validateDraft = () => {
    if (!draft.name.trim()) return "Cargá el título de la actividad.";
    if (!draft.location.trim()) return "Cargá el lugar visible de la actividad.";
    if (!draft.nextDateIso) return "Seleccioná una fecha con el calendario.";
    if (draft.nextDateIso < todayIso) return "La fecha no puede ser anterior a hoy.";
    if (!draft.description.trim()) return "Cargá en qué consiste la experiencia.";
    return null;
  };

  const persistActivities = async (nextActivities: Activity[], successMessage: string) => {
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      if (hasSupabaseBrowserEnv()) {
        const expiredReason = getAdminSessionExpiredReason();
        if (expiredReason) {
          await logout();
          throw new Error(expiredReason);
        }
      }

      let token = accessToken;

      if (hasSupabaseBrowserEnv()) {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        token = data.session?.access_token ?? null;
        setAccessToken(token);
      }

      const response = await fetch("/api/activities", {
        method: "PUT",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ activities: nextActivities })
      });

      if (response.status === 401 || response.status === 403) {
        await logout();
      }
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "No se pudieron guardar los cambios.");
      }

      const data = await response.json();
      setActivities(Array.isArray(data.activities) ? data.activities : nextActivities);
      setMessage(successMessage);
      return true;
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "No se pudieron guardar los cambios.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveDraft = async () => {
    const draftError = validateDraft();
    if (draftError) {
      setError(draftError);
      setMessage(null);
      return;
    }

    const existingSlugs = activities
      .filter((activity) => activity.slug !== editingSlug)
      .map((activity) => activity.slug);
    const activity = normalizeActivity(draft, existingSlugs);
    const nextActivities = editingSlug
      ? activities.map((item) => (item.slug === editingSlug ? activity : item))
      : [activity, ...activities];

    const saved = await persistActivities(nextActivities, editingSlug ? "Actividad actualizada." : "Actividad creada.");
    if (!saved) return;

    setDraft(createEmptyActivity());
    setEditingSlug(null);
    setMapMessage(null);
    setModalOpen(false);
  };

  const editActivity = (activity: Activity) => {
    setDraft(cloneActivity(activity));
    setEditingSlug(activity.slug);
    setMessage(null);
    setError(null);
    setMapMessage(null);
    setModalOpen(true);
  };

  const duplicateActivity = async (activity: Activity) => {
    const copy = normalizeActivity(
      {
        ...cloneActivity(activity),
        slug: `${activity.slug}-copia`,
        name: `${activity.name} copia`,
        status: "draft"
      },
      activities.map((item) => item.slug)
    );

    await persistActivities([copy, ...activities], "Actividad duplicada como borrador.");
  };

  const changeStatus = async (activity: Activity, status: ActivityStatus) => {
    const nextActivities = activities.map((item) =>
      item.slug === activity.slug ? { ...item, status } : item
    );
    await persistActivities(nextActivities, `Actividad marcada como ${statusLabels[status].toLowerCase()}.`);
  };

  const deleteActivity = async (activity: Activity) => {
    const confirmed = await alerts.fire({
      title: "¿Eliminar actividad?",
      text: `Se eliminará definitivamente "${activity.name}" y dejará de aparecer en el mapa público.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#c36a3d",
      focusCancel: true
    });
    if (!confirmed.isConfirmed) return;

    const deleted = await persistActivities(
      activities.filter((item) => item.slug !== activity.slug),
      "Actividad eliminada. También deja de aparecer en el mapa público."
    );

    if (deleted && editingSlug === activity.slug) {
      setEditingSlug(null);
      setDraft(createEmptyActivity());
      setMapMessage(null);
    }
  };

  const importSeedActivities = async () => {
    await persistActivities(
      seedActivities.map((activity) => ({ ...activity, status: activity.status ?? "published" })),
      "Agenda inicial importada."
    );
  };

  if (authLoading) {
    return <p className="rounded-sm bg-white p-6 font-bold shadow-sm">Verificando sesión...</p>;
  }

  if (!authenticated) {
    return (
      <AdminLogin
        onLogin={(token) => {
          setAccessToken(token);
          setAuthenticated(true);
          loadActivities(token);
        }}
      />
    );
  }

  return (
    <div className="grid gap-8">
      {hasSupabaseBrowserEnv() ? (
        <div className="flex flex-col gap-3 rounded-sm bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-bold text-carbon/65">
            Sesión protegida: token activo por {formatDuration(adminSessionDurationMs)} y cierre por inactividad a los {formatDuration(adminIdleTimeoutMs)}.
          </p>
          <button
            type="button"
            onClick={logout}
            className="focus-ring rounded-full border border-carbon/15 px-4 py-2 text-xs font-black uppercase tracking-wide transition hover:border-pine"
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <p className="rounded-sm bg-white p-4 text-sm font-bold text-carbon/70 shadow-sm">
          Modo demo local: configurá Supabase en `.env.local` para activar login y base de datos.
        </p>
      )}

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Publicadas" value={stats.published} />
        <StatCard label="Borradores" value={stats.draft} />
        <StatCard label="Archivadas" value={stats.archived} />
      </section>

      <section className="grid gap-8">
        <ActivityModal open={modalOpen} busy={saving} onClose={() => setModalOpen(false)}>
        <form
          className="grid gap-5 rounded-sm bg-white p-5 shadow-sm md:p-6"
          onSubmit={(event) => {
            event.preventDefault();
            void saveDraft();
          }}
        >
          <div className="flex flex-col gap-3 border-b border-carbon/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="eyebrow">Actividad</p>
              <h2 id="activity-modal-title" className="mt-2 font-display text-3xl font-black uppercase">
                {editingSlug ? "Editar actividad" : "Nueva actividad"}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setDraft(createEmptyActivity());
                setEditingSlug(null);
                setMapMessage(null);
              }}
              className="focus-ring rounded-full border border-carbon/15 px-4 py-2 text-xs font-black uppercase tracking-wide"
            >
              Limpiar
            </button>
          </div>

          <FormSection title="Datos principales" description="Lo mínimo para que la actividad aparezca clara en tarjetas, buscador y detalle.">
            <TextField label="Título" value={draft.name} onChange={(value) => updateDraft({ name: value })} />
            <TextField
              label="Slug"
              value={draft.slug}
              onChange={(value) => updateDraft({ slug: slugifyActivityName(value) })}
              placeholder="Se genera automático si queda vacío"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <DateField label="Fecha" value={draft.nextDateIso ?? ""} min={todayIso} onChange={setDate} />
              <TextField label="Lugar visible" value={draft.location} onChange={(value) => updateDraft({ location: value })} placeholder="Ej: Sierra de Guadarrama, Madrid" />
              <SelectField
                label="Estado"
                value={draft.status ?? "draft"}
                options={statusOptions.map((option) => ({ value: option, label: statusLabels[option] }))}
                onChange={(value) => updateDraft({ status: value as ActivityStatus })}
              />
            </div>
          </FormSection>

          <FormSection title="Ubicación para el mapa" description="Pegá un link de Google Maps con coordenadas o cargá latitud/longitud manualmente.">
            <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
              <TextField
                label="Link de Google Maps"
                type="url"
                value={draft.googleMapsUrl ?? ""}
                onChange={(value) => updateDraft({ googleMapsUrl: value })}
                onBlur={applyGoogleMapsCoordinates}
                placeholder="https://www.google.com/maps?q=40.793,-3.976"
              />
              <button
                type="button"
                onClick={applyGoogleMapsCoordinates}
                className="focus-ring min-h-12 rounded-full bg-carbon px-5 text-xs font-black uppercase tracking-wide text-white transition hover:bg-pine"
              >
                Leer coordenadas
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <NumberField
                label="Latitud"
                value={numberValue(draft.latitude)}
                step="any"
                onChange={(value) => updateDraft({ latitude: parseNumber(value) })}
              />
              <NumberField
                label="Longitud"
                value={numberValue(draft.longitude)}
                step="any"
                onChange={(value) => updateDraft({ longitude: parseNumber(value) })}
              />
            </div>
            </FormSection>

          <FormSection title="Clasificación" description="Estos controles alimentan los filtros del home y del buscador.">
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Tipo"
                value={selectedType}
                options={typeFilters.map((option) => ({ value: option, label: filterLabels[option] }))}
                onChange={(value) => setTypeFilter(value as ActivityFilter)}
              />
              <SelectField
                label="Dificultad"
                value={draft.difficulty}
                options={difficultyOptions.map((option) => ({ value: option, label: option }))}
                onChange={(value) => updateDraft({ difficulty: value as ActivityDifficulty })}
              />
              <NumberField
                label="Duración"
                value={numberValue(draft.durationDays)}
                min={1}
                step={1}
                suffix={draft.durationDays === 1 ? "día" : "días"}
                onChange={setDurationDays}
              />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <CheckboxGroup title="Lugares" options={placeFilters} selected={draft.filters} onToggle={toggleFilter} />
            </div>
          </FormSection>

          <FormSection title="Medidas y cupos" description="Cargá solo números; la web agrega unidades automáticamente.">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <NumberField
                label="Distancia"
                value={numberValue(draft.distanceKm)}
                min={0}
                step="0.1"
                suffix="km"
                onChange={(value) => {
                  const distanceKm = parseNumber(value);
                  updateDraft({ distanceKm, distance: formatOptionalMeasure(distanceKm, "km", "") });
                }}
              />
              <NumberField
                label="Desnivel"
                value={numberValue(draft.elevationM)}
                min={0}
                step={1}
                suffix="m"
                onChange={(value) => {
                  const elevationM = parseNumber(value);
                  updateDraft({ elevationM, elevation: formatOptionalMeasure(elevationM, "m", "") });
                }}
              />
              <NumberField
                label="Edad mínima"
                value={numberValue(draft.minAgeYears)}
                min={0}
                step={1}
                suffix="años"
                onChange={(value) => {
                  const minAgeYears = parseNumber(value);
                  updateDraft({ minAgeYears, minAge: minAgeYears === undefined ? "Consultar" : `${minAgeYears} años` });
                }}
              />
              <NumberField
                label="Participantes"
                value={numberValue(draft.maxParticipantsCount)}
                min={1}
                step={1}
                suffix="personas"
                onChange={(value) => {
                  const maxParticipantsCount = parseNumber(value);
                  updateDraft({
                    maxParticipantsCount,
                    maxParticipants: maxParticipantsCount === undefined ? "Cupo limitado" : `${maxParticipantsCount} personas`
                  });
                }}
              />
              <TextField label="Precio" value={draft.price} onChange={(value) => updateDraft({ price: value })} placeholder="Consultar valor" />
            </div>
          </FormSection>

          <FormSection title="Contenido público" description="Imágenes y texto principal que verá el visitante.">
            <label className="grid gap-2">
              <span className="text-sm font-bold">Imágenes del evento</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={uploadImages}
                className="focus-ring rounded-sm border border-carbon/15 bg-fog px-4 py-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-pine file:px-4 file:py-2 file:text-xs file:font-black file:uppercase file:tracking-wide file:text-white"
              />
              <span className="text-xs font-bold uppercase tracking-wide text-carbon/45">
                Máximo 3 imágenes. La primera se usa como portada.
              </span>
            </label>

            {previewImages.length ? (
              <div className="grid gap-3 sm:grid-cols-3">
                {previewImages.map((image, index) => (
                  <div key={`${image}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-sm bg-carbon">
                    <img src={image} alt={buildImageAlt(draft.name)} className="h-full w-full object-cover" />
                    {draft.images?.length ? (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="focus-ring absolute right-2 top-2 rounded-full bg-carbon/80 px-3 py-1 text-[0.65rem] font-black uppercase tracking-wide text-white"
                      >
                        Quitar
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}

            <TextAreaField
              label="¿En qué consiste la experiencia?"
              value={draft.description}
              onChange={(value) => updateDraft({ description: value })}
              rows={6}
            />
            <div className="grid gap-4 lg:grid-cols-2">
              <ItemCheckboxGroup
                title="Qué incluye"
                options={includeOptions}
                selected={draft.includes}
                onToggle={(item) => toggleListItem("includes", item)}
              />
              <ItemCheckboxGroup
                title="Equipo obligatorio"
                options={requiredGearOptions}
                selected={draft.requiredGear}
                onToggle={(item) => toggleListItem("requiredGear", item)}
              />
              <ItemCheckboxGroup
                title="Equipo recomendado"
                options={recommendedGearOptions}
                selected={draft.recommendedGear}
                onToggle={(item) => toggleListItem("recommendedGear", item)}
              />
            </div>
          </FormSection>


          <button
            type="submit"
            disabled={saving}
            className="focus-ring rounded-full bg-pine px-6 py-4 text-sm font-black uppercase tracking-wide text-fog transition hover:bg-carbon disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Guardando..." : editingSlug ? "Guardar cambios" : "Crear actividad"}
          </button>
        </form>
        </ActivityModal>

        <section className="rounded-sm bg-white p-6 shadow-sm">
          <div className="border-b border-carbon/10 pb-5">
            <p className="eyebrow">Agenda</p>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="mt-2 font-display text-3xl font-black uppercase">Actividades cargadas</h2>
              <button type="button" disabled={saving || loading} onClick={() => {
                setDraft(createEmptyActivity()); setEditingSlug(null); setModalOpen(true);
              }} className="focus-ring rounded-full bg-pine px-6 py-3 text-sm font-black text-fog disabled:opacity-60">+ Añadir actividad</button>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_240px]">
              <label className="grid gap-2 text-sm font-bold">Buscar actividades
                <input type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Título, lugar o descripción…" className="focus-ring min-w-0 rounded-sm border border-carbon/15 bg-fog px-4 py-3" />
              </label>
              <SelectField label="Estado" value={statusFilter} onChange={(value) => { setStatusFilter(value); setPage(1); }} options={[{ value: "all", label: "Todos los estados" }, ...statusOptions.map((value) => ({ value, label: statusLabels[value] }))]} />
            </div>
          </div>

          {loading ? (
            <p className="mt-6 text-carbon/60">Cargando actividades...</p>
          ) : activities.length === 0 ? (
            <div className="mt-6 rounded-sm border border-carbon/10 bg-fog p-5">
              <p className="font-bold">Todavía no hay actividades en Supabase.</p>
              <p className="mt-2 text-sm text-carbon/65">
                Podés crear la primera manualmente o importar la agenda inicial cargada en el proyecto.
              </p>
              <button
                type="button"
                onClick={importSeedActivities}
                disabled={saving}
                className="focus-ring mt-4 rounded-full bg-pine px-5 py-3 text-xs font-black uppercase tracking-wide text-fog transition hover:bg-carbon disabled:cursor-not-allowed disabled:opacity-60"
              >
                Importar agenda inicial
              </button>
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {filteredActivities.length === 0 && <p className="rounded-sm bg-fog p-5 text-carbon/65">No hay actividades que coincidan con la búsqueda y el estado seleccionados.</p>}
              {visibleActivities.map((activity) => (
                <article key={activity.slug} className="rounded-sm border border-carbon/10 p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-carbon/45">
                        {formatActivityDate(activity) || "Sin fecha"} · {activity.location || "Sin lugar"}
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-black uppercase leading-tight">{activity.name}</h3>
                      <p className="mt-2 text-sm text-carbon/65">{activity.summary || "Sin resumen cargado."}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <StatusBadge status={activity.status ?? "published"} />
                        <span className="rounded-full bg-fog px-3 py-1 text-xs font-bold text-carbon/70">
                          {formatActivityDuration(activity)}
                        </span>
                        {formatActivityDistance(activity) ? (
                          <span className="rounded-full bg-fog px-3 py-1 text-xs font-bold text-carbon/70">
                            {formatActivityDistance(activity)}
                          </span>
                        ) : null}
                        {activity.latitude !== undefined && activity.longitude !== undefined ? (
                          <span className="rounded-full bg-moss/20 px-3 py-1 text-xs font-bold text-carbon/70">
                            En mapa
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <button type="button" disabled={saving} onClick={() => editActivity(activity)} className="admin-action-button">
                        Editar
                      </button>
                      <button type="button" disabled={saving} onClick={() => duplicateActivity(activity)} className="admin-action-button">
                        Duplicar
                      </button>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => changeStatus(activity, activity.status === "published" || !activity.status ? "archived" : "published")}
                        className="admin-action-button"
                      >
                        {activity.status === "published" || !activity.status ? "Archivar" : "Publicar"}
                      </button>
                      <button type="button" disabled={saving} onClick={() => deleteActivity(activity)} className="admin-action-button text-ember">
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          {!loading && filteredActivities.length > 0 && (
            <nav aria-label="Paginación de actividades" className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-carbon/10 pt-5">
              <p aria-live="polite" className="text-sm text-carbon/65">{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredActivities.length)} de {filteredActivities.length} actividades</p>
              <div className="flex items-center gap-3">
                <button type="button" className="admin-action-button disabled:opacity-40" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Anterior</button>
                <span className="text-sm">Página {currentPage} de {pageCount}</span>
                <button type="button" className="admin-action-button disabled:opacity-40" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Siguiente</button>
              </div>
            </nav>
          )}
        </section>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-sm bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wide text-carbon/45">{label}</p>
      <strong className="mt-2 block font-display text-4xl font-black text-pine">{value}</strong>
    </div>
  );
}

function FormSection({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-4 rounded-sm border border-carbon/10 bg-white p-4">
      <div>
        <h3 className="font-display text-xl font-black uppercase leading-none">{title}</h3>
        <p className="mt-2 text-sm text-carbon/60">{description}</p>
      </div>
      {children}
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: "text" | "url";
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold">{label}</span>
      <input
        type={type}
        value={value}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="focus-ring min-h-12 rounded-sm border border-carbon/15 bg-fog px-4 py-3"
      />
    </label>
  );
}

function DateField({
  label,
  value,
  min,
  onChange
}: {
  label: string;
  value: string;
  min: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold">{label}</span>
      <input
        type="date"
        value={value}
        min={min}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring min-h-12 rounded-sm border border-carbon/15 bg-fog px-4 py-3"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  step,
  suffix
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  step?: number | "any" | string;
  suffix?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold">{label}</span>
      <span className="flex min-h-12 overflow-hidden rounded-sm border border-carbon/15 bg-fog focus-within:ring-2 focus-within:ring-ember/55">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          step={step}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 outline-none"
        />
        {suffix ? (
          <span className="flex items-center border-l border-carbon/10 bg-white px-3 text-sm font-black text-carbon/55">
            {suffix}
          </span>
        ) : null}
      </span>
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 4
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring rounded-sm border border-carbon/15 bg-fog px-4 py-3"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring min-h-12 rounded-sm border border-carbon/15 bg-fog px-4 py-3"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxGroup({
  title,
  options,
  selected,
  onToggle
}: {
  title: string;
  options: ActivityFilter[];
  selected: ActivityFilter[];
  onToggle: (filter: ActivityFilter) => void;
}) {
  return (
    <fieldset className="rounded-sm border border-carbon/10 bg-fog p-4">
      <legend className="px-2 text-sm font-black uppercase tracking-wide text-carbon/55">{title}</legend>
      <div className="mt-2 grid gap-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-3 rounded-sm bg-white px-3 py-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
              className="h-4 w-4 accent-pine"
            />
            <span>{filterLabels[option]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function ItemCheckboxGroup({
  title,
  options,
  selected,
  onToggle
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (item: string) => void;
}) {
  return (
    <fieldset className="rounded-sm border border-carbon/10 bg-fog p-4">
      <legend className="px-2 text-sm font-black uppercase tracking-wide text-carbon/55">{title}</legend>
      <div className="mt-2 grid gap-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-3 rounded-sm bg-white px-3 py-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
              className="h-4 w-4 accent-pine"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function StatusBadge({ status }: { status: ActivityStatus }) {
  const className =
    status === "published"
      ? "bg-moss/25 text-carbon"
      : status === "draft"
        ? "bg-fog text-carbon/70"
        : "bg-ember/15 text-carbon";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${className}`}>
      {statusLabels[status]}
    </span>
  );
}
