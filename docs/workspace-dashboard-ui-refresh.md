# Workspace Dashboard UI Refresh

## What Changed

The workspace now uses a sidebar layout with a dashboard, topic table, article table, and richer article editor surfaces. The app still uses the same workflow:

1. Save or discover a topic.
2. Write an article from that topic.
3. Review or edit the article.
4. Export or publish the article.

Article and topic delete actions are available in each table row. Article deletion removes the article and returns its linked topic to a saved state when one exists. Opening an article is done by pressing the article title.

## Main Files

- `src/features/workspace/components/WorkspaceShell.tsx` renders the shared sidebar workspace frame.
- `src/features/workspace/components/WorkspaceSidebar.tsx` renders the main navigation.
- `src/features/workspace/components/DashboardPanel.tsx` renders the dashboard.
- `src/features/workspace/components/DashboardStatsGrid.tsx` renders workspace counts.
- `src/features/workspace/components/DashboardRecentArticles.tsx` renders recent articles.
- `src/features/workspace/components/TopicsPanel.tsx` renders the updated topic workspace.
- `src/features/workspace/components/FilteredTopicList.tsx` handles topic search and status filtering.
- `src/features/workspace/components/TopicList.tsx` and `src/features/workspace/components/TopicRow.tsx` render the topic table.
- `src/features/workspace/components/BlogsPanel.tsx` renders the updated article workspace.
- `src/features/workspace/components/FilteredBlogList.tsx` handles article search, status filtering, and topic filtering.
- `src/features/workspace/components/BlogList.tsx` and `src/features/workspace/components/BlogRow.tsx` render the article table.
- `src/features/workspace/components/BlogEditorView.tsx` renders the editor in the shared sidebar layout.
- `src/features/workspace/components/BlogDeleteButton.tsx` renders the article delete action.
- `src/features/workspace/components/TopicDeleteButton.tsx` renders the topic delete action.

## Derived Stats

The dashboard and preview panels derive stats from existing data:

- Topic count comes from the current `topics` list.
- Article count comes from the current `blogs` list.
- Published count comes from articles with `status === "published"`.
- Image count comes from article feature images and stored image URLs.
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

## Delete Actions

Topic deletion uses the existing Convex `topics/deleteTopic` mutation. Article deletion uses `blogs/deleteBlog`, which checks the current user and workspace before deleting. When the deleted article is linked to a topic, that topic is marked saved again so it can be used for a new article later.
