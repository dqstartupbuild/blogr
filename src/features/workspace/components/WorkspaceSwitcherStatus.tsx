type WorkspaceSwitcherStatusProps = {
  message: string;
};

export const WorkspaceSwitcherStatus = ({
  message,
}: WorkspaceSwitcherStatusProps) => {
  if (!message) {
    return null;
  }

  return (
    <p className="basis-full text-right text-xs font-medium text-black" aria-live="polite">
      {message}
    </p>
  );
};
