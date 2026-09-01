import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { createSupabaseAuthClient, hasSupabaseBrowserEnv, hasSupabaseServerEnv } from "@/lib/supabase";

const cookieName = "suriaco_admin_session";
const defaultSessionMinutes = 120;

type AdminSessionPayload = {
  sub: string;
  email: string;
  iat: number;
  exp: number;
};

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("Falta ADMIN_SESSION_SECRET o SUPABASE_SERVICE_ROLE_KEY.");
  return secret;
}

function getSessionMaxAgeSeconds() {
  const minutes = Number(process.env.ADMIN_SESSION_MINUTES ?? defaultSessionMinutes);
  const safeMinutes = Number.isFinite(minutes) && minutes > 0 ? minutes : defaultSessionMinutes;
  return Math.round(safeMinutes * 60);
}

function signPayload(encodedPayload: string) {
  return createHmac("sha256", getSessionSecret()).update(encodedPayload).digest("base64url");
}

function parseCookies(request: Request) {
  return Object.fromEntries(
    (request.headers.get("cookie") ?? "")
      .split(";")
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const [name, ...value] = cookie.split("=");
        return [name, value.join("=")];
      })
  );
}

function getBearerToken(request: Request) {
  const authHeader = request.headers.get("authorization");
  return authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;
}

function isAllowedAdminEmail(email: string | undefined) {
  const allowedEmails = process.env.SUPABASE_ADMIN_EMAILS?.split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (!allowedEmails?.length) return true;
  return allowedEmails.includes(email?.toLowerCase() ?? "");
}

export async function validateSupabaseAdminUser(request: Request) {
  if (!hasSupabaseBrowserEnv() || !hasSupabaseServerEnv()) return { user: null, token: null };

  const token = getBearerToken(request);
  if (!token) {
    return { error: NextResponse.json({ error: "No autorizado." }, { status: 401 }) };
  }

  const supabaseAuth = createSupabaseAuthClient(token);
  const { data, error } = await supabaseAuth.auth.getUser();

  if (error || !data.user) {
    return { error: NextResponse.json({ error: "Sesión inválida." }, { status: 401 }) };
  }

  if (!isAllowedAdminEmail(data.user.email)) {
    return { error: NextResponse.json({ error: "Usuario sin permisos de administración." }, { status: 403 }) };
  }

  return { user: data.user, token };
}

export function createAdminSessionValue(user: { id: string; email?: string }) {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = {
    sub: user.id,
    email: user.email ?? "",
    iat: now,
    exp: now + getSessionMaxAgeSeconds()
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);

  return {
    value: `${encodedPayload}.${signature}`,
    expiresAt: payload.exp,
    maxAgeSeconds: getSessionMaxAgeSeconds()
  };
}

export function validateAdminSessionCookie(request: Request, user: { id: string; email?: string }) {
  const sessionValue = parseCookies(request)[cookieName];
  if (!sessionValue) {
    return NextResponse.json({ error: "Sesión admin expirada." }, { status: 401 });
  }

  const [encodedPayload, signature] = sessionValue.split(".");
  if (!encodedPayload || !signature) {
    return NextResponse.json({ error: "Sesión admin inválida." }, { status: 401 });
  }

  const expectedSignature = signPayload(encodedPayload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return NextResponse.json({ error: "Sesión admin inválida." }, { status: 401 });
  }

  let payload: AdminSessionPayload;

  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload)) as AdminSessionPayload;
  } catch (error) {
    return NextResponse.json({ error: "Sesión admin inválida." }, { status: 401 });
  }

  const now = Math.floor(Date.now() / 1000);

  if (payload.exp <= now || payload.sub !== user.id || payload.email !== (user.email ?? "")) {
    return NextResponse.json({ error: "Sesión admin expirada." }, { status: 401 });
  }

  return null;
}

export function setAdminSessionCookie(response: NextResponse, value: string, maxAgeSeconds: number) {
  response.cookies.set(cookieName, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds
  });
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}
