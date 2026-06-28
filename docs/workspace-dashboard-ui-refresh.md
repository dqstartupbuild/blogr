# Workspace Dashboard UI Refresh

## What Changed

The workspace now uses a sidebar layout with a dashboard, topic table, article table, and richer article preview surfaces. The app still uses the same workflow:

1. Save or discover a topic.
2. Write an article from that topic.
3. Review or edit the article.
4. Export or publish the article.

No mockup-only actions were added. Live article links are not shown because this app does not currently expose those URLs.

On mobile, the workspace frame uses a compact top header for the logo, workspace selector, workspace creation shortcut, and account action. The main Dashboard, Topics, Articles, and Settings links move into a fixed bottom navbar so primary navigation stays reachable without taking over the top of the page.

## Main Files

- `src/features/workspace/components/WorkspaceShell.tsx` renders the shared sidebar workspace frame.
- `src/features/workspace/components/WorkspaceSidebar.tsx` renders the desktop sidebar, mobile header, and mobile bottom navigation.
- `src/features/workspace/components/WorkspaceSidebarLink.tsx` renders links in sidebar form on desktop and bottom-navbar form on mobile.
- `src/features/workspace/components/WorkspaceSwitcher.tsx` supports the regular workspace card and the compact mobile header selector.
- `src/features/workspace/components/DashboardPanel.tsx` renders the dashboard.
- `src/features/workspace/components/DashboardStatsGrid.tsx` renders workspace counts.
- `src/features/workspace/components/DashboardRecentArticles.tsx` renders recent articles.
- `src/features/workspace/components/TopicsPanel.tsx` renders the updated topic workspace.
- `src/features/workspace/components/FilteredTopicList.tsx` handles topic search and status filtering.
- `src/features/workspace/components/TopicList.tsx` and `src/features/workspace/components/TopicRow.tsx` render the topic table.
- `src/features/workspace/components/BlogsPanel.tsx` renders the updated article workspace.
- `src/features/workspace/components/FilteredBlogList.tsx` handles article search, status filtering, and topic filtering.
- `src/features/workspace/components/BlogList.tsx` and `src/features/workspace/components/BlogRow.tsx` render the article table.
- `src/features/workspace/components/BlogPreviewPanel.tsx` renders the richer article preview drawer.
- `src/features/workspace/components/BlogEditorView.tsx` renders the editor in the shared sidebar layout.
- `src/features/workspace/components/DeleteActionButton.tsx` renders confirmed delete actions.
- `convex/blogs/deleteBlog.ts` deletes live articles and resets their source topic.
- `convex/topics/deleteTopic.ts` deletes live topics and clears article back-references.

## Derived Stats

The dashboard and preview panels derive stats from existing data:

- Topic count comes from the live workspace summary query, or the full demo topic list in preview mode.
- Article count comes from the live workspace summary query, or the full demo blog list in preview mode.
- Published count comes from articles with `status === "published"`.
- Image count comes from unique article feature images and stored image URLs.
- Word count comes from article MDX text after frontmatter and markdown noise are removed.
- Heading count comes from markdown heading lines in article MDX.
- Read time is estimated from word count.

The helpers live in `src/features/workspace/utils/` and are split by purpose.

## Routes

- `/` opens the new dashboard.
- `/topics` opens the topic workspace.
- `/blogs` opens the article workspace.
- `/settings` opens settings.
- `/blogs/[blogId]` keeps the existing editor workflow with the refreshed layout.

## Delete And Preview Behavior

Articles and topics now have Delete actions with a confirmation prompt. Deleting an article removes it from Articles and moves its source topic back to a saved state when that topic is still present. Deleting a topic leaves any already-created article in Articles.

In the Articles table, selecting an article title opens preview mode only. Dashboard recent article rows also open preview mode. Editing is available through the explicit Edit button. The floating Preview button is not shown on the Articles list anymore, but it is still available in the article editor.
