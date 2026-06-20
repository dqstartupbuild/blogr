import type { InputHTMLAttributes } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const TextField = ({ label, id, ...props }: TextFieldProps) => {
  return (
    <label className="grid gap-2 text-sm font-medium text-black" htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        className="h-11 rounded-md border border-black bg-white px-3 text-sm text-black outline-none transition placeholder:text-black focus:border-black"
        {...props}
      />
    </label>
  );
};
