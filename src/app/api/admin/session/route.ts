import { NextResponse } from "next/server";
import {
  clearAdminSessionCookie,
  createAdminSessionValue,
  setAdminSessionCookie,
  validateSupabaseAdminUser
} from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await validateSupabaseAdminUser(request);
  if (auth.error) return auth.error;

  if (!auth.user) {
    return NextResponse.json({ demo: true });
  }

  const session = createAdminSessionValue(auth.user);
  const response = NextResponse.json({
    expiresAt: session.expiresAt,
    maxAgeSeconds: session.maxAgeSeconds
  });

  setAdminSessionCookie(response, session.value, session.maxAgeSeconds);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  clearAdminSessionCookie(response);
  return response;
}
