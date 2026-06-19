"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLedger } from "@/components/LedgerStore";

const ANON_VISITOR_KEY = "crux-pendo-visitor";

function anonId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(ANON_VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(ANON_VISITOR_KEY, id);
  }
  return id;
}

export function PendoInitializer() {
  const { user, authReady } = useLedger();
  const pathname = usePathname();
  const initialized = useRef(false);

  // Initialize Pendo immediately with an anonymous visitor id so page views
  // and feature clicks are captured from the first render — even for
  // brief-session visitors that leave before Supabase auth resolves.
  useEffect(() => {
    if (typeof pendo === "undefined") return;
    const id = anonId();
    if (!id) return;
    pendo.initialize({ visitor: { id } });
    initialized.current = true;
  }, []);

  // Once auth resolves with a real user, upgrade the visitor identity so the
  // anonymous session is merged with the authenticated visitor record.
  // Forward email and display name from Supabase (populated by Google OAuth,
  // magic link, and email/password sign-ins) so Novus analytics can surface
  // the user by name instead of a raw UUID.
  useEffect(() => {
    if (!authReady || !user?.id || typeof pendo === "undefined") return;
    pendo.identify?.({
      visitor: {
        id: user.id,
        email: user.email ?? undefined,
        full_name:
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          undefined,
      },
    });
  }, [authReady, user?.id, user?.email, user?.user_metadata?.full_name, user?.user_metadata?.name]);

  useEffect(() => {
    if (!initialized.current || typeof pendo === "undefined") return;
    pendo.pageLoad();
  }, [pathname]);

  return null;
}
