import type { AnchorHTMLAttributes, ReactNode } from "react";

type SecondaryAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
};

export const SecondaryAnchor = ({
  children,
  ...props
}: SecondaryAnchorProps) => {
  return (
    <a
      className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-black/15 bg-white px-4 text-sm font-semibold text-black shadow-sm transition hover:border-black hover:bg-black hover:text-white"
      {...props}
    >
      {children}
    </a>
  );
};
