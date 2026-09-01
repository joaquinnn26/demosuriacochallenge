import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function noStoreFetch(input: RequestInfo | URL, init?: RequestInit) {
  return fetch(input, { ...init, cache: "no-store" });
}

export function hasSupabaseBrowserEnv() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function hasSupabaseServerEnv() {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}

export function createSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export function createSupabaseAuthClient(accessToken: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: noStoreFetch,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  });
}

export function createSupabaseAdminClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    global: {
      fetch: noStoreFetch,
      headers: {
        Authorization: `Bearer ${supabaseServiceRoleKey}`
      }
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  });
}
