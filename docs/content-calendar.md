# Content Calendar

## What It Does

The content calendar plans one keyword per day for the next 30 days. The window always starts today. There is no date picker.

Users can add a topic to an empty day, remove a topic from a day, delete a topic, edit or refresh a brief, repurpose source text, write an article, and open a written article preview from the calendar. Calendar topics are normal topic records with a scheduled date, so the existing Topics and Articles workflows still work.

The calendar renders as a seven-column weekday board. The 30-day window is aligned to the correct weekday with muted blank slots before and after the scheduled range.

The **Fill empty days** action creates scheduled topic records only. It does not write full blog drafts. It fills blank days in the 30-day window and leaves already-filled days alone.

## How It Works

Scheduled topics are stored in the existing `topics` table with optional calendar and dedupe fields:

- `scheduledDate`
- `sourceType`
- `canonicalKeyword`
- `intentKey`

`useLiveWorkspace` loads scheduled topics with `listScheduledTopics` when the workspace is in calendar mode. It also loads existing topic keywords and article keywords so batch planning can avoid topics that already exist in the workspace.

When the user clicks **Fill empty days**, the client sends the blank dates, product profile, existing topics, and existing article keywords to `POST /api/topics/batch-plan`. The route runs Google discovery through Apify, generates topic discovery data, converts normal ideas, gaps, questions, comparison ideas, AI answer notes, and difficulty notes into one shared candidate shape, groups similar candidates, and returns one unique candidate per blank date when enough good candidates exist.

The client saves returned candidates through `createScheduledTopicBatch`. The mutation re-checks ownership, occupied dates, existing keywords, article keywords, and intent keys before inserting rows. If the calendar changed while planning was running, filled dates are skipped instead of overwritten.

## Dedupe Behavior

The batch planner does not save every discovery bucket as a separate article. It first normalizes planner prefixes such as “Review difficulty for” and “Improve AI answer coverage for,” then builds an `intentKey` from the meaningful topic tokens.

Similar candidates are grouped before scheduling. For example, a question, content gap, and difficulty note about the same pricing-page intent become one scheduled topic with merged notes instead of three articles competing for the same keyword.

If there are not enough unique topics to fill every blank day, the calendar saves the unique topics it found and leaves the rest blank.

## Relevant Code

- `src/app/calendar/page.tsx`
- `src/app/api/topics/batch-plan/route.ts`
- `src/app/api/topics/batch-plan/schema.ts`
- `src/features/workspace/components/CalendarPanel.tsx`
- `src/features/workspace/components/CalendarGrid.tsx`
- `src/features/workspace/components/CalendarDayCell.tsx`
- `src/features/workspace/components/CalendarTopicCard.tsx`
- `src/features/workspace/components/CalendarAddTopicDialog.tsx`
- `src/features/workspace/hooks/useLiveWorkspace.ts`
- `src/features/workspace/hooks/useDemoWorkspace.ts`
- `src/server/topics/buildTopicCandidatesFromDiscovery.ts`
- `src/server/topics/buildUniqueTopicCandidates.ts`
- `src/server/topics/groupTopicCandidates.ts`
- `src/server/topics/mergeTopicCandidateGroup.ts`
- `src/server/topics/filterDuplicateTopicCandidates.ts`
- `convex/topics/listScheduledTopics.ts`
- `convex/topics/createScheduledTopic.ts`
- `convex/topics/createScheduledTopicBatch.ts`
- `convex/topics/updateTopicScheduledDate.ts`

## Use Cases

- Plan the next 30 days of content without manually saving each keyword.
- Fill only the blank days after manually adding a few priority topics.
- Keep similar keyword ideas from turning into competing articles.
- Open a written article from its scheduled day and use the existing preview, publish, zip, edit, and delete controls.
- Remove a topic from the calendar without deleting the topic from the workspace.
- Add a one-off manual keyword to a specific day.

## File Tree

```text
src/app/calendar/
src/app/api/topics/batch-plan/
src/features/workspace/components/Calendar*
src/features/workspace/types/calendar/
src/features/workspace/utils/*Calendar*
src/server/topics/*TopicCandidate*
convex/topics/*Scheduled*
docs/content-calendar.md
```
