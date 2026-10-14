import type { ReactNode } from "react";

type SettingsSaveBarProps = {
  children: ReactNode;
};

// Keeps the save button in view on long forms, above the mobile bottom nav.
export const SettingsSaveBar = ({ children }: SettingsSaveBarProps) => {
  return (
    <div className="sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-10 -mx-4 -mb-4 flex flex-wrap items-center gap-3 rounded-b-lg border-t border-black/10 bg-white/95 px-4 py-3 backdrop-blur lg:bottom-0">
      {children}
    </div>
  );
};
