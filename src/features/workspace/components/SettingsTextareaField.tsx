import type { TextareaHTMLAttributes } from "react";

type SettingsTextareaFieldProps =
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    description: string;
    label: string;
  };

export const SettingsTextareaField = ({
  description,
  id,
  label,
  ...props
}: SettingsTextareaFieldProps) => {
  return (
    <label className="grid gap-2 text-sm font-medium text-black" htmlFor={id}>
      <span>{label}</span>
      <span className="text-xs leading-5 text-black/60">{description}</span>
      <textarea
        className="min-h-32 rounded-md border border-black/15 bg-white px-3 py-2 text-sm leading-6 text-black outline-none transition placeholder:text-black/45 focus:border-black"
        id={id}
        {...props}
      />
    </label>
  );
};
