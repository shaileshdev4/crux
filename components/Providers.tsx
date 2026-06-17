"use client";

import { LedgerProvider } from "@/components/LedgerStore";

export function Providers({ children }: { children: React.ReactNode }) {
  return <LedgerProvider>{children}</LedgerProvider>;
}
