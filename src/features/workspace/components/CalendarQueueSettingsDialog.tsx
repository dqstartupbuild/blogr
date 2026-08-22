"use client";

import { useMemo, useState } from "react";
import { calendarQueueWeekdayLabels } from "../constants/calendarQueueWeekdayLabels";
import type { CalendarQueueSettings } from "../types/CalendarQueueSettings";
import type { CalendarQueueSettingsDraft } from "../types/CalendarQueueSettingsDraft";
import type { SaveCalendarQueueSettings } from "../types/SaveCalendarQueueSettings";
import { buildCalendarQueueDateKeys } from "../utils/buildCalendarQueueDateKeys";
import { buildCalendarQueueSettingsDraft } from "../utils/buildCalendarQueueSettingsDraft";
import { buildCalendarQueueSettingsFromDraft } from "../utils/buildCalendarQueueSettingsFromDraft";
import { formatCalendarDateBadge } from "../utils/formatCalendarDateBadge";

type CalendarQueueSettingsDialogProps = {
  candidateDateKeys: string[];
  isSaving: boolean;
  onClose: () => void;
  saveCalendarQueueSettings: SaveCalendarQueueSettings;
  settings: CalendarQueueSettings;
  stableSeed: string;
};

export const CalendarQueueSettingsDialog = ({
  candidateDateKeys,
  isSaving,
  onClose,
  saveCalendarQueueSettings,
  settings,
  stableSeed,
}: CalendarQueueSettingsDialogProps) => {
  const [draft, setDraft] = useState(() =>
    buildCalendarQueueSettingsDraft(settings),
  );
  const [message, setMessage] = useState("");
  const strictSettings = useMemo(
    () => buildCalendarQueueSettingsFromDraft(draft, settings),
    [draft, settings],
  );
  const preview = useMemo(
    () =>
      strictSettings
        ? buildCalendarQueueDateKeys({
            candidateDateKeys,
            settings: strictSettings,
            stableSeed,
          })
        : [],
    [candidateDateKeys, stableSeed, strictSettings],
  );

  const updateDraft = (patch: Partial<CalendarQueueSettingsDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setMessage("");
  };

  const save = async () => {
    if (!strictSettings) {
      setMessage("Choose a valid queue value.");
      return;
    }

    try {
      await saveCalendarQueueSettings(strictSettings);
      onClose();
    } catch {
      setMessage("Could not save the calendar queue.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/40 px-3 py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article
        aria-modal="true"
        className="grid max-h-[calc(100dvh-3rem)] w-full max-w-lg gap-4 overflow-y-auto rounded-lg border border-black bg-white p-5"
        role="dialog"
      >
        <div>
          <h2 className="text-lg font-semibold">Calendar queue</h2>
          <p className="mt-1 text-sm text-black/60">
            Choose which dates Quick fill and AI fill can use.
          </p>
        </div>
        <label className="grid gap-2 text-sm font-semibold">
          Cadence
          <select className="h-10 rounded-md border border-black/15 px-3 font-normal" onChange={(event) => updateDraft({ cadence: event.target.value as CalendarQueueSettingsDraft["cadence"] })} value={draft.cadence}>
            <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="custom">Custom</option>
          </select>
        </label>
        {draft.cadence === "weekly" ? <label className="grid gap-2 text-sm font-semibold">Day of the week<select className="h-10 rounded-md border border-black/15 px-3 font-normal" onChange={(event) => updateDraft({ weeklyWeekday: event.target.value })} value={draft.weeklyWeekday}>{calendarQueueWeekdayLabels.map((label, weekday) => <option key={label} value={weekday}>{label}</option>)}</select></label> : null}
        {draft.cadence === "monthly" ? <label className="grid gap-2 text-sm font-semibold">Day of the month<input className="h-10 rounded-md border border-black/15 px-3 font-normal" inputMode="numeric" max="31" min="1" onChange={(event) => updateDraft({ monthlyDayOfMonth: event.target.value })} step="1" type="number" value={draft.monthlyDayOfMonth}/><span className="font-normal text-black/60">The date may vary by up to three days and stays in the same month.</span></label> : null}
        {draft.cadence === "custom" ? <label className="grid gap-2 text-sm font-semibold">Every<span className="flex items-center gap-2"><input className="h-10 min-w-0 flex-1 rounded-md border border-black/15 px-3 font-normal" inputMode="numeric" max="90" min="1" onChange={(event) => updateDraft({ customIntervalDays: event.target.value })} step="1" type="number" value={draft.customIntervalDays}/><span className="font-normal">days</span></span><span className="font-normal text-black/60">Dates may vary by up to three days. Frequent schedules use a smaller jitter window to prevent duplicate dates.</span></label> : null}
        <p className="text-sm text-black/60">Upcoming: {preview.slice(0, 5).map(formatCalendarDateBadge).join(", ") || "No queue dates"}{preview.length > 5 ? ` +${preview.length - 5} more` : ""}</p>
        {message ? <p className="text-sm text-black">{message}</p> : null}
        <div className="flex justify-end gap-2"><button className="h-10 rounded-md px-4 text-sm font-semibold" onClick={onClose} type="button">Cancel</button><button className="h-10 rounded-md bg-black px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={isSaving || !strictSettings} onClick={() => void save()} type="button">{isSaving ? "Saving..." : "Save queue"}</button></div>
      </article>
    </div>
  );
};
