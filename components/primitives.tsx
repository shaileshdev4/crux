import { AiStance } from "@/lib/types";
import { stanceLabel } from "@/lib/analysis";

export function ProvDot({ source }: { source: "ai" | "human" }) {
  const color = source === "ai" ? "bg-teal" : "bg-ink-2";
  return (
    <span
      className={`inline-block w-1.5 h-1.5 rounded-full ${color}`}
      title={source === "ai" ? "AI extracted" : "You confirmed"}
    />
  );
}

export function StanceBadge({ stance }: { stance: AiStance }) {
  const overrode = stance === "overrode";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        overrode
          ? "bg-clay/15 text-clay border border-clay/30"
          : "bg-teal/10 text-teal border border-teal/25"
      }`}
    >
      {stanceLabel(stance)}
    </span>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow block mb-2">{label}</span>
      {children}
    </label>
  );
}

export function OutcomePill({ outcome }: { outcome: "better" | "expected" | "worse" }) {
  const styles = {
    better: "text-good bg-good/10 border-good/30",
    expected: "text-teal bg-teal/10 border-teal/30",
    worse: "text-bad bg-bad/10 border-bad/30",
  };
  const labels = { better: "Better", expected: "As expected", worse: "Worse" };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs border ${styles[outcome]}`}>
      {labels[outcome]}
    </span>
  );
}
