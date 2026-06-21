type SettingsSelectFieldOption = {
  label: string;
  value: string | number;
};

type SettingsSelectFieldProps = {
  description?: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  options: readonly SettingsSelectFieldOption[];
  value: string | number;
};

export const SettingsSelectField = ({
  description,
  id,
  label,
  onChange,
  options,
  value,
}: SettingsSelectFieldProps) => {
  return (
    <label className="grid gap-2 text-sm font-medium text-black" htmlFor={id}>
      <span>{label}</span>
      <select
        className="h-11 rounded-md border border-black bg-white px-3 text-sm text-black outline-none transition focus:border-black"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {description ? (
        <span className="text-xs leading-5 text-black">{description}</span>
      ) : null}
    </label>
  );
};
