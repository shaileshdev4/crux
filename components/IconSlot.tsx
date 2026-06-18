import type { IconType } from "react-icons";

/** Consistent icon sizing for inline UI */
export const iconSm = "h-4 w-4 shrink-0";
export const iconMd = "h-5 w-5 shrink-0";
export const iconLg = "h-6 w-6 shrink-0";

export function IconSlot({
  icon: Icon,
  className = iconSm,
}: {
  icon: IconType;
  className?: string;
}) {
  return <Icon className={className} aria-hidden />;
}
