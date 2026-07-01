import { Plus } from "lucide-react";

type CalendarEmptyDayProps = {
  onAdd: () => void;
};

export const CalendarEmptyDay = ({ onAdd }: CalendarEmptyDayProps) => {
  return (
    <div className="flex min-h-40 flex-col justify-between rounded-lg border border-dashed border-black/15 bg-black/[0.02] p-3">
      <p className="text-sm leading-6 text-black/50">No topic yet.</p>
      <button
        className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-black/15 bg-white px-3 text-sm font-semibold text-black transition hover:border-black hover:bg-black hover:text-white"
        onClick={onAdd}
        type="button"
      >
        <Plus size={15} aria-hidden="true" />
        Add topic
      </button>
    </div>
  );
};
