import type { ReactNode } from "react";

type SettingsFormSectionProps = {
  children: ReactNode;
  description: string;
  title: string;
};

export const SettingsFormSection = ({
  children,
  description,
  title,
}: SettingsFormSectionProps) => {
  return (
    <section className="grid gap-3 border-t border-black/10 pt-4 first:border-t-0 first:pt-0">
      <div className="grid gap-1">
        <h3 className="text-base font-semibold tracking-normal text-black">
          {title}
        </h3>
        <p className="text-sm leading-6 text-black/65">{description}</p>
      </div>
      {children}
    </section>
  );
};
