type StatusBadgeProps = {
  status: string;
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const label = status === "ready" ? "done" : status;

  return (
    <span
      className="inline-flex h-7 items-center rounded-md border border-black bg-white px-2 text-xs font-semibold capitalize text-black"
    >
      {label}
    </span>
  );
};
