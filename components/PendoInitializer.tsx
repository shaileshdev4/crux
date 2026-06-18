"use client";

import { useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function getOrCreateAnonymousId(): string {
  const key = "crux_visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function PendoInitializer() {
  useEffect(() => {
    // Initialize with anonymous ID immediately so page views are captured
    pendo.initialize({ visitor: { id: getOrCreateAnonymousId() } });

    if (!isSupabaseConfigured()) return;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    // Identify with real user ID + email once auth state is known
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (user) {
        pendo.identify({
          visitor: {
            id: user.id,
            email: user.email ?? undefined,
          },
        });
      }
    });

    // Re-identify on sign in / sign out
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      if (user) {
        pendo.identify({
          visitor: {
            id: user.id,
            email: user.email ?? undefined,
          },
        });
      } else {
        // Revert to anonymous ID on sign out
        pendo.identify({ visitor: { id: getOrCreateAnonymousId() } });
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return null;
}
