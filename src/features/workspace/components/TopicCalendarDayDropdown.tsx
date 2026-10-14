"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { TopicCalendarDayPicker } from "./TopicCalendarDayPicker";
import { formatCalendarDateLabel } from "../utils/formatCalendarDateLabel";

type TopicCalendarDayDropdownProps = {
  calendarDateKeys: string[];
  currentDate?: string;
  onSelect: (dateKey: string) => void;
  openDateKeys: string[];
  selectedDate: string;
  takenDateKeys: string[];
};

export const TopicCalendarDayDropdown = ({
  calendarDateKeys,
  currentDate,
  onSelect,
  openDateKeys,
  selectedDate,
  takenDateKeys,
}: TopicCalendarDayDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);

    return () =>
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [isOpen]);

  return (
    <div className="grid min-w-0 gap-2">
      <span className="text-sm font-semibold text-black">Calendar day</span>
      <div
        className="relative w-full min-w-0 sm:max-w-[17rem]"
        onKeyDown={(event) => {
          if (event.key === "Escape" && isOpen) {
            event.stopPropagation();
            setIsOpen(false);
          }
        }}
        ref={containerRef}
      >
        <button
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          className="flex h-10 w-full min-w-0 items-center gap-2 rounded-md border border-black/15 bg-white px-3 text-left text-sm text-black outline-none transition hover:border-black focus:border-black"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <CalendarDays size={16} aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate">
            {selectedDate ? formatCalendarDateLabel(selectedDate) : "Pick a day"}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={`transition ${isOpen ? "rotate-180" : ""}`}
            size={16}
          />
        </button>
        {isOpen ? (
          <div className="absolute left-0 top-full z-20 mt-1 w-full max-w-[17rem] rounded-md border border-black bg-white p-3 shadow-xl">
            <TopicCalendarDayPicker
              calendarDateKeys={calendarDateKeys}
              currentDate={currentDate}
              onSelect={(dateKey) => {
                onSelect(dateKey);
                setIsOpen(false);
              }}
              openDateKeys={openDateKeys}
              selectedDate={selectedDate}
              takenDateKeys={takenDateKeys}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
