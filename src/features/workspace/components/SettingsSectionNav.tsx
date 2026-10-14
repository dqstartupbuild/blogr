"use client";

import { useEffect, useRef } from "react";
import { settingsSections } from "../constants/settingsSections";
import type { SettingsSectionId } from "../types/SettingsSectionId";

type SettingsSectionNavProps = {
  activeSection: SettingsSectionId;
  onSelect: (sectionId: SettingsSectionId) => void;
};

export const SettingsSectionNav = ({
  activeSection,
  onSelect,
}: SettingsSectionNavProps) => {
  const navRef = useRef<HTMLElement>(null);

  // On narrow screens the tabs scroll sideways; keep the active one in view.
  useEffect(() => {
    const nav = navRef.current;
    const activeButton = nav?.querySelector<HTMLElement>('[aria-current="page"]');

    if (!nav || !activeButton || nav.scrollWidth <= nav.clientWidth) {
      return;
    }

    nav.scrollTo({
      behavior: "smooth",
      left:
        activeButton.offsetLeft -
        (nav.clientWidth - activeButton.offsetWidth) / 2,
    });
  }, [activeSection]);

  return (
    <nav
      aria-label="Settings sections"
      ref={navRef}
      className="relative -mx-4 flex min-w-0 gap-1 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:sticky lg:top-6 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
    >
      {settingsSections.map(({ icon: Icon, id, label }) => {
        const isActive = id === activeSection;

        return (
          <button
            aria-current={isActive ? "page" : undefined}
            className={`flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-3 text-sm font-medium transition ${
              isActive
                ? "bg-black text-white"
                : "border border-black/10 text-black hover:bg-black/5 lg:border-transparent"
            }`}
            key={id}
            onClick={() => onSelect(id)}
            type="button"
          >
            <Icon aria-hidden="true" size={16} />
            {label}
          </button>
        );
      })}
    </nav>
  );
};
