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
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-black bg-white px-4 text-sm font-semibold text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed"
      {...props}
    >
      {children}
    </button>
  );
};
