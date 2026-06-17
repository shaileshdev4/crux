"use client";

import { useEffect, useState } from "react";
import { Decision } from "@/lib/types";
import { aiAgreement, byCategory, calibrationCurve } from "@/lib/analysis";

interface Insight {
  headline: string;
  detail: string;
  tone: "edge" | "blindspot" | "pattern";
}

export function InsightCards({ ledger }: { ledger: Decision[] }) {
  const [insights, setInsights] = useState<Insight[]>(() =>
    computeInsights(ledger),
  );
  const [narrated, setNarrated] = useState(false);

  useEffect(() => {
    const base = computeInsights(ledger);
    setInsights(base);
    setNarrated(false);

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/narrate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ insights: base }),
        });
        if (!res.ok) return;
        const data = await res.json();
        if (
          !cancelled &&
          Array.isArray(data.insights) &&
          data.insights.length
        ) {
          setInsights(data.insights);
          setNarrated(true);
        }
      } catch {
        /* keep computed fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ledger]);

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {insights.map((ins, i) => (
        <article
          key={i}
          className="panel p-5 flex flex-col gap-3 hover:border-teal/30 transition-colors"
        >
          <ToneMark tone={ins.tone} />
          <h3 className="font-display text-lg leading-snug text-ink">
            {ins.headline}
          </h3>
          <p className="text-sm text-ink-2 leading-relaxed">{ins.detail}</p>
        </article>
      ))}
      <p className="col-span-full eyebrow text-center pt-2">
        {narrated
          ? "Narrated by Llama · grounded in your committed ledger"
          : "Computed from your committed ledger"}
      </p>
    </div>
  );
}

function ToneMark({ tone }: { tone: Insight["tone"] }) {
  const map = {
    edge: { label: "Your edge", c: "text-good" },
    blindspot: { label: "Blind spot", c: "text-clay" },
    pattern: { label: "Pattern", c: "text-teal" },
  };
  const { label, c } = map[tone];
  return <span className={`eyebrow ${c}`}>{label}</span>;
}

function computeInsights(ledger: Decision[]): Insight[] {
  const cats = byCategory(ledger);
  const ag = aiAgreement(ledger);
  const curve = calibrationCurve(ledger);
  const out: Insight[] = [];

  const overconf = [...cats]
    .filter((c) => c.confidenceGap !== null && c.count >= 2)
    .sort((a, b) => b.confidenceGap! - a.confidenceGap!)[0];
  if (overconf && overconf.confidenceGap! > 0.1) {
    out.push({
      tone: "blindspot",
      headline: `You're overconfident on ${overconf.category}.`,
      detail: `Across ${overconf.count} ${overconf.category} calls you averaged ${overconf.avgConfidence}% confidence, but only ${Math.round(
        (overconf.goodCallRate ?? 0) * 100,
      )}% turned out well - a ${Math.round(overconf.confidenceGap! * 100)}-point gap.`,
    });
  }

  const edge = [...cats]
    .filter((c) => c.goodCallRate !== null && c.count >= 2)
    .sort((a, b) => b.goodCallRate! - a.goodCallRate!)[0];
  if (edge) {
    out.push({
      tone: "edge",
      headline: `${cap(edge.category)} is where you're strong.`,
      detail: `${Math.round((edge.goodCallRate ?? 0) * 100)}% of your ${edge.category} decisions went well at ${edge.avgConfidence}% average confidence.`,
    });
  }

  if (ag.overrode.goodCallRate !== null && ag.followed.goodCallRate !== null) {
    const o = Math.round(ag.overrode.goodCallRate * 100);
    const f = Math.round(ag.followed.goodCallRate * 100);
    out.push({
      tone: "pattern",
      headline:
        Math.abs(o - f) <= 8
          ? "Overriding and following break even on average."
          : o > f
            ? "Your overrides beat your follows."
            : "You do better when you follow the AI.",
      detail: `Followed: ${f}% good calls (${ag.followed.count}). Overrode: ${o}% (${ag.overrode.count}). The domain breakdown matters more than the headline.`,
    });
  }

  if (out.length < 3) {
    const top = curve.find((b) => b.actualRate < b.statedRate - 0.1);
    if (top) {
      out.push({
        tone: "pattern",
        headline: `Your ${top.label} calls are your shakiest.`,
        detail: `When you said you were ${top.label} sure, things went well only ${Math.round(top.actualRate * 100)}% of the time.`,
      });
    }
  }

  return out.slice(0, 3);
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
