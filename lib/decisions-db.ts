import type { SupabaseClient } from "@supabase/supabase-js";
import { AiStance, Decision, Outcome } from "@/lib/types";

export type DecisionRow = {
  id: string;
  user_id: string;
  decided_at: string;
  owner: string | null;
  question: { text?: string } | string;
  options: Decision["options"];
  reasons: string[];
  ai_stance: string;
  confidence: { value?: number } | number;
  revisit_by: string | null;
  resolution: {
    outcome?: Outcome;
    resolvedAt?: string;
    note?: string;
  } | null;
  version: number;
  category: string | null;
  created_at: string;
};

function parseQuestion(raw: DecisionRow["question"]): string {
  if (typeof raw === "string") return raw;
  return raw?.text ?? "";
}

function parseConfidence(raw: DecisionRow["confidence"]): number {
  if (typeof raw === "number") return raw;
  return raw?.value ?? 0;
}

export function rowToDecision(row: DecisionRow): Decision {
  const resolution = row.resolution;
  return {
    id: row.id,
    question: parseQuestion(row.question),
    options: row.options ?? [],
    reasons: row.reasons ?? [],
    aiStance: row.ai_stance as AiStance,
    confidence: parseConfidence(row.confidence),
    category: row.category ?? "other",
    committedAt: row.decided_at,
    revisitAt: row.revisit_by,
    outcome: resolution?.outcome ?? null,
    resolvedAt: resolution?.resolvedAt ?? null,
    note: resolution?.note,
    isSample: false,
  };
}

export function decisionToInsert(
  userId: string,
  d: Omit<Decision, "id" | "committedAt" | "outcome" | "resolvedAt" | "isSample">,
) {
  return {
    user_id: userId,
    question: { text: d.question },
    options: d.options,
    reasons: d.reasons,
    ai_stance: d.aiStance,
    confidence: { value: d.confidence },
    revisit_by: d.revisitAt,
    category: d.category,
    resolution: null,
    decided_at: new Date().toISOString(),
  };
}

export function resolutionPatch(outcome: Outcome, note?: string) {
  return {
    resolution: {
      outcome,
      resolvedAt: new Date().toISOString(),
      ...(note ? { note } : {}),
    },
  };
}

export async function fetchUserDecisions(
  supabase: SupabaseClient,
  userId: string,
): Promise<Decision[]> {
  const { data, error } = await supabase
    .from("decisions")
    .select("*")
    .eq("user_id", userId)
    .order("decided_at", { ascending: false });

  if (error) throw error;
  return (data as DecisionRow[]).map(rowToDecision);
}

export async function insertDecision(
  supabase: SupabaseClient,
  userId: string,
  d: Omit<Decision, "id" | "committedAt" | "outcome" | "resolvedAt" | "isSample">,
): Promise<Decision> {
  const { data, error } = await supabase
    .from("decisions")
    .insert(decisionToInsert(userId, d))
    .select("*")
    .single();

  if (error) throw error;
  return rowToDecision(data as DecisionRow);
}

export async function updateDecisionResolution(
  supabase: SupabaseClient,
  userId: string,
  id: string,
  outcome: Outcome,
  note?: string,
): Promise<Decision> {
  const { data, error } = await supabase
    .from("decisions")
    .update(resolutionPatch(outcome, note))
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) throw error;
  return rowToDecision(data as DecisionRow);
}
