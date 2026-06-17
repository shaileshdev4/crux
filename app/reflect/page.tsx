"use client";

import { useLedger } from "@/components/LedgerStore";
import { AgreementView } from "@/components/AgreementView";
import { CalibrationChart } from "@/components/CalibrationChart";
import { InsightCards } from "@/components/InsightCards";
import { brierScore } from "@/lib/analysis";

export default function ReflectPage() {
  const { ledger } = useLedger();
  const brier = brierScore(ledger);
  const resolved = ledger.filter((d) => d.outcome !== null).length;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="eyebrow text-teal mb-2">Reflect</p>
      <h1 className="font-display text-3xl md:text-4xl text-ink mb-2">
        The mirror
      </h1>
      <p className="text-ink-2 text-sm max-w-xl mb-2">
        Every number is computed from your committed ledger. The AI only
        narrates - it never invents a verdict.
      </p>
      <p className="text-xs text-ink-3 font-data mb-10">
        {resolved} resolved · Brier {brier !== null ? brier.toFixed(2) : "-"}{" "}
        (lower is better)
      </p>

      <div className="space-y-8">
        <AgreementView ledger={ledger} />
        <CalibrationChart ledger={ledger} />
        <div>
          <h2 className="font-display text-xl text-ink mb-4">
            Grounded insights
          </h2>
          <InsightCards ledger={ledger} />
        </div>
      </div>
    </div>
  );
}
