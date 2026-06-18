"use client";

import Link from "next/link";
import {
  HiArrowPath,
  HiArrowRight,
  HiArrowTrendingUp,
  HiBookOpen,
  HiBookmark,
  HiChatBubbleLeftRight,
  HiCheckCircle,
  HiClipboardDocumentList,
  HiLightBulb,
  HiPencilSquare,
  HiPresentationChartLine,
  HiSparkles,
} from "react-icons/hi2";
import { Logo } from "@/components/Logo";
import { IconSlot, iconMd, iconSm } from "@/components/IconSlot";
import { useLedger } from "@/components/LedgerStore";

const LOOP = [
  {
    n: "01",
    t: "Capture",
    d: "Paste the AI chat. Crux structures the decision.",
    icon: HiChatBubbleLeftRight,
  },
  {
    n: "02",
    t: "Commit",
    d: "Set your confidence. Permanent, timestamped record.",
    icon: HiBookmark,
  },
  {
    n: "03",
    t: "Resolve",
    d: "Close the loop: better, as expected, or worse.",
    icon: HiCheckCircle,
  },
  {
    n: "04",
    t: "Reflect",
    d: "Calibration, blind spots, override signal.",
    icon: HiPresentationChartLine,
  },
] as const;

export function HomeHero() {
  const { user, supabaseEnabled, viewMode } = useLedger();
  const loggedIn = supabaseEnabled && !!user && viewMode === "mine";

  return (
    <>
      <section className="pt-16 pb-20">
        <Logo href="/" size={32} wordmarkSize="lg" className="mb-10" />

        <p className="eyebrow text-teal mb-4 flex items-center gap-1.5">
          <IconSlot icon={HiSparkles} className="h-3.5 w-3.5" />
          A decision record for the AI era
        </p>
        <h1 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight text-ink max-w-3xl">
          AI made deciding cheap.
          <br />
          <span className="italic text-teal">Crux</span> makes it accountable.
        </h1>
        <p className="mt-6 text-lg text-ink-2 leading-relaxed max-w-2xl">
          {loggedIn
            ? "Your decisions are saved to your account. Capture, commit, resolve — then see your mirror."
            : "Capture what the AI recommended, what you chose, and how sure you were. Weeks later, close the loop — and see where your judgment beats the machine."}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {loggedIn ? (
            <>
              <Link href="/capture" className="btn-primary gap-2">
                <IconSlot icon={HiPencilSquare} className={iconSm} />
                Capture a decision
              </Link>
              <Link href="/ledger" className="btn-ghost gap-2">
                <IconSlot icon={HiClipboardDocumentList} className={iconSm} />
                Your ledger
              </Link>
            </>
          ) : (
            <>
              <Link href="/reflect" className="btn-primary gap-2">
                <IconSlot icon={HiPresentationChartLine} className={iconSm} />
                See the mirror
                <IconSlot icon={HiArrowRight} className={iconSm} />
              </Link>
              <Link href="/capture" className="btn-ghost gap-2">
                <IconSlot icon={HiPencilSquare} className={iconSm} />
                Capture a decision
              </Link>
            </>
          )}
        </div>
        {!loggedIn && (
          <p className="mt-5 text-xs text-ink-3 font-data flex items-center gap-1.5">
            <IconSlot icon={HiBookOpen} className="h-3.5 w-3.5" />
            Demo mode — sample ledger loaded for visitors. Sign in to save your own.
          </p>
        )}
      </section>

      {!loggedIn && (
        <section className="pb-20 grid md:grid-cols-2 gap-6">
          <div className="panel p-6 md:col-span-2 lg:col-span-1">
            <p className="eyebrow text-clay mb-3 flex items-center gap-1.5">
              <IconSlot icon={HiLightBulb} className="h-3.5 w-3.5" />
              The signal everyone throws away
            </p>
            <h2 className="font-display text-2xl text-ink leading-snug">
              Did you <span className="text-clay">override the AI</span> — and were you right?
            </h2>
            <p className="mt-4 text-sm text-ink-2 leading-relaxed">
              Crux separates calls where you followed the machine from calls where you backed
              yourself — and scores both against what actually happened.
            </p>
          </div>
          <blockquote className="panel p-6 border-clay/20">
            <p className="font-display text-lg text-ink leading-snug flex gap-2">
              <IconSlot icon={HiArrowTrendingUp} className={`${iconMd} text-good shrink-0 mt-0.5`} />
              <span>
                &ldquo;When you overrode the AI on{" "}
                <span className="text-good">strategy</span>, you were right 100% of the time. On{" "}
                <span className="text-bad">hiring</span>, just 25%. Your edge is the market — not
                people.&rdquo;
              </span>
            </p>
            <footer className="mt-4 eyebrow flex items-center gap-1.5">
              <IconSlot icon={HiClipboardDocumentList} className="h-3.5 w-3.5" />
              From the sample ledger
            </footer>
          </blockquote>
        </section>
      )}

      <section className="pb-24">
        <p className="eyebrow mb-6 flex items-center gap-1.5">
          <IconSlot icon={HiArrowPath} className="h-3.5 w-3.5" />
          The loop
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LOOP.map((s) => (
            <div key={s.n} className="panel p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-data text-xs text-teal">{s.n}</span>
                <span className="w-8 h-8 rounded-lg bg-teal/10 text-teal flex items-center justify-center">
                  <IconSlot icon={s.icon} className={iconSm} />
                </span>
              </div>
              <h3 className="font-display text-xl text-ink mb-2">{s.t}</h3>
              <p className="text-sm text-ink-2">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
