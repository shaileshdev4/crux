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
  }, []);

  // Once auth resolves with a real user, upgrade the visitor identity so the
  // anonymous session is merged with the authenticated visitor record.
  useEffect(() => {
    if (!authReady || !user?.id || typeof pendo === "undefined") return;
    pendo.identify?.({ visitor: { id: user.id } });
  }, [authReady, user?.id]);

  useEffect(() => {
    if (!initialized.current || typeof pendo === "undefined") return;
    pendo.pageLoad();
  }, [pathname]);

  return null;
}
