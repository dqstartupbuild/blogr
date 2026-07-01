import { Plus } from "lucide-react";

type CalendarEmptyDayProps = {
  onAdd: () => void;
};

export const CalendarEmptyDay = ({ onAdd }: CalendarEmptyDayProps) => {
  return (
    <div className="flex min-h-16 flex-col justify-end sm:min-h-28">
      <button
        className="inline-flex h-8 min-w-0 items-center justify-center gap-1 rounded-md border border-dashed border-black/20 bg-white px-1 text-[11px] font-semibold text-black/60 transition hover:border-black hover:bg-black hover:text-white sm:h-9 sm:gap-2 sm:px-3 sm:text-sm"
        onClick={onAdd}
        type="button"
      >
        <Plus size={15} aria-hidden="true" />
        <span className="hidden sm:inline">Add</span>
      </button>
    </div>
  );
};
