"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { SAMPLE_LEDGER } from "@/lib/seed";
import { Decision, Outcome } from "@/lib/types";

interface LedgerContextValue {
  ledger: Decision[];
  commit: (d: Omit<Decision, "id" | "committedAt" | "outcome" | "resolvedAt" | "isSample">) => void;
  resolve: (id: string, outcome: Outcome, note?: string) => void;
}

const LedgerContext = createContext<LedgerContextValue | null>(null);

export function LedgerProvider({ children }: { children: React.ReactNode }) {
  const [ledger, setLedger] = useState<Decision[]>(() => [...SAMPLE_LEDGER]);

  const commit = useCallback(
    (d: Omit<Decision, "id" | "committedAt" | "outcome" | "resolvedAt" | "isSample">) => {
      const entry: Decision = {
        ...d,
        id: `u-${Date.now()}`,
        committedAt: new Date().toISOString(),
        outcome: null,
        resolvedAt: null,
        isSample: false,
      };
      setLedger((prev) => [entry, ...prev]);
    },
    [],
  );

  const resolve = useCallback((id: string, outcome: Outcome, note?: string) => {
    setLedger((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, outcome, resolvedAt: new Date().toISOString(), note: note ?? d.note }
          : d,
      ),
    );
  }, []);

  const value = useMemo(() => ({ ledger, commit, resolve }), [ledger, commit, resolve]);

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>;
}

export function useLedger() {
  const ctx = useContext(LedgerContext);
  if (!ctx) throw new Error("useLedger must be used within LedgerProvider");
  return ctx;
}
