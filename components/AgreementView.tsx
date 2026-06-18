"use client";

import { Decision } from "@/lib/types";
import { aiAgreement, overridesByCategory } from "@/lib/analysis";
import {
  HiArrowPath,
  HiCheck,
  HiSquares2X2,
} from "react-icons/hi2";
import { IconSlot, iconSm } from "@/components/IconSlot";

export function AgreementView({ ledger }: { ledger: Decision[] }) {
  const ag = aiAgreement(ledger);
  const cats = overridesByCategory(ledger).sort(
    (a, b) => (b.goodCallRate ?? 0) - (a.goodCallRate ?? 0),
  );

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="panel p-6">
        <h3 className="font-display text-xl text-ink mb-6 flex items-center gap-2">
          <IconSlot icon={HiCheck} className="h-5 w-5 text-teal" />
          AI agreement
        </h3>
        <div className="space-y-5">
          <Bar
            label="Followed AI"
            rate={ag.followed.goodCallRate}
            count={ag.followed.count}
            color="bg-teal"
          />
          <Bar
            label="Overrode AI"
            rate={ag.overrode.goodCallRate}
            count={ag.overrode.count}
            color="bg-clay"
          />
        </div>
      </div>

      <div className="panel p-6">
        <h3 className="font-display text-xl text-ink mb-2 flex items-center gap-2">
          <IconSlot icon={HiSquares2X2} className="h-5 w-5 text-teal" />
          Overrides by domain
        </h3>
        <p className="text-sm text-ink-2 mb-5 flex items-start gap-1.5">
          <IconSlot icon={HiArrowPath} className={`${iconSm} shrink-0 mt-0.5 text-clay`} />
          Where your judgment actually adds value — overrides only.
        </p>
        <div className="space-y-4">
          {cats.length === 0 ? (
            <p className="text-sm text-ink-3">
              Resolve more decisions to see the split.
            </p>
          ) : (
            cats.map((c) => (
              <Bar
                key={c.category}
                label={c.category}
                rate={c.goodCallRate}
                count={c.count}
                color="bg-teal"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Bar({
  label,
  rate,
  count,
  color,
}: {
  label: string;
  rate: number | null;
  count: number;
  color: string;
}) {
  const pct = rate !== null ? Math.round(rate * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-ink capitalize">{label}</span>
        <span className="text-ink-2 tabular-nums font-data">
          {rate !== null ? `${pct}%` : "-"} · n={count}
        </span>
      </div>
      <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
