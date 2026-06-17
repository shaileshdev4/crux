"use client";

import { useState } from "react";
import { useLedger } from "@/components/LedgerStore";
import { OutcomePill, ProvDot, StanceBadge } from "@/components/primitives";
import { Decision, Outcome } from "@/lib/types";

export default function LedgerPage() {
  const { ledger, resolve } = useLedger();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="eyebrow text-teal mb-2">Ledger</p>
      <h1 className="font-display text-3xl text-ink mb-2">Committed decisions</h1>
      <p className="text-sm text-ink-2 mb-8">
        Append-only record. Sample entries are labeled — yours join for this session.
      </p>

      <ul className="space-y-3">
        {ledger.map((d) => (
          <LedgerEntry
            key={d.id}
            decision={d}
            open={openId === d.id}
            onToggle={() => setOpenId(openId === d.id ? null : d.id)}
            onResolve={(outcome) => resolve(d.id, outcome)}
          />
        ))}
      </ul>
    </div>
  );
}

function LedgerEntry({
  decision: d,
  open,
  onToggle,
  onResolve,
}: {
  decision: Decision;
  open: boolean;
  onToggle: () => void;
  onResolve: (o: Outcome) => void;
}) {
  const date = new Date(d.committedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <li className="panel overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-5 flex flex-wrap items-start justify-between gap-3 hover:bg-surface-2/50 transition-colors"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <StanceBadge stance={d.aiStance} />
            {d.isSample && <span className="eyebrow">sample</span>}
            {d.outcome && <OutcomePill outcome={d.outcome} />}
          </div>
          <p className="text-ink font-medium leading-snug">{d.question}</p>
          <p className="text-xs text-ink-3 mt-1 font-data">
            {date} · {d.confidence}% confident · {d.category}
          </p>
        </div>
        <span className="text-ink-3 text-sm">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">
          <ul className="space-y-1.5">
            {d.options.map((o, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-ink-2">
                <ProvDot source={o.provenance === "ai" ? "ai" : "human"} />
                {o.label}
              </li>
            ))}
          </ul>
          {d.reasons.length > 0 && (
            <p className="text-sm text-ink-2">{d.reasons.join(" · ")}</p>
          )}
          {d.note && <p className="text-sm text-ink-3 italic">{d.note}</p>}

          {!d.outcome && (
            <div>
              <p className="eyebrow mb-2">Close the loop</p>
              <div className="flex flex-wrap gap-2">
                {(["better", "expected", "worse"] as const).map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => {
                      if (typeof pendo !== "undefined") {
                        pendo.track("decision_resolved", {
                          outcome: o,
                          ai_stance: d.aiStance,
                          category: d.category,
                          confidence: d.confidence,
                          is_sample: !!d.isSample,
                          days_since_committed: Math.floor(
                            (Date.now() - new Date(d.committedAt).getTime()) /
                              86_400_000,
                          ),
                        });
                      }
                      onResolve(o);
                    }}
                    className="btn-ghost text-xs capitalize"
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </li>
  );
}
