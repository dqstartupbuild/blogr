type WorkspaceSwitcherStatusProps = {
  isCompact?: boolean;
  message: string;
};

export const WorkspaceSwitcherStatus = ({
  isCompact = false,
  message,
}: WorkspaceSwitcherStatusProps) => {
  if (!message) {
    return null;
  }

  return (
    <p
      className={
        isCompact
          ? "sr-only"
          : "basis-full text-right text-xs font-medium text-black"
      }
      aria-live="polite"
    >
      {message}
    </p>
  );
};
