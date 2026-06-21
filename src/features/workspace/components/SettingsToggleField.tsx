type SettingsToggleFieldProps = {
  checked: boolean;
  description: string;
  id: string;
  label: string;
  onChange: (checked: boolean) => void;
};

export const SettingsToggleField = ({
  checked,
  description,
  id,
  label,
  onChange,
}: SettingsToggleFieldProps) => {
  return (
    <label
      className="grid min-h-28 gap-3 rounded-md border border-black bg-white p-3 text-black"
      htmlFor={id}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="grid gap-1">
          <span className="text-sm font-semibold">{label}</span>
          <span className="text-xs leading-5">{description}</span>
        </span>
        <input
          checked={checked}
          className="mt-1 h-5 w-5 accent-black"
          id={id}
          onChange={(event) => onChange(event.target.checked)}
          type="checkbox"
        />
      </span>
    </label>
  );
};
