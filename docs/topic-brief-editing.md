# Topic Brief Editing

## What changed

Topic briefs can be edited by hand before an article is written. A user can still ask the app to find or refresh a brief, then adjust the notes before writing. Once the article exists, the brief becomes read-only so the source plan stays tied to the article that was created from it.

## How it works

- `TopicBriefButton` opens the brief dialog and says `Edit brief` when notes already exist.
- `TopicBriefDialog` shows the brief in a textarea, lets the user save changes, and keeps the existing refresh action.
- Written topics show `View brief` instead of `Edit brief`. The dialog removes its save and refresh actions and displays the saved notes as read-only.
- `saveTopicBrief` is passed through the workspace topic list components so live and preview workspaces share the same UI.
- Live workspaces save the text with the existing Convex `updateTopicNotes` mutation.
- Preview workspaces update their local topic state.
- The API route and Convex mutations enforce the lock as well, including when an article finishes while a brief search is still running.

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
