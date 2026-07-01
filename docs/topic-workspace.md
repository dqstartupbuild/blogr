# Topic Workspace

## What It Does

The workspace lets a user paste a keyword, save it as a topic, come back later, and start a blog from that topic.

The Topics tab can also find search-informed topic ideas. Users review suggested ideas in a checkbox queue before saving them, and saved discovered topics carry a writing brief in topic notes.

The Calendar tab plans one keyword per day for the next 30 days. Users can add a topic to an empty day, remove a topic from a day, fill blank days in one batch, edit or refresh briefs, write articles, and open written articles from the calendar.

Users can filter the topic list by status: all, saved, writing, written, or failed. Users can also filter blogs by all, unpublished, published, or topic.

The Topics and Articles tabs load 10 rows per page. Previous and Next controls move through matching rows without loading the whole list into the tab.

Each topic row can show or refresh its saved search brief. Manual topics can get a brief later with **Find brief**.

The first screen is the usable workspace, not a landing page. It stays focused on topics and blogs, while product setup lives in Settings.

The blog preview opens from a fixed right-side sidebar button, so users can read the selected article without scrolling past a long topic or blog list. The preview renders generated MDX as readable blog content and exposes **Publish** and **Zip** actions for the selected blog. The selected preview stays tied to the article the user clicked; changing pages, filters, or live query results does not automatically replace it with the first visible article.

The dashboard is scoped to the active product workspace. Switching workspaces changes which product profile, topics, blogs, and previews are shown.

Dashboard recent article rows open the same article preview drawer. Editing still uses the explicit editor link from the article preview or article list.

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

The user can create or switch product workspaces, scan a product site, save topics, start writing, browse generated blogs, and open the editor. Topic and blog list queries include the active product ID, current filters, search text, and Convex pagination options, so each workspace keeps its own records and the tab only receives the current page.

Article previews merge the explicitly selected article, the current page, and dashboard recent articles with `mergePreviewBlogs`. In live workspaces, `useLiveWorkspace` also queries the selected article directly, which keeps the drawer stable when the selected article is not part of the current paginated page.

Topic discovery calls `POST /api/topics/discover`, runs Apify Google Search Scraper, turns SERP signals into topic ideas and briefs, and saves selected ideas through the same `createTopic` mutation.

The discovery dialog also exposes non-topic insights as planning rows. Users can save People Also Ask questions, content gaps, comparison ideas, clusters, refresh suggestions, AI answer notes, and difficulty notes as topics with notes. Content gap rows save the actual gap title as the topic, while the row badge shows that it came from a gap.

The calendar batch flow calls `POST /api/topics/batch-plan`, dedupes discovery outputs and product-niche expansion ideas into canonical topic candidates, and saves them through `createScheduledTopicBatch`. It fills only blank dates in the 30-day window and never replaces already scheduled topics. Scheduled topics and topic rows open the shared topic action dialog with edit, repurpose, write, article preview, calendar scheduling, removal, and delete controls.

Blog rows and the blog editor expose **Find refresh ideas** for existing blogs. In the blog list, users can filter unpublished and published posts, then save a refresh plan as a topic. In the editor, users can save the plan or add it directly to the draft.

