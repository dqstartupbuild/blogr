# Content Calendar

## What It Does

The content calendar shows a real month view for the active workspace. It opens on the current month, with simple previous and next month buttons. There is no date picker.

Users can add a new topic to an empty day, add an existing saved topic to an empty day, click a scheduled topic to open its action dialog, move a topic to another open day, remove a topic from a day, delete a topic, edit or refresh a brief, repurpose source text, write an article, and open a written article preview from the calendar. Calendar topics are normal topic records with a scheduled date, so the existing Topics and Articles workflows still work.

Written and published article topics stay visible on the calendar as history. Existing articles are backfilled onto the calendar through their linked topic. The topic creation day is used first, and the article creation day is used as a fallback.

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

Scheduled planning topics can be removed from the calendar without deleting the topic. Written and published topics with articles stay on the calendar as article history instead of offering calendar removal.

Topics on the calendar use the `scheduled` status. New calendar topics are saved with `status: "scheduled"`, and older records that still have `status: "saved"` plus a `scheduledDate` are treated as Scheduled in the UI and topic filters.

When the user clicks **Fill empty days**, the client sends up to 30 blank dates from today forward, the product profile, existing topics, and existing article keywords to `POST /api/topics/batch-plan`. The planner asks the configured writer model for a deliberately oversized pool of concise customer-language keyword candidates. The prompt requires a mix of short and long-tail phrases, different reader problems and goals, and no claims about search volume, difficulty, rankings, or search intent.

The planner rejects overlong and known template-like phrases, groups similar AI suggestions, and removes candidates that overlap existing topics or articles. If AI generation is unavailable or returns too few usable candidates, a bounded natural-language fallback supplies the missing dates. Calendar completion does not depend on external research, so every requested blank date still receives a keyword.

After the keywords are selected, the planner sends those exact phrases through the existing Apify Google Search Scraper in one batch. That research is used only to enrich each topic's writing brief with People Also Ask questions, related searches, and ranking sources. Research failure leaves the selected keywords unchanged and never reduces the number of filled dates.

The client saves returned candidates through `createScheduledTopicBatch`. The mutation re-checks ownership, occupied dates, existing keywords, article keywords, and intent keys before inserting rows. If the calendar changed while planning was running, filled dates are skipped instead of overwritten.

When a live workspace opens the calendar, `backfillWrittenTopicCalendarDates` repairs linked article topics. It sets a missing `scheduledDate` from `topic.createdAt`, falls back to `blog.createdAt`, and updates topic search text so calendar history can be queried normally. It also synchronizes the topic to Published when the linked article is published, including older records created before publication status syncing existed. This does not create article drafts or duplicate topics.

## Dedupe Behavior

The batch planner builds an `intentKey` from the meaningful tokens in every AI keyword candidate.

Similar AI candidates are grouped before scheduling so small wording changes do not become separate articles. Existing topic and article keywords are checked again before the batch is saved.

The AI prompt requests more candidates than the calendar needs so deduplication can keep the strongest mix. The fallback exists only to preserve mandatory calendar completion when AI is unavailable; fallback notes clearly tell the user to run or review the keyword-specific brief before writing.

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
- `src/server/topics/generateAiCalendarKeywordCandidates.ts`
- `src/server/topics/buildCalendarKeywordSuggestionPrompt.ts`
- `src/server/topics/isUsableCalendarKeyword.ts`
- `src/server/topics/buildFallbackCalendarKeywordCandidates.ts`
- `src/server/topics/researchCalendarKeywordCandidates.ts`
- `src/server/topics/buildCalendarKeywordResearchNotes.ts`
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
- Move between months to see future plans and past written or published article history.
- See Published on a calendar topic as soon as its linked article is published.
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
src/server/topics/*CalendarKeyword*
src/server/topics/*TopicCandidate*
convex/topics/*Scheduled*
convex/topics/backfillWrittenTopicCalendarDates.ts
docs/content-calendar.md
```
