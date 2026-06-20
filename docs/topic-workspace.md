# Topic Workspace

## What It Does

The workspace lets a user paste a keyword, save it as a topic, come back later, and start a blog from that topic.

The first screen is the usable workspace, not a landing page. It stays simple: product, topics, blogs, preview.

## How It Works

Without Clerk and Convex keys, `DemoWorkspaceView` shows local demo data so the layout can be checked immediately.

With Clerk and Convex keys, `LiveWorkspaceView` waits for Clerk before touching Convex. Signed-out users see a simple sign-in state. Signed-in users get Convex queries and mutations:

- `listTopics`
- `createTopic`
- `listBlogs`
- `getCurrentProduct`

The user can scan a product site, save topics, start writing, browse generated blogs, and open the editor.

## Relevant Code

- `src/features/workspace/components/WorkspaceView.tsx`
- `src/features/workspace/components/DemoWorkspaceView.tsx`
- `src/features/workspace/components/LiveWorkspaceView.tsx`
- `src/features/workspace/components/LiveWorkspaceContent.tsx`
- `src/features/workspace/components/LiveWorkspaceLoadingView.tsx`
- `src/features/workspace/components/SignedOutWorkspaceView.tsx`
- `src/features/workspace/components/WorkspaceContent.tsx`
- `src/features/workspace/hooks/useDemoWorkspace.ts`
- `src/features/workspace/hooks/useLiveWorkspace.ts`
- `convex/topics/createTopic.ts`
- `convex/topics/listTopics.ts`

## Use Cases

- Save keyword ideas as they come up.
- Keep topics separate from finished blogs.
- Revisit the blog list on `/blogs`.
- Check the whole layout before auth keys are available.

## File Tree

```text
src/app/page.tsx
src/app/blogs/page.tsx
src/features/workspace/components/
src/features/workspace/hooks/
src/features/workspace/mappers/
src/features/workspace/types/
convex/topics/
```
