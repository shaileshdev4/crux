import { NextRequest, NextResponse } from "next/server";
import { GROQ_MODEL, groqChat } from "@/lib/groq";

export const runtime = "nodejs";
export const maxDuration = 30;

// ─────────────────────────────────────────────────────────────────────────
// REFLECT narration. We use Llama 3.3 70B here: this is the voice the user
// reads as "insight," so reasoning quality and phrasing matter more than speed.
//
// CRITICAL design choice for trust: the model is NOT allowed to invent numbers.
// It receives already-computed insights and may only rephrase them. This keeps
// the product honest - the AI narrates the ledger, it never fabricates it.
// ─────────────────────────────────────────────────────────────────────────

const SYSTEM = `You are the reflective voice of a decision journal. You receive insights that have ALREADY been computed from the user's real decision ledger. Your only job is to rewrite each one to be sharper, more human, and more memorable.

Hard rules:
- NEVER invent or change any number, percentage, or count. Use only the figures present in the input.
- Keep each headline under 9 words, punchy, second person ("you").
- Keep each detail to 1-2 sentences, specific, no hedging, no "it seems".
- Preserve the tone field exactly as given.
- No emojis, no exclamation marks, no corporate filler.

Return ONLY a JSON object, no markdown:
{"insights":[{"headline":"","detail":"","tone":"edge|blindspot|pattern"}]}`;

interface Insight {
  headline: string;
  detail: string;
  tone: string;
}

export async function POST(req: NextRequest) {
  let insights: Insight[] = [];
  try {
    const body = await req.json();
    insights = Array.isArray(body.insights) ? body.insights : [];
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (!insights.length)
    return NextResponse.json({ error: "empty" }, { status: 400 });

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ insights, source: "computed" });
  }

  try {
    const text = await groqChat(
      [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: `Rewrite these computed insights. Do not change any numbers.\n\n${JSON.stringify(
            insights,
          )}`,
        },
      ],
      1024,
      GROQ_MODEL,
    );
    if (!text) return NextResponse.json({ insights, source: "computed" });

    const clean = text.replace(/```json|```/g, "").trim();
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start === -1 || end === -1)
      return NextResponse.json({ insights, source: "computed" });
    const obj = JSON.parse(clean.slice(start, end + 1));
    if (!Array.isArray(obj.insights) || !obj.insights.length) {
      return NextResponse.json({ insights, source: "computed" });
    }
    const narrated = obj.insights
      .slice(0, insights.length)
      .map((ins: Record<string, unknown>, i: number) => ({
        headline: String(ins.headline ?? insights[i].headline),
        detail: String(ins.detail ?? insights[i].detail),
        tone: insights[i].tone,
      }));
    return NextResponse.json({ insights: narrated, source: GROQ_MODEL });
  } catch (err) {
    console.error("narrate error", err);
    return NextResponse.json({ insights, source: "computed" });
  }
}
