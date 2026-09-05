"use client";

import { useMemo, useState } from "react";
import { notifyError as setError } from "@/lib/alerts";
import {
  adminLoginAttemptsKey,
  adminLoginLockMs,
  adminLoginLockedUntilKey,
  adminMaxLoginAttempts,
  clearAdminSessionTracking,
  formatDuration,
  markAdminSessionStarted
} from "@/lib/adminSecurity";
import { createSupabaseBrowserClient } from "@/lib/supabase";

function normalizeEmail(value: string) {
  return value.trim().replace(/\\+@/g, "@").toLowerCase();
}

export function AdminLogin({ onLogin }: { onLogin: (accessToken: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockTick, setLockTick] = useState(0);

  const lockedUntil = useMemo(() => {
    if (typeof window === "undefined") return 0;
    return Number(window.localStorage.getItem(adminLoginLockedUntilKey) ?? 0);
  }, [lockTick]);
  const lockedMs = Math.max(0, lockedUntil - Date.now());
  const isLocked = lockedMs > 0;

  const registerFailedAttempt = () => {
    const attempts = Number(window.localStorage.getItem(adminLoginAttemptsKey) ?? 0) + 1;
    window.localStorage.setItem(adminLoginAttemptsKey, attempts.toString());

    if (attempts >= adminMaxLoginAttempts) {
      window.localStorage.setItem(adminLoginLockedUntilKey, (Date.now() + adminLoginLockMs).toString());
      window.localStorage.removeItem(adminLoginAttemptsKey);
      setLockTick((value) => value + 1);
    }
  };

  const clearFailedAttempts = () => {
    window.localStorage.removeItem(adminLoginAttemptsKey);
    window.localStorage.removeItem(adminLoginLockedUntilKey);
    setLockTick((value) => value + 1);
  };

  const login = async () => {
    if (isLocked) {
      setError(`Demasiados intentos fallidos. Probá de nuevo en ${formatDuration(lockedMs)}.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const normalizedEmail = normalizeEmail(email);
      const supabase = createSupabaseBrowserClient();
      await fetch("/api/admin/session", { method: "DELETE", credentials: "same-origin" }).catch(() => null);
      clearAdminSessionTracking();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });

      if (error || !data.session) throw new Error(error?.message ?? "No se pudo iniciar sesión.");

      const response = await fetch("/api/admin/session", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          Authorization: `Bearer ${data.session.access_token}`
        }
      });

      if (!response.ok) {
        await supabase.auth.signOut();
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Usuario sin permisos de administración.");
      }

      clearFailedAttempts();
      markAdminSessionStarted();
      onLogin(data.session.access_token);
    } catch (loginError) {
      registerFailedAttempt();
      setError(loginError instanceof Error ? loginError.message : "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-sm bg-white p-7 shadow-sm">
      <p className="eyebrow">Acceso privado</p>
      <h2 className="mt-3 font-display text-3xl font-black uppercase">Ingresar al panel</h2>
      <div className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-bold">Email</span>
          <input
            type="email"
            value={email}
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value.replace(/\\+@/g, "@"))}
            className="focus-ring rounded-sm border border-carbon/15 bg-fog px-4 py-3"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold">Contraseña</span>
          <input
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            className="focus-ring rounded-sm border border-carbon/15 bg-fog px-4 py-3"
          />
        </label>
        {isLocked ? (
          <p className="rounded-sm bg-ember/15 p-3 text-sm font-bold">
            Panel bloqueado temporalmente. Probá de nuevo en {formatDuration(lockedMs)}.
          </p>
        ) : null}
        <button
          type="button"
          onClick={login}
          disabled={loading || !email || !password || isLocked}
          className="focus-ring rounded-full bg-pine px-6 py-4 text-sm font-black uppercase tracking-wide text-fog transition hover:bg-carbon disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </div>
    </div>
  );
}
