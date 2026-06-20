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
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-black bg-white px-4 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
      {...props}
    >
      {children}
    </a>
  );
};
