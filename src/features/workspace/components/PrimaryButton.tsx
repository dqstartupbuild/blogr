import type { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export const PrimaryButton = ({ children, ...props }: PrimaryButtonProps) => {
  return (
    <button
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-black bg-black px-4 text-sm font-semibold text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed"
      {...props}
    >
      {children}
    </button>
  );
};
