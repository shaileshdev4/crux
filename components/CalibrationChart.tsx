"use client";

import { Decision } from "@/lib/types";
import { calibrationCurve } from "@/lib/analysis";

export function CalibrationChart({ ledger }: { ledger: Decision[] }) {
  const buckets = calibrationCurve(ledger).filter((b) => b.count > 0);

  return (
    <div className="panel p-6">
      <h3 className="font-display text-xl text-ink mb-2">Calibration</h3>
      <p className="text-sm text-ink-2 mb-6">
        Stated confidence vs. how things actually went.
      </p>
      {buckets.length === 0 ? (
        <p className="text-sm text-ink-3">Resolve decisions to plot your curve.</p>
      ) : (
        <div className="space-y-4">
          {buckets.map((b) => (
            <div key={b.label} className="grid grid-cols-[4.5rem_1fr] gap-4 items-center">
              <span className="text-xs text-ink-3 font-data">{b.label}</span>
              <div className="relative h-8 rounded-md bg-surface-2 overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-teal/25 border-r border-teal/50"
                  style={{ width: `${b.statedRate * 100}%` }}
                  title="Stated confidence"
                />
                <div
                  className="absolute inset-y-1 left-0 bg-teal rounded-sm"
                  style={{ width: `${b.actualRate * 100}%` }}
                  title="Actual success rate"
                />
              </div>
              <span className="col-span-2 text-xs text-ink-3 -mt-2">
                n={b.count} · actual {Math.round(b.actualRate * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
