export function safeNextPath(raw: string | null, fallback = "/"): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return fallback;
  return raw;
}

export function authCallbackUrl(nextPath: string, origin: string): string {
  const next = safeNextPath(nextPath, "/");
  return `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
}
