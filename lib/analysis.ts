import { AiStance, Decision, isGoodOutcome } from "@/lib/types";

export interface CalibrationBucket {
  label: string;
  statedRate: number;
  actualRate: number;
  count: number;
}

export interface CategoryStats {
  category: string;
  count: number;
  avgConfidence: number;
  goodCallRate: number | null;
  confidenceGap: number | null;
}

export interface StanceStats {
  count: number;
  goodCallRate: number | null;
}

export interface AiAgreement {
  followed: StanceStats;
  overrode: StanceStats;
}

function resolved(decisions: Decision[]) {
  return decisions.filter((d) => d.outcome !== null);
}

function goodRate(items: Decision[]): number | null {
  if (!items.length) return null;
  const scored = items.map((d) => isGoodOutcome(d.outcome));
  if (scored.some((s) => s === null)) return null;
  return scored.filter(Boolean).length / items.length;
}

export function calibrationCurve(ledger: Decision[]): CalibrationBucket[] {
  const buckets: { min: number; max: number; label: string }[] = [
    { min: 50, max: 60, label: "50–60%" },
    { min: 60, max: 70, label: "60–70%" },
    { min: 70, max: 80, label: "70–80%" },
    { min: 80, max: 96, label: "80%+" },
  ];

  return buckets.map(({ min, max, label }) => {
    const inBucket = resolved(ledger).filter(
      (d) => d.confidence >= min && d.confidence < max,
    );
    const rate = goodRate(inBucket);
    const stated = (min + max) / 2 / 100;
    return {
      label,
      statedRate: stated,
      actualRate: rate ?? 0,
      count: inBucket.length,
    };
  });
}

export function brierScore(ledger: Decision[]): number | null {
  const items = resolved(ledger);
  if (!items.length) return null;
  let sum = 0;
  for (const d of items) {
    const p = d.confidence / 100;
    const y = isGoodOutcome(d.outcome) ? 1 : 0;
    sum += (p - y) ** 2;
  }
  return sum / items.length;
}

export function aiAgreement(ledger: Decision[]): AiAgreement {
  const items = resolved(ledger);
  const followed = items.filter((d) => d.aiStance === "followed");
  const overrode = items.filter((d) => d.aiStance === "overrode");
  return {
    followed: { count: followed.length, goodCallRate: goodRate(followed) },
    overrode: { count: overrode.length, goodCallRate: goodRate(overrode) },
  };
}

export function byCategory(ledger: Decision[]): CategoryStats[] {
  const cats = new Map<string, Decision[]>();
  for (const d of resolved(ledger)) {
    const list = cats.get(d.category) ?? [];
    list.push(d);
    cats.set(d.category, list);
  }
  return [...cats.entries()].map(([category, items]) => {
    const avgConfidence =
      items.reduce((s, d) => s + d.confidence, 0) / items.length;
    const rate = goodRate(items);
    const confidenceGap =
      rate !== null ? avgConfidence / 100 - rate : null;
    return {
      category,
      count: items.length,
      avgConfidence: Math.round(avgConfidence),
      goodCallRate: rate,
      confidenceGap,
    };
  });
}

export function overridesByCategory(ledger: Decision[]): CategoryStats[] {
  return byCategory(
    ledger.filter((d) => d.aiStance === "overrode" && d.outcome !== null),
  );
}

export function stanceLabel(stance: AiStance): string {
  const map: Record<AiStance, string> = {
    followed: "Followed AI",
    overrode: "Overrode AI",
    "no-ai": "No AI rec",
    mixed: "Mixed",
  };
  return map[stance];
}
