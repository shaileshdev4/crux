"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";

const ROUTES = [
  { href: "/reflect", label: "Reflect" },
  { href: "/ledger", label: "Ledger" },
  { href: "/capture", label: "Capture" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Logo href="/" />

        <nav className="flex items-center gap-1">
          {ROUTES.map((r) => {
            const active = pathname === r.href;
            return (
              <Link
                key={r.href}
                href={r.href}
                className={`px-3.5 py-2 text-sm rounded-lg transition-colors ${
                  active ? "text-ink bg-surface-2" : "text-ink-2 hover:text-ink hover:bg-surface"
                }`}
              >
                {r.label}
              </Link>
            );
          })}
          <Link href="/capture" className="ml-2 btn-primary">
            New entry
          </Link>
        </nav>
      </div>
    </header>
  );
}
