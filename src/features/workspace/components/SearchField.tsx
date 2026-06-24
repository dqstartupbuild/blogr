"use client";

import { Search } from "lucide-react";

type SearchFieldProps = {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

export const SearchField = ({
  label,
  onChange,
  placeholder,
  value,
}: SearchFieldProps) => {
  return (
    <label className="relative block min-w-0 flex-1">
      <span className="sr-only">{label}</span>
      <Search
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/55"
        size={18}
        aria-hidden="true"
      />
      <input
        className="h-11 w-full rounded-md border border-black/15 bg-white pl-11 pr-4 text-sm text-black outline-none transition placeholder:text-black/45 focus:border-black"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </label>
  );
};
