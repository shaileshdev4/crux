/** Safe wrappers around the Novus / Pendo agent loaded in app/layout.tsx */

const trackedOnce = new Set<string>();

export function trackPendo(
  event: string,
  properties?: Record<string, unknown>,
): void {
  if (typeof pendo === "undefined") return;
  pendo.track(event, properties);
}

/** Fire at most once per session for a given dedupe key (e.g. ledger snapshot). */
export function trackPendoOnce(
  key: string,
  event: string,
  properties?: Record<string, unknown>,
): void {
  if (trackedOnce.has(key)) return;
  trackedOnce.add(key);
  trackPendo(event, properties);
}
