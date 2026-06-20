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
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#cfc7b8] bg-[#fffdf8] px-4 text-sm font-semibold text-[#26332d] transition hover:border-[#1d2320]"
      {...props}
    >
      {children}
    </a>
  );
};
