import type { LucideIcon } from "lucide-react";

type WorkspaceStatCardProps = {
  icon: LucideIcon;
  label: string;
  supportingText: string;
  value: string | number;
};

export const WorkspaceStatCard = ({
  icon: Icon,
  label,
  supportingText,
  value,
}: WorkspaceStatCardProps) => {
  return (
    <article className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white">
        <Icon size={20} aria-hidden="true" />
      </span>
      <p className="mt-7 text-3xl font-semibold text-black">{value}</p>
      <p className="mt-1 text-sm font-semibold text-black">{label}</p>
      <p className="mt-1 text-sm text-black/60">{supportingText}</p>
    </article>
  );
};
