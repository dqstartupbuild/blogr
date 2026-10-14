import {
  CalendarDays,
  HardDriveDownload,
  LayoutGrid,
  Link2,
  Package,
  PenLine,
  Send,
  type LucideIcon,
} from "lucide-react";
import type { SettingsSectionId } from "../types/SettingsSectionId";

export type SettingsSection = {
  description: string;
  icon: LucideIcon;
  id: SettingsSectionId;
  label: string;
};

export const settingsSections: SettingsSection[] = [
  {
    description: "See all your settings at a glance.",
    icon: LayoutGrid,
    id: "overview",
    label: "Overview",
  },
  {
    description: "What you sell, who it's for, and your brand colors.",
    icon: Package,
    id: "product",
    label: "Product",
  },
  {
    description: "Article voice, writing rules, images, and extras.",
    icon: PenLine,
    id: "writing",
    label: "Writing",
  },
  {
    description: "Pages from your site the writer can link to.",
    icon: Link2,
    id: "links",
    label: "Site links",
  },
  {
    description: "Send finished articles to your blog.",
    icon: Send,
    id: "publishing",
    label: "Publishing",
  },
  {
    description: "Which days Quick fill and AI fill can use.",
    icon: CalendarDays,
    id: "calendar",
    label: "Calendar",
  },
  {
    description: "Download, import, or delete your saved work.",
    icon: HardDriveDownload,
    id: "backups",
    label: "Backups",
  },
];
