function readPositiveNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const adminSessionDurationMs = readPositiveNumber(process.env.NEXT_PUBLIC_ADMIN_SESSION_MINUTES, 120) * 60 * 1000;
export const adminIdleTimeoutMs = readPositiveNumber(process.env.NEXT_PUBLIC_ADMIN_IDLE_MINUTES, 30) * 60 * 1000;
export const adminMaxLoginAttempts = readPositiveNumber(process.env.NEXT_PUBLIC_ADMIN_MAX_LOGIN_ATTEMPTS, 5);
export const adminLoginLockMs = readPositiveNumber(process.env.NEXT_PUBLIC_ADMIN_LOGIN_LOCK_MINUTES, 15) * 60 * 1000;

export const adminSessionStartedKey = "suriaco-admin-session-started-at";
export const adminLastActivityKey = "suriaco-admin-last-activity-at";
export const adminLoginAttemptsKey = "suriaco-admin-login-attempts";
export const adminLoginLockedUntilKey = "suriaco-admin-login-locked-until";

export function formatDuration(ms: number) {
  const minutes = Math.max(1, Math.round(ms / 60000));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

export function markAdminSessionStarted() {
  const now = Date.now().toString();
  window.localStorage.setItem(adminSessionStartedKey, now);
  window.localStorage.setItem(adminLastActivityKey, now);
}

export function markAdminActivity() {
  window.localStorage.setItem(adminLastActivityKey, Date.now().toString());
}

export function clearAdminSessionTracking() {
  window.localStorage.removeItem(adminSessionStartedKey);
  window.localStorage.removeItem(adminLastActivityKey);
}

export function getAdminSessionExpiredReason() {
  const now = Date.now();
  const startedAt = Number(window.localStorage.getItem(adminSessionStartedKey) ?? now);
  const lastActivityAt = Number(window.localStorage.getItem(adminLastActivityKey) ?? now);

  if (!Number.isFinite(startedAt) || !Number.isFinite(lastActivityAt)) {
    markAdminSessionStarted();
    return null;
  }

  if (now - startedAt > adminSessionDurationMs) return "La sesión llegó a su tiempo máximo.";
  if (now - lastActivityAt > adminIdleTimeoutMs) return "La sesión se cerró por inactividad.";
  return null;
}
