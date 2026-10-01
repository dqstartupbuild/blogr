# Schedule article topics

The Calendar page shows topics in the active project by month. Add a new topic on an open date, schedule an existing saved or failed topic, move a topic to another open date, or remove its date. Adding a keyword already saved in the project schedules that topic when it is eligible. An already scheduled or written topic produces a clear error instead of a second record.

Quick fill schedules eligible saved or failed topics on open queue dates. The queue can use daily, weekly, monthly, or custom cadence. AI fill and topic discovery need configured outside services; manual scheduling and quick fill work offline. Calendar dates and queue settings are stored in the local workspace.

Relevant code: `src/features/workspace/components/CalendarPanel.tsx`, `src/features/workspace/components/CalendarQueueSettingsDialog.tsx`, and `src/local/server/actions/`.
