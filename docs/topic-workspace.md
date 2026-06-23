# Topic Workspace

## What It Does

The workspace lets a user paste a keyword, save it as a topic, come back later, and start a blog from that topic.

The Topics tab can also find search-informed topic ideas. Users review suggested ideas in a checkbox queue before saving them, and saved discovered topics carry a writing brief in topic notes.

The first screen is the usable workspace, not a landing page. It stays simple: product, topics, blogs, preview.

The blog preview renders generated MDX as readable blog content, so users can browse posts without reading raw markdown.

The dashboard is scoped to the active product workspace. Switching workspaces changes which product profile, topics, blogs, and previews are shown.

## How It Works

Without Clerk and Convex keys, `DemoWorkspaceView` shows local demo data so the layout can be checked immediately. `AUTH_DISABLED_FOR_PREVIEW=true` also forces demo mode so preview branches can be opened without waiting on Clerk or Convex auth.

With Clerk and Convex keys, `LiveWorkspaceView` waits for Clerk and Convex auth before touching Convex queries. Signed-out users see a simple sign-in state. Users who are signed in to Clerk but not connected to Convex see a simple connection message instead of a page crash. Signed-in users with a valid Convex token get Convex queries and mutations:

- `listTopics`
- `createTopic`
- `listBlogs`
- `getCurrentProduct`
- `getProductWorkspaces`
- `setActiveProductWorkspace`
- `createProductWorkspace`

The user can create or switch product workspaces, scan a product site, save topics, start writing, browse generated blogs, and open the editor. Topic and blog queries include the active product ID, so each workspace keeps its own records.

Topic discovery calls `POST /api/topics/discover`, runs Apify Google Search Scraper, turns SERP signals into topic ideas and briefs, and saves selected ideas through the same `createTopic` mutation.

## Relevant Code

- `src/features/workspace/components/WorkspaceView.tsx`
- `src/features/workspace/components/WorkspacePage.tsx`
- `src/features/workspace/components/DemoWorkspaceView.tsx`
- `src/features/workspace/components/LiveWorkspaceView.tsx`
- `src/features/workspace/components/LiveWorkspaceContent.tsx`
- `src/features/workspace/components/LiveWorkspaceLoadingView.tsx`
- `src/features/workspace/components/SignedOutWorkspaceView.tsx`
- `src/features/workspace/components/WorkspaceConnectionIssueView.tsx`
- `src/features/workspace/components/WorkspaceContent.tsx`
- `src/features/workspace/components/WorkspaceSwitcher.tsx`
- `src/features/workspace/components/MarkdownPreview.tsx`
- `src/features/workspace/components/TopicDiscoveryLauncher.tsx`
- `src/features/workspace/components/TopicDiscoveryDialog.tsx`
- `src/app/api/topics/discover/route.ts`
- `src/server/topics/generateTopicIdeas.ts`
- `src/server/apify/runGoogleSearchScraper.ts`
- `src/features/workspace/hooks/useLiveWorkspaceSwitcher.ts`
- `src/features/workspace/hooks/useDemoWorkspace.ts`
- `src/features/workspace/hooks/useLiveWorkspace.ts`
- `convex/products/getProductWorkspaces.ts`
- `convex/products/setActiveProductWorkspace.ts`
- `convex/products/createProductWorkspace.ts`
- `convex/topics/createTopic.ts`
- `convex/topics/listTopics.ts`

## Use Cases

- Save keyword ideas as they come up.
- Find search-informed topic ideas from a product profile and optional seed keyword.
- Review noisy search results before saving topics.
- Keep topics separate from finished blogs.
- Revisit the blog list on `/blogs`.
- Keep each product or client project separate.
- Check the whole layout before auth keys are available.

## File Tree

```text
src/app/page.tsx
src/app/blogs/page.tsx
src/features/workspace/components/
src/features/workspace/hooks/
src/features/workspace/mappers/
src/features/workspace/types/
src/app/api/topics/discover/
src/server/apify/
src/server/topics/
convex/products/
convex/workspaceSelections/
convex/topics/
```
