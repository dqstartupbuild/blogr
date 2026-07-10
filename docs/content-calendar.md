# Content Calendar

## What It Does

The content calendar shows a real month view for the active workspace. It opens on the current month, with simple previous and next month buttons. There is no date picker.

Users can add a new topic to an empty day, add an existing saved topic to an empty day, click a scheduled topic to open its action dialog, move a topic to another open day, remove a topic from a day, delete a topic, edit or refresh a brief, repurpose source text, write an article, and open a written article preview from the calendar. Calendar topics are normal topic records with a scheduled date, so the existing Topics and Articles workflows still work.

Written article topics stay visible on the calendar as history. Existing articles are backfilled onto the calendar through their linked topic. The topic creation day is used first, and the article creation day is used as a fallback.

The calendar renders as a seven-column weekday board. Each month is aligned to the correct weekday with muted blank slots before and after the month.

The **Fill empty days** action creates scheduled topic records only. It does not write full blog drafts. It fills up to 30 blank days from today forward and leaves already-filled days alone.

## How It Works

Scheduled topics are stored in the existing `topics` table with optional calendar and dedupe fields:

- `scheduledDate`
- `sourceType`
- `canonicalKeyword`
- `intentKey`

`useLiveWorkspace` loads scheduled topics with `listScheduledTopics` when the workspace is in calendar mode. The query follows the visible month. It also loads existing topic keywords and article keywords so batch planning can avoid topics that already exist in the workspace.

The shared topic action dialog is used by both the Calendar and Topics views. It puts article, brief, repurposing, writing, calendar, and delete controls near the top, with the saved brief below them for easy reading after the user chooses an action. Only Saved and Failed topics can be added to an open day in the visible month; Writing, Written, and already Scheduled topics are not offered for calendar scheduling.

Scheduled planning topics can be removed from the calendar without deleting the topic. Written topics with articles stay on the calendar as article history instead of offering calendar removal.

Topics on the calendar use the `scheduled` status. New calendar topics are saved with `status: "scheduled"`, and older records that still have `status: "saved"` plus a `scheduledDate` are treated as Scheduled in the UI and topic filters.

When the user clicks **Fill empty days**, the client sends up to 30 blank dates from today forward, product profile, existing topics, and existing article keywords to `POST /api/topics/batch-plan`. The route tries Google discovery through Apify with a short calendar-specific timeout, generates topic discovery data when search is available, converts normal ideas, gaps, questions, comparison ideas, AI answer notes, and difficulty notes into one shared candidate shape, and adds a deep product-niche expansion pool. Similar candidates are grouped before scheduling, then one unique candidate is returned for each blank date.

The client saves returned candidates through `createScheduledTopicBatch`. The mutation re-checks ownership, occupied dates, existing keywords, article keywords, and intent keys before inserting rows. If the calendar changed while planning was running, filled dates are skipped instead of overwritten.

When a live workspace opens the calendar, `backfillWrittenTopicCalendarDates` patches written topics that have linked articles but no `scheduledDate`. It keeps those topics as Written, sets `scheduledDate` from `topic.createdAt`, falls back to `blog.createdAt`, and updates topic search text so calendar history can be queried normally. This does not create article drafts or duplicate topics.

## Dedupe Behavior

The batch planner does not save every discovery bucket as a separate article. It first normalizes planner prefixes such as “Review difficulty for” and “Improve AI answer coverage for,” then builds an `intentKey` from the meaningful topic tokens.

Similar candidates are grouped before scheduling. For example, a question, content gap, and difficulty note about the same pricing-page intent become one scheduled topic with merged notes instead of three articles competing for the same keyword.

The route builds enough long-tail product-niche candidates to fill the requested blank days even when search or AI returns a thin set of ideas. The expansion patterns mix buying, setup, comparison, troubleshooting, workflow, budget, onboarding, and review angles so the scheduled topics stay distinct instead of becoming small rewrites of the same keyword.

## Relevant Code

- `src/app/calendar/page.tsx`
- `src/app/api/topics/batch-plan/route.ts`
- `src/app/api/topics/batch-plan/schema.ts`
- `src/features/workspace/components/CalendarPanel.tsx`
- `src/features/workspace/components/CalendarMonthControls.tsx`
- `src/features/workspace/components/CalendarGrid.tsx`
- `src/features/workspace/components/CalendarDayCell.tsx`
- `src/features/workspace/components/CalendarPastEmptyDay.tsx`
- `src/features/workspace/components/CalendarTopicCard.tsx`
- `src/features/workspace/components/CalendarAddTopicDialog.tsx`
- `src/features/workspace/components/CalendarAddExistingTopicForm.tsx`
- `src/features/workspace/components/TopicActionDialog.tsx`
- `src/features/workspace/components/TopicCalendarScheduleControl.tsx`
- `src/features/workspace/utils/canRemoveTopicFromCalendar.ts`
- `src/features/workspace/utils/getSchedulableCalendarDateKeys.ts`
- `src/features/workspace/hooks/useLiveWorkspace.ts`
- `src/features/workspace/hooks/useDemoWorkspace.ts`
- `src/server/topics/buildExpandedTopicCandidates.ts`
- `src/server/topics/buildTopicExpansionBasePhrases.ts`
- `src/server/topics/buildTopicExpansionScopes.ts`
- `src/server/topics/topicExpansionPatterns.ts`
- `src/server/topics/buildTopicCandidatesFromDiscovery.ts`
- `src/server/topics/buildUniqueTopicCandidates.ts`
- `src/server/topics/groupTopicCandidates.ts`
- `src/server/topics/mergeTopicCandidateGroup.ts`
- `src/server/topics/filterDuplicateTopicCandidates.ts`
- `convex/topics/listScheduledTopics.ts`
- `convex/topics/backfillWrittenTopicCalendarDates.ts`
- `convex/topics/createScheduledTopic.ts`
- `convex/topics/createScheduledTopicBatch.ts`
- `convex/topics/updateTopicScheduledDate.ts`
- `convex/topics/topicStatusValidator.ts`

## Use Cases

- Plan up to 30 blank days without manually saving each keyword.
- Fill only the blank days after manually adding a few priority topics.
- Move between months to see future plans and past written article history.
- Filter the Topics page to show scheduled topics.
- Place a saved or failed topic on a blank calendar day without creating a duplicate topic.
- Add or move a saved topic from the Topics page through the shared topic dialog.
- Keep similar keyword ideas from turning into competing articles.
- Click a scheduled topic to open editing, repurposing, writing, article preview, calendar removal, and delete actions.
- Reach the topic actions before scrolling through a long brief.
- Open a written article from its scheduled day and use the existing preview, publish, zip, edit, and delete controls.
- See older written articles on the day their topic was created, with article creation date as the fallback.
- Remove a topic from the calendar without deleting the topic from the workspace.
- Add a one-off manual keyword to a specific day.

## File Tree

```text
src/app/calendar/
src/app/api/topics/batch-plan/
src/features/workspace/components/Calendar*
src/features/workspace/components/TopicActionDialog.tsx
src/features/workspace/components/TopicCalendarScheduleControl.tsx
src/features/workspace/types/calendar/
src/features/workspace/utils/*Calendar*
src/server/topics/*TopicCandidate*
src/server/topics/*TopicExpansion*
convex/topics/*Scheduled*
convex/topics/backfillWrittenTopicCalendarDates.ts
docs/content-calendar.md
```
