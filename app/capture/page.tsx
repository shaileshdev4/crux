"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLedger } from "@/components/LedgerStore";
import { EXAMPLE_CONVERSATIONS } from "@/lib/seed";
import { AiStance, ExtractedDraft } from "@/lib/types";
import { Field, ProvDot, StanceBadge } from "@/components/primitives";

type Phase = "input" | "extracting" | "confirm";

export default function CapturePage() {
  const router = useRouter();
  const { commit } = useLedger();

  const [phase, setPhase] = useState<Phase>("input");
  const [text, setText] = useState("");
  const [draft, setDraft] = useState<ExtractedDraft | null>(null);
  const [source, setSource] = useState("");

  const [confidence, setConfidence] = useState(65);
  const [revisitDays, setRevisitDays] = useState(45);
  const [category, setCategory] = useState("product");
  const [stance, setStance] = useState<AiStance>("followed");
  const [question, setQuestion] = useState("");

  async function runExtract() {
    if (!text.trim()) return;
    setPhase("extracting");
    const started = Date.now();
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation: text }),
      });
      const data = await res.json();
      const d: ExtractedDraft = data.draft;
      const elapsed = Date.now() - started;
      if (elapsed < 1400)
        await new Promise((r) => setTimeout(r, 1400 - elapsed));
      setDraft(d);
      setSource(data.source ?? "");
      setConfidence(d.suggestedConfidence);
      setCategory(d.suggestedCategory);
      setStance(d.aiStance);
      setQuestion(d.question);
      setPhase("confirm");

      if (typeof pendo !== "undefined") {
        pendo.track("decision_extraction_completed", {
          extraction_source: data.source ?? "",
          extraction_confidence: d.extractionConfidence,
          conversation_length: text.length,
          detected_ai_stance: d.aiStance,
          detected_category: d.suggestedCategory,
          suggested_confidence: d.suggestedConfidence,
          option_count: d.options.length,
          reason_count: d.reasons.length,
          extraction_duration_ms: elapsed,
        });
      }
    } catch (err) {
      if (typeof pendo !== "undefined") {
        pendo.track("decision_extraction_failed", {
          conversation_length: text.length,
          error_type: err instanceof Error ? err.name : "unknown",
        });
      }
      setPhase("input");
    }
  }

  function handleCommit() {
    if (!draft) return;
    const revisitAt = new Date(
      Date.now() + revisitDays * 86_400_000,
    ).toISOString();
    commit({
      question,
      options: draft.options.map((o) => ({
        ...o,
        provenance: o.chosen ? "human" : o.aiRecommended ? "ai" : "human",
      })),
      reasons: draft.reasons,
      aiStance: stance,
      confidence,
      category,
      revisitAt,
    });

    if (typeof pendo !== "undefined") {
      pendo.track("decision_committed", {
        category,
        ai_stance: stance,
        confidence,
        revisit_days: revisitDays,
        option_count: draft.options.length,
        reason_count: draft.reasons.length,
        extraction_source: source,
        question_length: question.length,
      });
    }

    router.push("/ledger");
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="eyebrow text-teal mb-2">Capture</p>
      <h1 className="font-display text-3xl text-ink mb-2">
        Structure a decision
      </h1>
      <p className="text-ink-2 text-sm mb-8">
        Paste the AI conversation. Crux pulls out the question, options, and
        whether you overrode it. Try an example below.
      </p>

      {phase === "input" && (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {EXAMPLE_CONVERSATIONS.map((ex) => (
              <button
                key={ex.title}
                type="button"
                onClick={() => setText(ex.text)}
                className="text-xs px-3 py-1.5 rounded-full border border-border text-ink-2 hover:text-ink hover:border-teal/40 transition-colors"
              >
                {ex.title}
              </button>
            ))}
          </div>
          <Field label="Conversation">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Me: …&#10;Assistant: …"
            />
          </Field>
          <button
            type="button"
            onClick={runExtract}
            className="btn-primary mt-6"
          >
            Structure this decision
          </button>
        </>
      )}

      {phase === "extracting" && (
        <div className="panel p-12 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-teal border-t-transparent animate-spin" />
          <p className="text-ink-2 scan-line">Reading the thread…</p>
        </div>
      )}

      {phase === "confirm" && draft && (
        <ConfirmPanel
          draft={draft}
          source={source}
          question={question}
          setQuestion={setQuestion}
          confidence={confidence}
          setConfidence={setConfidence}
          category={category}
          setCategory={setCategory}
          stance={stance}
          setStance={setStance}
          revisitDays={revisitDays}
          setRevisitDays={setRevisitDays}
          onBack={() => setPhase("input")}
          onCommit={handleCommit}
        />
      )}
    </div>
  );
}

function ConfirmPanel({
  draft,
  source,
  question,
  setQuestion,
  confidence,
  setConfidence,
  category,
  setCategory,
  stance,
  setStance,
  revisitDays,
  setRevisitDays,
  onBack,
  onCommit,
}: {
  draft: ExtractedDraft;
  source: string;
  question: string;
  setQuestion: (q: string) => void;
  confidence: number;
  setConfidence: (n: number) => void;
  category: string;
  setCategory: (c: string) => void;
  stance: AiStance;
  setStance: (s: AiStance) => void;
  revisitDays: number;
  setRevisitDays: (n: number) => void;
  onBack: () => void;
  onCommit: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="panel p-5">
        <div className="flex items-center justify-between mb-4">
          <StanceBadge stance={stance} />
          <span className="eyebrow">{category}</span>
        </div>
        <Field label="Decision">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </Field>
        <ul className="mt-4 space-y-2">
          {draft.options.map((o, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-ink-2">
              <ProvDot source={o.aiRecommended ? "ai" : "human"} />
              <span className={o.chosen ? "text-ink font-medium" : ""}>
                {o.label}
              </span>
              {o.chosen && <span className="text-xs text-teal">chosen</span>}
              {o.aiRecommended && (
                <span className="text-xs text-ink-3">AI rec</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={`Confidence at the time - ${confidence}%`}>
          <input
            type="range"
            min={30}
            max={95}
            value={confidence}
            onChange={(e) => setConfidence(Number(e.target.value))}
          />
        </Field>
        <Field label="Category">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {[
              "hiring",
              "pricing",
              "product",
              "strategy",
              "engineering",
              "marketing",
              "other",
            ].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="AI stance">
          <select
            value={stance}
            onChange={(e) => setStance(e.target.value as AiStance)}
          >
            <option value="followed">followed</option>
            <option value="overrode">overrode</option>
            <option value="no-ai">no-ai</option>
            <option value="mixed">mixed</option>
          </select>
        </Field>
        <Field label="Revisit in (days)">
          <div className="flex gap-2">
            {[30, 45, 60, 90].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setRevisitDays(d)}
                className={`px-3 py-1.5 text-xs rounded-lg border ${
                  revisitDays === d
                    ? "border-teal text-teal bg-teal/10"
                    : "border-border text-ink-2"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-ink-2 hover:text-ink"
        >
          ← Start over
        </button>
        <div className="flex items-center gap-4">
          {source && (
            <span className="eyebrow">
              {source.startsWith("llama")
                ? `Parsed by ${source}`
                : "Parsed locally"}
            </span>
          )}
          <button type="button" onClick={onCommit} className="btn-primary">
            Commit to ledger →
          </button>
        </div>
      </div>
    </div>
  );
}
