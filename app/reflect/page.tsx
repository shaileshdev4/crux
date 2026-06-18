"use client";

import Link from "next/link";
import {
  HiChartBar,
  HiLightBulb,
  HiPencilSquare,
  HiPresentationChartLine,
} from "react-icons/hi2";
import { useLedger } from "@/components/LedgerStore";
import { AgreementView } from "@/components/AgreementView";
import { CalibrationChart } from "@/components/CalibrationChart";
import { InsightCards } from "@/components/InsightCards";
import { EmptyState, PageHeader } from "@/components/PageHeader";
import { IconSlot, iconSm } from "@/components/IconSlot";
import { brierScore } from "@/lib/analysis";

export default function ReflectPage() {
  const { ledger, viewMode, authReady } = useLedger();
  const brier = brierScore(ledger);
  const resolved = ledger.filter((d) => d.outcome !== null).length;
  const emptyPersonal = viewMode === "mine" && ledger.length === 0;

  if (!authReady && viewMode === "mine") {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-sm text-ink-3 flex items-center gap-2">
          <span className="w-4 h-4 rounded-full border-2 border-teal border-t-transparent animate-spin" />
          Loading…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <PageHeader
        icon={HiPresentationChartLine}
        eyebrow="Reflect"
        title="The mirror"
        description={
          viewMode === "mine"
            ? "Computed from your committed decisions. The AI only narrates — it never invents a verdict."
            : "Every number is computed from the ledger below. The AI only narrates — it never invents a verdict."
        }
      />
      {!emptyPersonal && (
        <p className="text-xs text-ink-3 font-data mb-10 flex items-center gap-1.5 -mt-4">
          <IconSlot icon={HiChartBar} className="h-3.5 w-3.5" />
          {resolved} resolved · Brier {brier !== null ? brier.toFixed(2) : "—"} (lower is
          better)
        </p>
      )}

      {emptyPersonal ? (
        <EmptyState
          icon={HiPresentationChartLine}
          title="Your mirror is waiting"
          description="Commit a few decisions and close the loop on outcomes. Calibration and override insights appear here once you have resolved entries."
          action={
            <Link href="/capture" className="btn-primary gap-2">
              <IconSlot icon={HiPencilSquare} className={iconSm} />
              Capture your first decision
            </Link>
          }
        />
      ) : (
        <div className="space-y-8">
          <AgreementView ledger={ledger} />
          <CalibrationChart ledger={ledger} />
          <div>
            <h2 className="font-display text-xl text-ink mb-4 flex items-center gap-2">
              <IconSlot icon={HiLightBulb} className="h-5 w-5 text-teal" />
              Grounded insights
            </h2>
            <InsightCards ledger={ledger} />
          </div>
        </div>
      )}
    </div>
  );
}
