import { createHmac, scryptSync, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

const cookieName = "suriaco_admin_session";
const defaultSessionMinutes = 120;

type AdminSessionPayload = { email: string; iat: number; exp: number };

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("Falta ADMIN_SESSION_SECRET.");
  return secret;
}

function getSessionMaxAgeSeconds() {
  const minutes = Number(process.env.ADMIN_SESSION_MINUTES ?? defaultSessionMinutes);
  return Math.round((Number.isFinite(minutes) && minutes > 0 ? minutes : defaultSessionMinutes) * 60);
}

function signPayload(encodedPayload: string) {
  return createHmac("sha256", getSessionSecret()).update(encodedPayload).digest("base64url");
}

function parseCookies(request: Request) {
  return Object.fromEntries((request.headers.get("cookie") ?? "").split(";").map((item) => item.trim()).filter(Boolean).map((item) => {
    const [name, ...value] = item.split("=");
    return [name, value.join("=")];
  }));
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function verifyAdminCredentials(email: string, password: string) {
  const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedEmail || !passwordHash) throw new Error("Faltan ADMIN_EMAIL o ADMIN_PASSWORD_HASH.");

  const separator = passwordHash.includes(":") ? ":" : "$";
  const [algorithm, salt, expectedHash] = passwordHash.split(separator);
  if (algorithm !== "scrypt" || !salt || !expectedHash) throw new Error("ADMIN_PASSWORD_HASH no tiene un formato válido.");
  const actualHash = scryptSync(password, salt, 64).toString("base64url");
  return safeEqual(email.trim().toLowerCase(), expectedEmail) && safeEqual(actualHash, expectedHash);
}

export function createAdminSessionValue(email: string) {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = { email: email.trim().toLowerCase(), iat: now, exp: now + getSessionMaxAgeSeconds() };
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return { value: `${encodedPayload}.${signPayload(encodedPayload)}`, expiresAt: payload.exp, maxAgeSeconds: getSessionMaxAgeSeconds() };
}

export function validateAdminSession(request: Request) {
  const sessionValue = parseCookies(request)[cookieName];
  if (!sessionValue) return NextResponse.json({ error: "Sesión admin expirada." }, { status: 401 });
  const [encodedPayload, signature] = sessionValue.split(".");
  if (!encodedPayload || !signature || !safeEqual(signature, signPayload(encodedPayload))) {
    return NextResponse.json({ error: "Sesión admin inválida." }, { status: 401 });
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as AdminSessionPayload;
    const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (!expectedEmail || payload.exp <= Math.floor(Date.now() / 1000) || payload.email !== expectedEmail) {
      return NextResponse.json({ error: "Sesión admin expirada." }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Sesión admin inválida." }, { status: 401 });
  }
  return null;
}

export function setAdminSessionCookie(response: NextResponse, value: string, maxAgeSeconds: number) {
  response.cookies.set(cookieName, value, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: maxAgeSeconds });
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(cookieName, "", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
}
