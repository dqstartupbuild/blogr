import { getStatusLabel } from "../utils/getStatusLabel";

type StatusBadgeProps = {
  status: string;
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const label = getStatusLabel(status);

  return (
    <span
      className="inline-flex h-7 items-center rounded-md border border-black/10 bg-black/5 px-2.5 text-xs font-semibold text-black"
    >
      {label}
    </span>
  );
};
