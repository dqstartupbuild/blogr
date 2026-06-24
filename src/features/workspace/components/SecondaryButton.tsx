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
      className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-black/15 bg-white px-4 text-sm font-semibold text-black shadow-sm transition hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      {...props}
    >
      {children}
    </button>
  );
};
