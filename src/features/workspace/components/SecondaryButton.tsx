import type { ButtonHTMLAttributes, ReactNode } from "react";

type SecondaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export const SecondaryButton = ({
  children,
  ...props
}: SecondaryButtonProps) => {
  return (
    <button
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#cfc7b8] bg-[#fffdf8] px-4 text-sm font-semibold text-[#26332d] transition hover:border-[#1d2320] disabled:cursor-not-allowed disabled:text-[#9aa39d]"
      {...props}
    >
      {children}
    </button>
  );
};
