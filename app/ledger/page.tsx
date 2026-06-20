"use client";

import Link from "next/link";
import { useState } from "react";
import {
  HiCalendar,
  HiChevronDown,
  HiChevronUp,
  HiClipboardDocumentList,
  HiPencilSquare,
  HiTag,
} from "react-icons/hi2";
import { useLedger } from "@/components/LedgerStore";
import { EmptyState, PageHeader } from "@/components/PageHeader";
import { IconSlot, iconSm } from "@/components/IconSlot";
import { OutcomePill, ProvDot, StanceBadge } from "@/components/primitives";
import { Decision, Outcome } from "@/lib/types";
import { trackPendo } from "@/lib/pendo";
import { HiCheck, HiMinus, HiXMark } from "react-icons/hi2";

export default function LedgerPage() {
  const { ledger, resolve, readOnly, viewMode, authReady } = useLedger();
  const [openId, setOpenId] = useState<string | null>(null);

  const subtitle =
    viewMode === "mine"
      ? "Your decisions — saved to your account."
      : viewMode === "sample"
        ? "Demo ledger — read-only preview."
        : "Demo ledger for this session. Sign in to persist yours.";

  if (!authReady && viewMode === "mine") {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-sm text-ink-3 flex items-center gap-2">
          <span className="w-4 h-4 rounded-full border-2 border-teal border-t-transparent animate-spin" />
          Loading your ledger…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <PageHeader
        icon={HiClipboardDocumentList}
        eyebrow="Ledger"
        title="Committed decisions"
        description={subtitle}
      />

      {ledger.length === 0 && viewMode === "mine" ? (
        <EmptyState
          icon={HiClipboardDocumentList}
          title="No decisions yet"
          description="Capture your first decision to start building your calibration mirror."
          action={
            <Link id="btn-capture-decision" href="/capture" className="btn-primary gap-2">
              <IconSlot icon={HiPencilSquare} className={iconSm} />
              Capture a decision
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {ledger.map((d) => (
            <LedgerEntry
              key={d.id}
              decision={d}
              open={openId === d.id}
              readOnly={readOnly}
              showSampleBadge={viewMode !== "mine"}
              onToggle={() => setOpenId(openId === d.id ? null : d.id)}
              onResolve={(outcome) => {
                resolve(d.id, outcome);
                trackPendo("decision_resolved", {
                  outcome,
                  category: d.category,
                  ai_stance: d.aiStance,
                  confidence: d.confidence,
                  is_sample: d.isSample ?? false,
                  days_since_committed: Math.floor(
                    (Date.now() - new Date(d.committedAt).getTime()) / 86_400_000,
                  ),
                });
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function LedgerEntry({
  decision: d,
  open,
  readOnly,
  showSampleBadge,
  onToggle,
  onResolve,
}: {
  decision: Decision;
  open: boolean;
  readOnly: boolean;
  showSampleBadge: boolean;
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
            {showSampleBadge && d.isSample && (
              <span className="eyebrow inline-flex items-center gap-1">
                <IconSlot icon={HiTag} className="h-3 w-3" />
                sample
              </span>
            )}
            {d.outcome && <OutcomePill outcome={d.outcome} />}
          </div>
          <p className="text-ink font-medium leading-snug">{d.question}</p>
          <p className="text-xs text-ink-3 mt-1 font-data flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="inline-flex items-center gap-1">
              <IconSlot icon={HiCalendar} className="h-3 w-3" />
              {date}
            </span>
            <span>· {d.confidence}% confident · {d.category}</span>
          </p>
        </div>
        <IconSlot
          icon={open ? HiChevronUp : HiChevronDown}
          className={`${iconSm} text-ink-3`}
        />
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

          {!d.outcome && !readOnly && (
            <div>
              <p className="eyebrow mb-2">Close the loop</p>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { o: "better" as const, icon: HiCheck },
                    { o: "expected" as const, icon: HiMinus },
                    { o: "worse" as const, icon: HiXMark },
                  ] as const
                ).map(({ o, icon }) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => onResolve(o)}
                    className="btn-ghost text-xs capitalize gap-1.5"
                  >
                    <IconSlot icon={icon} className="h-3.5 w-3.5" />
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
