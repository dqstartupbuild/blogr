# Topic Brief Editing

## What changed

Topic briefs can now be edited by hand. A user can still ask the app to find or refresh a brief, then adjust the notes before writing an article.

## How it works

- `TopicBriefButton` opens the brief dialog and says `Edit brief` when notes already exist.
- `TopicBriefDialog` shows the brief in a textarea, lets the user save changes, and keeps the existing refresh action.
- `saveTopicBrief` is passed through the workspace topic list components so live and preview workspaces share the same UI.
- Live workspaces save the text with the existing Convex `updateTopicNotes` mutation.
- Preview workspaces update their local topic state.

## Source references

- `src/features/workspace/components/TopicBriefDialog.tsx`
- `src/features/workspace/components/TopicBriefButton.tsx`
- `src/features/workspace/hooks/useLiveWorkspace.ts`
- `src/features/workspace/hooks/useDemoWorkspace.ts`
- `src/features/workspace/types/SaveTopicBrief.ts`
- `convex/topics/updateTopicNotes.ts`

## File tree

```text
src/features/workspace/components/
  TopicBriefButton.tsx
  TopicBriefDialog.tsx
  TopicActionDialog.tsx
  TopicRow.tsx
  TopicList.tsx
  FilteredTopicList.tsx
  TopicsPanel.tsx
src/features/workspace/hooks/
  useDemoWorkspace.ts
  useLiveWorkspace.ts
src/features/workspace/types/
  SaveTopicBrief.ts
docs/
  topic-brief-editing.md
```
