"use client";

import { useState } from "react";
import type { CalendarQueueSettings } from "../types/CalendarQueueSettings";
import type { SaveCalendarQueueSettings } from "../types/SaveCalendarQueueSettings";
import { formatCalendarQueueSummary } from "../utils/formatCalendarQueueSummary";
import { CalendarQueueSettingsDialog } from "./CalendarQueueSettingsDialog";
import { SectionTitle } from "./SectionTitle";

type CalendarQueueSettingsPanelProps = {
  candidateDateKeys: string[];
  isSaving: boolean;
  saveCalendarQueueSettings: SaveCalendarQueueSettings;
  settings: CalendarQueueSettings;
  stableSeed: string;
};

export const CalendarQueueSettingsPanel = ({
  candidateDateKeys,
  isSaving,
  saveCalendarQueueSettings,
  settings,
  stableSeed,
}: CalendarQueueSettingsPanelProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <section className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <SectionTitle title="Calendar queue" />
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-1">
          <p className="text-sm font-semibold text-black">
            {formatCalendarQueueSummary(settings).replace("Queue: ", "")}
          </p>
          <p className="max-w-2xl text-sm leading-6 text-black/60">
            Choose which dates Quick fill and AI fill can use on your calendar.
          </p>
        </div>
        <button
          className="h-10 whitespace-nowrap rounded-md border border-black/15 bg-white px-4 text-sm font-semibold text-black transition hover:border-black hover:bg-black hover:text-white"
          onClick={() => setIsDialogOpen(true)}
          type="button"
        >
          Change queue
        </button>
      </div>
      {isDialogOpen ? (
        <CalendarQueueSettingsDialog
          candidateDateKeys={candidateDateKeys}
          isSaving={isSaving}
          onClose={() => setIsDialogOpen(false)}
          saveCalendarQueueSettings={saveCalendarQueueSettings}
          settings={settings}
          stableSeed={stableSeed}
        />
      ) : null}
    </section>
  );
};
