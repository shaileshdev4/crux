/**
 * Groq OpenAI-compatible chat - powers /api/extract and /api/narrate.
 * Falls back gracefully when GROQ_API_KEY is unset.
 */

export const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
export const GROQ_EXTRACT_MODEL =
  process.env.GROQ_EXTRACT_MODEL ?? "llama-3.1-8b-instant";

export async function groqChat(
  messages: { role: "system" | "user"; content: string }[],
  maxTokens = 1024,
  model = GROQ_MODEL,
): Promise<string | null> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        temperature: 0.2,
        messages,
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return data.choices?.[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}
