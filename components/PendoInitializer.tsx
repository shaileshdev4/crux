"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    if (!authReady || typeof pendo === "undefined") return;
    const id = visitorId(user?.id);
    if (!id) return;
    pendo.initialize({
      visitor: { id },
      account: { id: user?.id ? `account-${user.id}` : "anonymous" },
    });
    initialized.current = true;
  }, [authReady, user?.id]);

  useEffect(() => {
    if (!initialized.current || typeof pendo === "undefined") return;
    pendo.pageLoad();
  }, [pathname]);

  return null;
}
