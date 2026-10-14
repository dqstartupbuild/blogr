import { ChevronRight, type LucideIcon } from "lucide-react";
import type { SettingsOverviewRow } from "../types/SettingsOverviewRow";

type SettingsOverviewCardProps = {
  icon: LucideIcon;
  note?: string;
  onEdit: () => void;
  rows: SettingsOverviewRow[];
  title: string;
};

export const SettingsOverviewCard = ({
  icon: Icon,
  note,
  onEdit,
  rows,
  title,
}: SettingsOverviewCardProps) => {
  return (
    <section className="flex min-w-0 flex-col rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Icon aria-hidden="true" size={18} />
        <h2 className="text-base font-semibold text-black">{title}</h2>
      </div>
      <dl className="mt-3 grid flex-1 content-start gap-2">
        {rows.map((row) => (
          <div
            className="grid min-w-0 grid-cols-[6.5rem_minmax(0,1fr)] gap-3 text-sm"
            key={row.label}
          >
            <dt className="text-black/55">{row.label}</dt>
            <dd className="line-clamp-2 min-w-0 font-medium text-black [overflow-wrap:anywhere]" title={row.value}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      {note ? (
        <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
          {note}
        </p>
      ) : null}
      <button
        className="mt-4 inline-flex items-center gap-1 self-start text-sm font-semibold text-black underline-offset-4 hover:underline"
        onClick={onEdit}
        type="button"
      >
        Open {title.toLowerCase()}
        <ChevronRight aria-hidden="true" size={16} />
      </button>
    </section>
  );
};
