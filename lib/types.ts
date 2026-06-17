export type AiStance = "followed" | "overrode" | "no-ai" | "mixed";
export type Outcome = "better" | "expected" | "worse" | null;
export type Provenance = "ai" | "human" | "computed";

export interface DecisionOption {
  label: string;
  aiRecommended?: boolean;
  chosen?: boolean;
  provenance?: Provenance;
}

export interface Decision {
  id: string;
  question: string;
  options: DecisionOption[];
  reasons: string[];
  aiStance: AiStance;
  confidence: number;
  category: string;
  committedAt: string;
  revisitAt: string | null;
  outcome: Outcome;
  resolvedAt: string | null;
  note?: string;
  isSample?: boolean;
}

export interface ExtractedDraft {
  question: string;
  options: { label: string; aiRecommended?: boolean; chosen?: boolean }[];
  reasons: string[];
  aiStance: AiStance;
  suggestedConfidence: number;
  suggestedCategory: string;
  extractionConfidence: number;
}

export function isGoodOutcome(o: Outcome): boolean | null {
  if (o === null) return null;
  return o === "better" || o === "expected";
}
