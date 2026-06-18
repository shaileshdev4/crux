"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { SAMPLE_LEDGER } from "@/lib/seed";
import {
  fetchUserDecisions,
  insertDecision,
  updateDecisionResolution,
} from "@/lib/decisions-db";
import { getSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Decision, Outcome } from "@/lib/types";

export type LedgerViewMode = "anonymous" | "mine" | "sample";

interface LedgerContextValue {
  ledger: Decision[];
  commit: (d: Omit<Decision, "id" | "committedAt" | "outcome" | "resolvedAt" | "isSample">) => void;
  resolve: (id: string, outcome: Outcome, note?: string) => void;
  isNew: (id: string) => boolean;
  readOnly: boolean;
  viewMode: LedgerViewMode;
  setViewMode: (mode: "mine" | "sample") => void;
  user: User | null;
  authReady: boolean;
  supabaseEnabled: boolean;
}

const LedgerContext = createContext<LedgerContextValue | null>(null);

function freshSampleSession() {
  return [...SAMPLE_LEDGER];
}

export function LedgerProvider({ children }: { children: React.ReactNode }) {
  const supabaseEnabled = isSupabaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(!supabaseEnabled);
  const [viewMode, setViewModeState] = useState<LedgerViewMode>("anonymous");
  const [sessionLedger, setSessionLedger] = useState<Decision[]>(freshSampleSession);
  const [userLedger, setUserLedger] = useState<Decision[]>([]);
  const [loadingLedger, setLoadingLedger] = useState(false);
  const newIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!supabaseEnabled) return;

    const supabase = getSupabaseClient();
    if (!supabase) {
      setAuthReady(true);
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setViewModeState(data.user ? "mine" : "anonymous");
      setAuthReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (nextUser) {
        setViewModeState("mine");
      } else {
        setViewModeState("anonymous");
        setSessionLedger(freshSampleSession());
        setUserLedger([]);
        newIdsRef.current.clear();
      }
      if (event === "SIGNED_OUT") {
        setSessionLedger(freshSampleSession());
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [supabaseEnabled]);

  useEffect(() => {
    if (!supabaseEnabled || !user || viewMode !== "mine") return;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    let cancelled = false;
    setLoadingLedger(true);
    fetchUserDecisions(supabase, user.id)
      .then((rows) => {
        if (!cancelled) setUserLedger(rows);
      })
      .catch((err) => console.error("load decisions", err))
      .finally(() => {
        if (!cancelled) setLoadingLedger(false);
      });

    return () => {
      cancelled = true;
    };
  }, [supabaseEnabled, user, viewMode]);

  const effectiveViewMode: LedgerViewMode = useMemo(() => {
    if (!supabaseEnabled || !user) return "anonymous";
    return viewMode === "sample" ? "sample" : "mine";
  }, [supabaseEnabled, user, viewMode]);

  const ledger = useMemo(() => {
    if (effectiveViewMode === "mine") return userLedger;
    if (effectiveViewMode === "sample") return [...SAMPLE_LEDGER];
    return sessionLedger;
  }, [effectiveViewMode, userLedger, sessionLedger]);

  const readOnly = effectiveViewMode === "sample";

  const setViewMode = useCallback(
    (mode: "mine" | "sample") => {
      if (!user) return;
      setViewModeState(mode);
    },
    [user],
  );

  const commit = useCallback(
    (d: Omit<Decision, "id" | "committedAt" | "outcome" | "resolvedAt" | "isSample">) => {
      if (readOnly) return;

      if (effectiveViewMode === "mine" && user && supabaseEnabled) {
        const supabase = getSupabaseClient();
        if (!supabase) return;
        void insertDecision(supabase, user.id, d)
          .then((saved) => {
            newIdsRef.current.add(saved.id);
            setUserLedger((prev) => [saved, ...prev]);
          })
          .catch((err) => console.error("commit decision", err));
        return;
      }

      const entry: Decision = {
        ...d,
        id: `u-${Date.now()}`,
        committedAt: new Date().toISOString(),
        outcome: null,
        resolvedAt: null,
        isSample: false,
      };
      newIdsRef.current.add(entry.id);
      setSessionLedger((prev) => [entry, ...prev]);
    },
    [readOnly, effectiveViewMode, user, supabaseEnabled],
  );

  const resolve = useCallback(
    (id: string, outcome: Outcome, note?: string) => {
      if (readOnly) return;

      if (effectiveViewMode === "mine" && user && supabaseEnabled) {
        const supabase = getSupabaseClient();
        if (!supabase) return;
        void updateDecisionResolution(supabase, user.id, id, outcome, note)
          .then((updated) => {
            setUserLedger((prev) => prev.map((row) => (row.id === id ? updated : row)));
          })
          .catch((err) => console.error("resolve decision", err));
        return;
      }

      setSessionLedger((prev) =>
        prev.map((row) =>
          row.id === id
            ? {
                ...row,
                outcome,
                resolvedAt: new Date().toISOString(),
                note: note ?? row.note,
              }
            : row,
        ),
      );
    },
    [readOnly, effectiveViewMode, user, supabaseEnabled],
  );

  const isNew = useCallback((id: string) => newIdsRef.current.has(id), []);

  const value = useMemo(
    () => ({
      ledger,
      commit,
      resolve,
      isNew,
      readOnly,
      viewMode: effectiveViewMode,
      setViewMode,
      user,
      authReady: authReady && !loadingLedger,
      supabaseEnabled,
    }),
    [
      ledger,
      commit,
      resolve,
      isNew,
      readOnly,
      effectiveViewMode,
      setViewMode,
      user,
      authReady,
      loadingLedger,
      supabaseEnabled,
    ],
  );

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>;
}

export function useLedger() {
  const ctx = useContext(LedgerContext);
  if (!ctx) throw new Error("useLedger must be used within LedgerProvider");
  return ctx;
}
