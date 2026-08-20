# Calendar queue

Each workspace stores an optional `calendarQueueSettings` value. Missing legacy values behave as Daily. Calendar bulk actions generate deterministic local-date targets for the visible month, remove occupied targets, and use at most 30 dates.

Quick fill pairs the oldest unscheduled saved or failed canonical topics with those dates. It does not call AI, create topics, write articles, or publish content. AI fill continues to use the existing batch planning endpoint with the resulting concrete dates.

The date engine lives in `src/features/workspace/utils/buildCalendarQueueDateKeys.ts` and is shared by live mode, demo mode, settings preview, and tests. Monthly jitter is up to three days and remains in its month. Custom schedules use their persisted anchor date and shrink jitter for short intervals to avoid overlapping occurrences.
