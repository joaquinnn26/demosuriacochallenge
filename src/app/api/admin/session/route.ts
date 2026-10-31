import { NextResponse } from "next/server";
import { clearAdminSessionCookie, createAdminSessionValue, setAdminSessionCookie, validateAdminSession, verifyAdminCredentials } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const error = validateAdminSession(request);
  return error ?? NextResponse.json({ authenticated: true });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email : "";
    const password = typeof body?.password === "string" ? body.password : "";
    if (!verifyAdminCredentials(email, password)) return NextResponse.json({ error: "Email o contraseña incorrectos." }, { status: 401 });
    const session = createAdminSessionValue(email);
    const response = NextResponse.json({ expiresAt: session.expiresAt, maxAgeSeconds: session.maxAgeSeconds });
    setAdminSessionCookie(response, session.value, session.maxAgeSeconds);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo iniciar sesión.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  clearAdminSessionCookie(response);
  return response;
}
