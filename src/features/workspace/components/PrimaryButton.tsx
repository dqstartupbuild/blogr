import type { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export const PrimaryButton = ({ children, ...props }: PrimaryButtonProps) => {
  return (
    <button
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#1d2320] px-4 text-sm font-semibold text-white transition hover:bg-[#334039] disabled:cursor-not-allowed disabled:bg-[#9aa39d]"
      {...props}
    >
      {children}
    </button>
  );
};
