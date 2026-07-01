import type { ReactNode } from "react";

type CalendarTopicActionButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  label: string;
  onClick: () => void;
};

export const CalendarTopicActionButton = ({
  children,
  disabled = false,
  label,
  onClick,
}: CalendarTopicActionButtonProps) => {
  return (
    <button
      aria-label={label}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/10 bg-white text-black transition hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8"
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
};