The Settings tab includes product setup, article settings, and a **Publishing** panel for the active product. The Publishing panel includes a setup guide, a copyable Codex prompt for the receiving app, webhook details, and the per-product connection fields. The selected blog preview exposes **Publish**, which sends the current blog to that product's saved webhook destination through `POST /api/blogs/publish`.

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
- `src/features/workspace/components/BlogPreviewSidebar.tsx`
- `src/features/workspace/components/BlogPreviewPanel.tsx`
- `src/features/workspace/components/DashboardRecentArticles.tsx`
- `src/features/workspace/components/DashboardRecentArticleRow.tsx`
- `src/features/workspace/components/MarkdownPreview.tsx`
- `src/features/workspace/components/TopicDiscoveryLauncher.tsx`
- `src/features/workspace/components/TopicDiscoveryDialog.tsx`
- `src/features/workspace/components/TopicDiscoveryPlanList.tsx`
- `src/features/workspace/components/TopicActionDialog.tsx`
- `src/features/workspace/components/TopicCalendarScheduleControl.tsx`
- `src/features/workspace/components/TopicBriefDialog.tsx`
- `src/features/workspace/components/BlogRefreshDialog.tsx`
- `src/features/workspace/components/BlogPublishingIntegrationPanel.tsx`
- `src/features/workspace/components/BlogPublishButton.tsx`
- `src/features/workspace/components/CalendarPanel.tsx`
- `src/features/workspace/components/CalendarGrid.tsx`
- `src/features/workspace/components/CalendarDayCell.tsx`
- `src/features/workspace/components/FilteredBlogList.tsx`
- `src/features/workspace/components/FilteredTopicList.tsx`
- `src/features/workspace/components/ListPaginationControls.tsx`
- `src/features/workspace/utils/mergePreviewBlogs.ts`
- `src/app/api/topics/discover/route.ts`
- `src/server/topics/generateTopicIdeas.ts`
- `src/server/apify/runGoogleSearchScraper.ts`
- `src/features/workspace/hooks/useCursorPagination.ts`
- `src/features/workspace/hooks/useLiveWorkspaceSwitcher.ts`
- `src/features/workspace/hooks/useDemoWorkspace.ts`
- `src/features/workspace/hooks/useLiveWorkspace.ts`
- `convex/products/getProductWorkspaces.ts`
- `convex/products/setActiveProductWorkspace.ts`
- `convex/products/createProductWorkspace.ts`
- `convex/topics/createTopic.ts`
- `convex/topics/createScheduledTopic.ts`
- `convex/topics/createScheduledTopicBatch.ts`
- `convex/topics/listScheduledTopics.ts`
- `convex/topics/updateTopicScheduledDate.ts`
- `convex/topics/listTopics.ts`
- `convex/blogs/listBlogs.ts`
- `convex/blogs/listBlogTopicKeywords.ts`
- `convex/workspaces/getWorkspaceSummary.ts`

## Use Cases

- Save keyword ideas as they come up.
- Find search-informed topic ideas from a product profile and optional seed keyword.
- Review noisy search results before saving topics.
- Save search gaps, refresh notes, AI answer notes, and difficulty notes as planning topics.
- Filter topics by status.
- Filter blogs by published status.
- Browse topics and blogs in pages of 10.
- Find or refresh a search brief for a saved topic.
- Find refresh ideas for a saved blog.
- Add a refresh plan to an existing blog draft.
- Open and close the article preview without losing your place in a long list.
- Keep a previewed article open while changing filters or pages.
- Preview a recent dashboard article without leaving the dashboard.
- Update product details from Settings instead of repeating that form on every tab.
- Connect publishing for each product from Settings.
- Publish a generated blog to a connected blog app.
- Keep topics separate from finished blogs.
- Plan the next 30 days of scheduled keywords from `/calendar`.
- Fill empty calendar days without overwriting days that already have topics.
- Remove a topic from the calendar while keeping the topic in the workspace.
- Open a scheduled topic's written article preview from the calendar.
- Revisit the blog list on `/blogs`.
- Keep each product or client project separate.
- Check the whole layout before auth keys are available.

## File Tree

```text
src/app/page.tsx
src/app/blogs/page.tsx
src/app/calendar/page.tsx
src/features/workspace/components/
src/features/workspace/hooks/
src/features/workspace/mappers/
src/features/workspace/types/
src/app/api/topics/discover/
src/app/api/topics/batch-plan/
src/server/apify/
src/server/topics/
convex/products/
convex/workspaceSelections/
convex/topics/
convex/blogs/
convex/workspaces/
```
