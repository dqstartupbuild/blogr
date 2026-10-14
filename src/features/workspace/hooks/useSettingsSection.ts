"use client";

import { useCallback, useSyncExternalStore } from "react";
import { settingsSections } from "../constants/settingsSections";
import type { SettingsSectionId } from "../types/SettingsSectionId";

const sectionChangeEvent = "settings-section-change";

const subscribe = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  window.addEventListener("hashchange", onChange);
  window.addEventListener(sectionChangeEvent, onChange);

  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener(sectionChangeEvent, onChange);
  };
};

const getHashSnapshot = () => window.location.hash.slice(1);
const getServerHashSnapshot = () => "";

const isSettingsSectionId = (value: string): value is SettingsSectionId =>
  settingsSections.some((section) => section.id === value);

export const useSettingsSection = () => {
  const hash = useSyncExternalStore(
    subscribe,
    getHashSnapshot,
    getServerHashSnapshot,
  );
  const activeSection: SettingsSectionId = isSettingsSectionId(hash)
    ? hash
    : "overview";

  const selectSection = useCallback((sectionId: SettingsSectionId) => {
    if (window.location.hash.slice(1) !== sectionId) {
      window.history.pushState(null, "", `#${sectionId}`);
      window.dispatchEvent(new Event(sectionChangeEvent));
    }

    window.scrollTo({ top: 0 });
  }, []);

  return { activeSection, selectSection };
};
