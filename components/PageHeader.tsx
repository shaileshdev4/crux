import type { IconType } from "react-icons";
import { IconSlot, iconMd } from "@/components/IconSlot";

export function PageHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: IconType;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-8">
      <p className="eyebrow text-teal mb-2 flex items-center gap-1.5">
        <IconSlot icon={Icon} className="h-3.5 w-3.5 text-teal" />
        {eyebrow}
      </p>
      <h1 className="font-display text-3xl md:text-4xl text-ink mb-2">{title}</h1>
      {description && <p className="text-sm text-ink-2 max-w-xl">{description}</p>}
    </header>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: IconType;
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="panel p-10 text-center">
      <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
        <IconSlot icon={Icon} className={iconMd} />
      </div>
      <p className="font-display text-xl text-ink mb-2">{title}</p>
      <p className="text-sm text-ink-2 mb-6 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  );
}
