import { getSupabaseClient } from "@/lib/supabase/client";
import { authCallbackUrl } from "@/lib/auth-redirect";

function clientOrigin() {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export async function signInWithMagicLink(email: string, nextPath = "/") {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: new Error("Auth not configured") };
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: authCallbackUrl(nextPath, clientOrigin()) },
  });
}

export async function signInWithGoogle(nextPath = "/") {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: new Error("Auth not configured") };
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: authCallbackUrl(nextPath, clientOrigin()) },
  });
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: new Error("Auth not configured") };
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithPassword(email: string, password: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: new Error("Auth not configured") };
  return supabase.auth.signUp({ email, password });
}

export async function signOut() {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: null };
  return supabase.auth.signOut();
}
