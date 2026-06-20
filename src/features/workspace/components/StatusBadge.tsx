type StatusBadgeProps = {
  status: string;
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const label = status === "ready" ? "done" : status;
  const color =
    status === "failed"
      ? "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]"
      : status === "writing"
        ? "border-[#fed7aa] bg-[#fff7ed] text-[#9a3412]"
        : status === "written" || status === "ready"
          ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
          : "border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8]";

  return (
    <span
      className={`inline-flex h-7 items-center rounded-md border px-2 text-xs font-semibold capitalize ${color}`}
    >
      {label}
    </span>
  );
};
