"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  HiArrowLeftOnRectangle,
  HiBookOpen,
  HiChartBarSquare,
  HiChevronDown,
  HiClipboardDocumentList,
  HiPencilSquare,
  HiPlus,
  HiPresentationChartLine,
  HiUserCircle,
} from "react-icons/hi2";
import { Logo } from "@/components/Logo";
import { IconSlot, iconSm } from "@/components/IconSlot";
import { useLedger } from "@/components/LedgerStore";
import { signOut } from "@/lib/auth";

const ROUTES = [
  { href: "/reflect", label: "Reflect", icon: HiPresentationChartLine },
  { href: "/ledger", label: "Ledger", icon: HiClipboardDocumentList },
  { href: "/capture", label: "Capture", icon: HiPencilSquare },
] as const;

function UserMenu({
  email,
  viewMode,
  onDemo,
  onMine,
  onSignOut,
}: {
  email: string;
  viewMode: string;
  onDemo: () => void;
  onMine: () => void;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const short = email.includes("@") ? email.split("@")[0] : email;

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border bg-surface text-sm text-ink-2 hover:text-ink hover:border-ink-3 transition-colors max-w-[9rem]"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="w-6 h-6 rounded-full bg-teal/20 text-teal text-xs font-medium flex items-center justify-center shrink-0">
          {short.charAt(0).toUpperCase()}
        </span>
        <span className="truncate hidden sm:inline">{short}</span>
        <IconSlot icon={HiChevronDown} className={`${iconSm} text-ink-3 hidden sm:block`} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1.5 w-52 panel py-1 shadow-lg z-50"
        >
          <p className="px-3 py-2 text-xs text-ink-3 truncate border-b border-border mb-1 flex items-center gap-2">
            <IconSlot icon={HiUserCircle} className={iconSm} />
            {email}
          </p>
          {viewMode === "sample" ? (
            <button
              type="button"
              role="menuitem"
              className="w-full text-left px-3 py-2 text-sm text-ink hover:bg-surface-2 flex items-center gap-2"
              onClick={() => {
                onMine();
                setOpen(false);
              }}
            >
              <IconSlot icon={HiClipboardDocumentList} className={iconSm} />
              My ledger
            </button>
          ) : (
            <button
              type="button"
              role="menuitem"
              className="w-full text-left px-3 py-2 text-sm text-ink-2 hover:bg-surface-2 hover:text-ink flex items-center gap-2"
              onClick={() => {
                onDemo();
                setOpen(false);
              }}
            >
              <IconSlot icon={HiBookOpen} className={iconSm} />
              View demo ledger
            </button>
          )}
          <button
            type="button"
            role="menuitem"
            className="w-full text-left px-3 py-2 text-sm text-ink-2 hover:bg-surface-2 hover:text-bad flex items-center gap-2"
            onClick={() => {
              onSignOut();
              setOpen(false);
            }}
          >
            <IconSlot icon={HiArrowLeftOnRectangle} className={iconSm} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export function Nav() {
  const pathname = usePathname();
  const { user, supabaseEnabled, viewMode, setViewMode, authReady } = useLedger();

  async function handleSignOut() {
    await signOut();
    window.location.href = "/";
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-14 items-center gap-4 sm:gap-8">
            <Logo href="/" />

            <nav
              className="hidden md:flex items-center gap-0.5 flex-1"
              aria-label="Main"
            >
              {ROUTES.map((r) => {
                const active = pathname === r.href;
                return (
                  <Link
                    key={r.href}
                    href={r.href}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors inline-flex items-center gap-2 ${
                      active
                        ? "text-ink bg-surface-2 font-medium"
                        : "text-ink-2 hover:text-ink hover:bg-surface"
                    }`}
                  >
                    <IconSlot icon={r.icon} className={iconSm} />
                    {r.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 ml-auto shrink-0">
              <Link id="nav-new-entry" href="/capture" className="btn-primary text-sm py-2 px-3.5 hidden sm:inline-flex gap-2">
                <IconSlot icon={HiPlus} className={iconSm} />
                New entry
              </Link>
              <Link
                id="nav-new-entry-mobile"
                href="/capture"
                className="btn-primary text-sm py-2 px-3 md:hidden"
                aria-label="New entry"
              >
                <IconSlot icon={HiPlus} className={iconSm} />
              </Link>

              {!authReady && supabaseEnabled ? (
                <span className="text-xs text-ink-3 px-2">…</span>
              ) : supabaseEnabled ? (
                user ? (
                  <UserMenu
                    email={user.email ?? "Signed in"}
                    viewMode={viewMode}
                    onDemo={() => setViewMode("sample")}
                    onMine={() => setViewMode("mine")}
                    onSignOut={handleSignOut}
                  />
                ) : (
                  <Link
                    href="/login"
                    className="px-3 py-2 text-sm text-ink-2 hover:text-ink border border-border rounded-lg hover:bg-surface transition-colors inline-flex items-center gap-2"
                  >
                    <IconSlot icon={HiUserCircle} className={iconSm} />
                    Sign in
                  </Link>
                )
              ) : null}
            </div>
          </div>

          <nav
            className="md:hidden flex items-center gap-1 pb-2 -mt-0.5 overflow-x-auto"
            aria-label="Main mobile"
          >
            {ROUTES.map((r) => {
              const active = pathname === r.href;
              return (
                <Link
                  key={r.href}
                  href={r.href}
                  className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap inline-flex items-center gap-1.5 ${
                    active ? "text-ink bg-surface-2" : "text-ink-2"
                  }`}
                >
                  <IconSlot icon={r.icon} className="h-3.5 w-3.5" />
                  {r.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {user && viewMode === "sample" && (
        <div className="bg-clay/10 border-b border-clay/25 text-center py-2 px-4">
          <p className="text-xs text-clay flex items-center justify-center gap-1.5 flex-wrap">
            <IconSlot icon={HiBookOpen} className="h-3.5 w-3.5" />
            Demo ledger — read-only.{" "}
            <button
              type="button"
              onClick={() => setViewMode("mine")}
              className="underline hover:text-ink inline-flex items-center gap-1"
            >
              <IconSlot icon={HiChartBarSquare} className="h-3.5 w-3.5" />
              Back to my ledger
            </button>
          </p>
        </div>
      )}
    </>
  );
}
