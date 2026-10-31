import { NextResponse } from "next/server";
import type { Activity } from "@/data/activities";
import { readActivitiesFromStore, writeActivitiesToStore } from "@/lib/activityStore";
import { isPublicActivity } from "@/lib/activityUtils";
import { validateAdminSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

async function validateAdminRequest(request: Request) {
  return validateAdminSession(request);
}

export async function GET(request: Request) {
  const activities = await readActivitiesFromStore();
  const { searchParams } = new URL(request.url);

  if (searchParams.get("scope") === "admin") {
    const authError = await validateAdminRequest(request);
    if (authError) return authError;

    return NextResponse.json(
      { activities },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  }

  return NextResponse.json(
    { activities: activities.filter(isPublicActivity) },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
  );
}

export async function PUT(request: Request) {
  try {
    const authError = await validateAdminRequest(request);
    if (authError) return authError;

    const body = await request.json();
    const activities = body?.activities;

    if (!Array.isArray(activities)) {
      return NextResponse.json({ error: "El payload debe incluir activities como array." }, { status: 400 });
    }

    await writeActivitiesToStore(activities as Activity[]);
    const savedActivities = await readActivitiesFromStore();
    return NextResponse.json(
      { activities: savedActivities },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudieron guardar las actividades.";
    console.error("Activities save failed:", message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
