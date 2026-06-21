type SettingsSaveStatusProps = {
  message: string;
};

export const SettingsSaveStatus = ({ message }: SettingsSaveStatusProps) => {
  if (!message) {
    return null;
  }

  return (
    <p className="text-sm font-medium text-black" aria-live="polite">
      {message}
    </p>
  );
};
