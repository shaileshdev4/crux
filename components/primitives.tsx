import { AiStance } from "@/lib/types";
import { stanceLabel } from "@/lib/analysis";
import {
  HiArrowPath,
  HiCheck,
  HiCpuChip,
  HiMinus,
  HiUser,
  HiXMark,
} from "react-icons/hi2";
import { IconSlot, iconSm } from "@/components/IconSlot";

export function ProvDot({ source }: { source: "ai" | "human" }) {
  const Icon = source === "ai" ? HiCpuChip : HiUser;
  const color = source === "ai" ? "text-teal" : "text-ink-3";
  return (
    <IconSlot
      icon={Icon}
      className={`${iconSm} ${color}`}
    />
  );
}

const STANCE_ICONS: Record<AiStance, typeof HiCheck> = {
  followed: HiCheck,
  overrode: HiArrowPath,
  "no-ai": HiMinus,
  mixed: HiXMark,
};

export function StanceBadge({ stance }: { stance: AiStance }) {
  const overrode = stance === "overrode";
  const Icon = STANCE_ICONS[stance];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        overrode
          ? "bg-clay/15 text-clay border border-clay/30"
          : "bg-teal/10 text-teal border border-teal/25"
      }`}
    >
      <IconSlot icon={Icon} className="h-3 w-3" />
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

const OUTCOME_ICONS = {
  better: HiCheck,
  expected: HiMinus,
  worse: HiXMark,
} as const;

export function OutcomePill({ outcome }: { outcome: "better" | "expected" | "worse" }) {
  const styles = {
    better: "text-good bg-good/10 border-good/30",
    expected: "text-teal bg-teal/10 border-teal/30",
    worse: "text-bad bg-bad/10 border-bad/30",
  };
  const labels = { better: "Better", expected: "As expected", worse: "Worse" };
  const Icon = OUTCOME_ICONS[outcome];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${styles[outcome]}`}>
      <IconSlot icon={Icon} className="h-3 w-3" />
      {labels[outcome]}
    </span>
  );
}
