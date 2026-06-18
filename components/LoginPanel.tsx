"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import {
  HiArrowLeft,
  HiArrowRightOnRectangle,
  HiEnvelope,
  HiKey,
  HiLockClosed,
  HiSparkles,
} from "react-icons/hi2";
import { Logo } from "@/components/Logo";
import { IconSlot, iconMd, iconSm } from "@/components/IconSlot";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  signInWithGoogle,
  signInWithMagicLink,
  signInWithPassword,
  signUpWithPassword,
} from "@/lib/auth";

type Tab = "magic" | "password";

export function LoginPanel() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const [tab, setTab] = useState<Tab>("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const configured = isSupabaseConfigured();

  async function handleMagic() {
    if (!email.trim()) return;
    setBusy(true);
    setError(null);
    const { error: err } = await signInWithMagicLink(email.trim(), next);
    setBusy(false);
    if (err) setError(err.message);
    else setMessage("Check your inbox for the sign-in link.");
  }

  async function handlePassword() {
    if (!email.trim() || !password) return;
    setBusy(true);
    setError(null);
    const { error: err } = isSignUp
      ? await signUpWithPassword(email.trim(), password)
      : await signInWithPassword(email.trim(), password);
    setBusy(false);
    if (err) setError(err.message);
    else if (isSignUp) setMessage("Account created. Check email if confirmation is required.");
    else window.location.href = next;
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="mb-8">
        <Logo href="/" size={28} wordmarkSize="lg" />
      </div>

      <h1 className="font-display text-3xl text-ink mb-2 flex items-center gap-2">
        <IconSlot icon={HiArrowRightOnRectangle} className={iconMd} />
        Sign in
      </h1>
      <p className="text-sm text-ink-2 mb-8">
        Save your decision ledger across devices. Judges can skip this and use the sample demo.
      </p>

      {!configured ? (
        <div className="panel p-5 text-sm text-ink-2">
          Auth is not configured. The app runs in anonymous sample mode.
          <Link href="/" className="mt-3 text-teal hover:underline inline-flex items-center gap-1.5">
            <IconSlot icon={HiArrowLeft} className={iconSm} />
            Back home
          </Link>
        </div>
      ) : (
        <div className="panel p-6 space-y-5">
          <button
            type="button"
            onClick={() => signInWithGoogle(next)}
            className="btn-ghost w-full gap-2"
            disabled={busy}
          >
            <FcGoogle className="h-5 w-5 shrink-0" aria-hidden />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 text-xs text-ink-3">
            <div className="h-px flex-1 bg-border" />
            or
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="flex gap-2">
            {(["magic", "password"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-xs rounded-lg border inline-flex items-center justify-center gap-1.5 ${
                  tab === t
                    ? "border-teal text-teal bg-teal/10"
                    : "border-border text-ink-2"
                }`}
              >
                <IconSlot icon={t === "magic" ? HiEnvelope : HiKey} className="h-3.5 w-3.5" />
                {t === "magic" ? "Magic link" : "Email + password"}
              </button>
            ))}
          </div>

          <div className="relative">
            <IconSlot
              icon={HiEnvelope}
              className={`${iconSm} absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none`}
            />
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="pl-9"
            />
          </div>

          {tab === "password" && (
            <>
              <div className="relative">
                <IconSlot
                  icon={HiLockClosed}
                  className={`${iconSm} absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none`}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  className="pl-9"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsSignUp((v) => !v)}
                className="text-xs text-ink-3 hover:text-ink"
              >
                {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
              </button>
            </>
          )}

          {message && (
            <p className="text-sm text-teal flex items-center gap-1.5">
              <IconSlot icon={HiEnvelope} className={iconSm} />
              {message}
            </p>
          )}
          {error && <p className="text-sm text-bad">{error}</p>}

          <button
            type="button"
            onClick={tab === "magic" ? handleMagic : handlePassword}
            className="btn-primary w-full gap-2"
            disabled={busy}
          >
            <IconSlot icon={tab === "magic" ? HiEnvelope : HiLockClosed} className={iconSm} />
            {busy
              ? "Working…"
              : tab === "magic"
                ? "Send magic link"
                : isSignUp
                  ? "Create account"
                  : "Sign in"}
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-1.5 w-full text-center text-xs text-ink-3 hover:text-ink"
          >
            <IconSlot icon={HiSparkles} className="h-3.5 w-3.5" />
            Continue without signing in (sample demo)
          </Link>
        </div>
      )}
    </div>
  );
}
