import type { InputHTMLAttributes } from "react";

type SettingsTextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const SettingsTextField = ({
  id,
  label,
  ...props
}: SettingsTextFieldProps) => {
  return (
    <label className="grid gap-2 text-sm font-medium text-black" htmlFor={id}>
      <span>{label}</span>
      <input
        className="h-11 rounded-md border border-black/15 bg-white px-3 text-sm text-black outline-none transition placeholder:text-black/45 focus:border-black"
        id={id}
        {...props}
      />
    </label>
  );
};
