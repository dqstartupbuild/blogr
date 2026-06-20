import type { InputHTMLAttributes } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const TextField = ({ label, id, ...props }: TextFieldProps) => {
  return (
    <label className="grid gap-2 text-sm font-medium text-[#324039]" htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        className="h-11 rounded-md border border-[#cfc7b8] bg-white px-3 text-sm outline-none transition placeholder:text-[#8b938e] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/15"
        {...props}
      />
    </label>
  );
};
