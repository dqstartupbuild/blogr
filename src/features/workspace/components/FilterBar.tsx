import type { ReactNode } from "react";

type FilterBarProps = {
  children: ReactNode;
};

export const FilterBar = ({ children }: FilterBarProps) => {
  return (
    <div className="min-w-0 rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-end">{children}</div>
    </div>
  );
};
