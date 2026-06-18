"use client";

import { useEffect } from "react";
import { useLedger } from "@/components/LedgerStore";

const ANON_VISITOR_KEY = "crux-pendo-visitor";

function visitorId(userId: string | undefined): string {
  if (userId) return userId;
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

  useEffect(() => {
    if (!authReady || typeof pendo === "undefined") return;
    const id = visitorId(user?.id);
    if (!id) return;
    pendo.initialize({ visitor: { id } });
  }, [authReady, user?.id]);

  return null;
}
