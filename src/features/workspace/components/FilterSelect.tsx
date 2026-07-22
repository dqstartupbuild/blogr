"use client";

type FilterSelectOption = {
  label: string;
  value: string;
};

type FilterSelectProps = {
  label: string;
  onChange: (value: string) => void;
  options: FilterSelectOption[];
  value: string;
};

export const FilterSelect = ({
  label,
  onChange,
  options,
  value,
}: FilterSelectProps) => {
  return (
    <label className="grid w-full min-w-0 gap-1 text-xs font-semibold text-black/60 lg:w-44 lg:shrink-0">
      <span>{label}</span>
      <select
        className="h-11 w-full min-w-0 max-w-full rounded-md border border-black/15 bg-white px-3 text-sm font-medium text-black outline-none focus:border-black"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};
