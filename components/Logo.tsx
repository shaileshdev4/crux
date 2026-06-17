import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";

const wordmarkClass = {
  sm: "text-[1.05rem] leading-none",
  md: "text-[1.35rem] leading-none",
  lg: "text-3xl leading-none",
} as const;

export function Logo({
  size = 22,
  showWordmark = true,
  wordmarkSize = "md",
  href,
  className = "",
  markClassName = "",
  orientation = "horizontal",
}: {
  size?: number;
  showWordmark?: boolean;
  wordmarkSize?: keyof typeof wordmarkClass;
  href?: string;
  className?: string;
  markClassName?: string;
  orientation?: "horizontal" | "stacked";
}) {
  const stacked = orientation === "stacked";

  const content = (
    <span
      className={`group inline-flex ${
        stacked ? "flex-col items-center gap-3" : "items-center gap-2.5"
      } ${className}`}
    >
      <LogoMark size={size} className={`shrink-0 ${markClassName}`} />
      {showWordmark && (
        <span
          className={`font-display tracking-tight text-ink ${wordmarkClass[wordmarkSize]}`}
        >
          Crux
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal">
        {content}
      </Link>
    );
  }

  return content;
}
