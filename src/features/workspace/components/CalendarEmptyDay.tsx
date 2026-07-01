import { Plus } from "lucide-react";

type CalendarEmptyDayProps = {
  onAdd: () => void;
};

export const CalendarEmptyDay = ({ onAdd }: CalendarEmptyDayProps) => {
  return (
    <div className="flex min-h-28 flex-col justify-end">
      <button
        className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-dashed border-black/20 bg-white px-3 text-sm font-semibold text-black/60 transition hover:border-black hover:bg-black hover:text-white"
        onClick={onAdd}
        type="button"
      >
        <Plus size={15} aria-hidden="true" />
        Add
      </button>
    </div>
  );
};
