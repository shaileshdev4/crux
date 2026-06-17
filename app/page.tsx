import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <section className="pt-16 pb-20">
        <Logo href="/" size={32} wordmarkSize="lg" className="mb-10" />

        <p className="eyebrow text-teal mb-4">
          A decision record for the AI era
        </p>
        <h1 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight text-ink max-w-3xl">
          AI made deciding cheap.
          <br />
          <span className="italic text-teal">Crux</span> makes it accountable.
        </h1>
        <p className="mt-6 text-lg text-ink-2 leading-relaxed max-w-2xl">
          Capture what the AI recommended, what you chose, and how sure you
          were. Weeks later, close the loop - and see where your judgment beats
          the machine.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/reflect" className="btn-primary">
            See the mirror →
          </Link>
          <Link href="/capture" className="btn-ghost">
            Capture a decision
          </Link>
        </div>
        <p className="mt-5 text-xs text-ink-3 font-data">
          Sample ledger loaded - four months of a founding PM&apos;s decisions.
        </p>
      </section>

      <section className="pb-20 grid md:grid-cols-2 gap-6">
        <div className="panel p-6 md:col-span-2 lg:col-span-1">
          <p className="eyebrow text-clay mb-3">
            The signal everyone throws away
          </p>
          <h2 className="font-display text-2xl text-ink leading-snug">
            Did you <span className="text-clay">override the AI</span> - and
            were you right?
          </h2>
          <p className="mt-4 text-sm text-ink-2 leading-relaxed">
            Crux separates calls where you followed the machine from calls where
            you backed yourself - and scores both against what actually
            happened.
          </p>
        </div>
        <blockquote className="panel p-6 border-clay/20">
          <p className="font-display text-lg text-ink leading-snug">
            &ldquo;When you overrode the AI on{" "}
            <span className="text-good">strategy</span>, you were right 100% of
            the time. On <span className="text-bad">hiring</span>, just 25%.
            Your edge is the market - not people.&rdquo;
          </p>
          <footer className="mt-4 eyebrow">From the sample ledger</footer>
        </blockquote>
      </section>

      <section className="pb-24">
        <p className="eyebrow mb-6">The loop</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              n: "01",
              t: "Capture",
              d: "Paste the AI chat. Crux structures the decision.",
            },
            {
              n: "02",
              t: "Commit",
              d: "Set your confidence. Permanent, timestamped record.",
            },
            {
              n: "03",
              t: "Resolve",
              d: "Close the loop: better, as expected, or worse.",
            },
            {
              n: "04",
              t: "Reflect",
              d: "Calibration, blind spots, override signal.",
            },
          ].map((s) => (
            <div key={s.n} className="panel p-5">
              <span className="font-data text-xs text-teal">{s.n}</span>
              <h3 className="font-display text-xl text-ink mt-2 mb-2">{s.t}</h3>
              <p className="text-sm text-ink-2">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
