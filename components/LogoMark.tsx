/** Instrument mark: a fork/crux where two paths diverge from one point. */
export function LogoMark({
  size = 22,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M11 20 L11 12 M11 12 L4 4 M11 12 L18 4"
        stroke="var(--ink)"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="11" cy="12" r="2" fill="var(--teal)" />
      <circle cx="4" cy="4" r="1.6" fill="var(--clay)" />
      <circle cx="18" cy="4" r="1.6" fill="var(--ink-3)" />
    </svg>
  );
}
