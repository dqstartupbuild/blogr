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
    <article className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 rounded-lg border border-black/10 bg-white p-3 shadow-sm sm:block sm:p-5">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white sm:h-11 sm:w-11">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 sm:contents">
        <p className="text-xl font-semibold leading-6 text-black sm:mt-7 sm:text-3xl sm:leading-normal">
          {value}
        </p>
        <p className="text-xs font-semibold text-black sm:mt-1 sm:text-sm">
          {label}
        </p>
      </div>
      <p className="col-span-2 mt-2 hidden text-sm text-black/60 sm:block">
        {supportingText}
      </p>
    </article>
  );
};
