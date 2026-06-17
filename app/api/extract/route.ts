import { NextRequest, NextResponse } from "next/server";
import { ExtractedDraft } from "@/lib/types";
import { GROQ_EXTRACT_MODEL, groqChat } from "@/lib/groq";

export const runtime = "nodejs";
export const maxDuration = 30;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// ─────────────────────────────────────────────────────────────────────────
// CAPTURE → structured draft. We use Llama 3.1 8B here on purpose: extraction
// is a constrained, schema-shaped task where latency matters (this powers the
// live "whoa" moment), and the smaller model is fast enough to feel instant.
//
// The model is told to return ONLY JSON. We parse defensively and, if anything
// goes wrong (no key, bad JSON, timeout), we fall back to a heuristic parser so
// the product still works end-to-end without a key configured.
// ─────────────────────────────────────────────────────────────────────────

const SYSTEM = `You extract a structured decision record from a pasted conversation between a person and an AI assistant.

The person was making a real decision and consulting the AI. Your job is to identify:
- question: one clear sentence stating what was being decided (a yes/no or either/or framing is ideal)
- options: the distinct choices on the table. Mark aiRecommended:true for the option the AI leaned toward (if any). Mark chosen:true for the option the PERSON actually went with (look for their final statement).
- reasons: 2-4 short phrases capturing the human's actual reasoning for their choice (not the AI's)
- aiStance: did the human "follow" the AI's recommendation, "override" it, "no-ai" if the AI gave no clear rec, or "mixed"
- suggestedConfidence: if the person stated a confidence (e.g. "80%"), use it. Otherwise infer 50-85 from how decisive they sound.
- suggestedCategory: one lowercase word - hiring, pricing, product, strategy, engineering, marketing, or other
- extractionConfidence: 0..1, how sure you are this was a real decision you parsed correctly

Respond with ONLY a JSON object, no markdown, no preamble:
{"question":"","options":[{"label":"","aiRecommended":false,"chosen":false}],"reasons":[""],"aiStance":"followed|overrode|no-ai|mixed","suggestedConfidence":70,"suggestedCategory":"","extractionConfidence":0.0}`;

export async function POST(req: NextRequest) {
  let conversation = "";
  try {
    const body = await req.json();
    conversation = (body.conversation ?? "").toString();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (!conversation.trim()) {
    return NextResponse.json({ error: "empty" }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({
      draft: heuristicExtract(conversation),
      source: "heuristic",
    });
  }

  try {
    const text = await groqChat(
      [
        { role: "system", content: SYSTEM },
        { role: "user", content: conversation.slice(0, 12000) },
      ],
      1024,
      GROQ_EXTRACT_MODEL,
    );
    const draft = text ? parseDraft(text) : null;
    if (!draft) {
      return NextResponse.json({
        draft: heuristicExtract(conversation),
        source: "heuristic",
      });
    }
    return NextResponse.json({ draft, source: GROQ_EXTRACT_MODEL });
  } catch (err) {
    console.error("extract error", err);
    return NextResponse.json({
      draft: heuristicExtract(conversation),
      source: "heuristic",
    });
  }
}

function parseDraft(text: string): ExtractedDraft | null {
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    const obj = JSON.parse(clean.slice(start, end + 1));
    if (!obj.question || !Array.isArray(obj.options)) return null;
    return {
      question: String(obj.question),
      options: obj.options.slice(0, 5).map((o: Record<string, unknown>) => ({
        label: String(o.label ?? ""),
        aiRecommended: Boolean(o.aiRecommended),
        chosen: Boolean(o.chosen),
      })),
      reasons: Array.isArray(obj.reasons)
        ? obj.reasons.slice(0, 4).map(String)
        : [],
      aiStance: ["followed", "overrode", "no-ai", "mixed"].includes(
        obj.aiStance,
      )
        ? obj.aiStance
        : "mixed",
      suggestedConfidence: clamp(Number(obj.suggestedConfidence) || 65, 30, 95),
      suggestedCategory: String(obj.suggestedCategory ?? "other").toLowerCase(),
      extractionConfidence: clamp(
        Number(obj.extractionConfidence) || 0.6,
        0,
        1,
      ),
    };
  } catch {
    return null;
  }
}

// A lightweight no-AI fallback so the flow always works in a demo.
function heuristicExtract(text: string): ExtractedDraft {
  const lower = text.toLowerCase();
  const confMatch = text.match(/(\d{1,3})\s*%/);
  const conf = confMatch ? clamp(parseInt(confMatch[1], 10), 30, 95) : 65;

  // Override signal: AI counseled caution/waiting, human went ahead anyway.
  const aiCautious =
    /\b(i'?d be cautious|be cautious|i'?d (wait|hold|keep searching|lean against)|keep searching|my (honest )?lean|i'?d recommend (against|waiting))\b/i.test(
      text,
    );
  const humanWentAhead =
    /\b(but i\b|i'?m gonna|i'?m going to|i am going to|i'?ll (go|make)|going with|going to (make|do|go)|i decided|making the offer|gonna (do|make|go)|against (the|your) (advice|rec))/i.test(
      text,
    );
  const explicitOverride =
    /\b(overrode|went against|ignored the ai|did the opposite)\b/i.test(text);
  const overrode = explicitOverride || (aiCautious && humanWentAhead);

  const cat = /hire|candidate|recruit|offer|promote/.test(lower)
    ? "hiring"
    : /price|pricing|plan|billing|discount|tier/.test(lower)
      ? "pricing"
      : /rewrite|api|infra|logging|sdk|reliability|monolith/.test(lower)
        ? "engineering"
        : /market|raise|acqui|open.?source|position|strateg|pivot/.test(lower)
          ? "strategy"
          : "product";

  // Pull the first thing the human said as the question; strip the speaker tag
  // and cut at the assistant's turn so we don't swallow the whole transcript.
  const firstHuman =
    text.split(/\n+/).find((l) => /^(me|user|you)\s*:/i.test(l.trim())) ??
    text.split(/\n+/).find((l) => l.trim().length > 12) ??
    "A decision";
  const question = firstHuman
    .replace(/^(me|user|you)\s*:\s*/i, "")
    .split(/\bassistant\s*:/i)[0]
    .trim()
    .slice(0, 160);

  return {
    question,
    options: [
      { label: "What you chose", chosen: true },
      {
        label: overrode ? "What the AI recommended" : "The alternative",
        aiRecommended: true,
      },
    ],
    reasons: [],
    aiStance: overrode ? "overrode" : "followed",
    suggestedConfidence: conf,
    suggestedCategory: cat,
    extractionConfidence: 0.4,
  };
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}
