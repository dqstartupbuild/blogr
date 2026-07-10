# Product Workspaces

## What It Does

Users can keep more than one product or project under the same account. One workspace is active at a time, and the active workspace appears in the dashboard header and the live blog editor header.

Changing the workspace does not merge data or reload the whole app. It changes the active product context, refreshes the current route, and lets the current page show that workspace's own product details, topics, blogs, and saved outputs.

## How It Works

The `products` table is the workspace record. Each product row stores the workspace profile, scanned site details, assets, links, writing context, blog generation settings, and publishing integration settings.

The `workspaceSelections` table stores the user's active `productId`. `getProductWorkspaces` returns all product workspaces and the active product ID. If the saved selection is missing, the newest product becomes the active workspace for that session.

Workspace-owned records store the product ID:

- `topics.productId`
- `blogs.productId`

Dashboard queries use the active product ID when listing topics and blogs. New topics, generated blogs, product scans, settings saves, publishing integration saves, and blog edits pass the active product ID into Convex mutations by default.

The active product's Settings tab shows site scanning, editable product details, article settings, and the publishing setup guide beside the connection fields. Product details include the product basics, features, pricing, offers, colors, and external app or extension links. Users can copy a Codex prompt for the receiving app, inspect the expected webhook path and sample payload, then save the deployed webhook URL and token on that product. Product setup is not repeated on the Topics or Blogs tabs.

The switcher is shared by the main dashboard and live blog editor. If a user switches workspaces while editing a blog, the app moves back to `/blogs` because the old blog ID may not belong to the new workspace.

Demo mode mirrors the same behavior with local state so the workspace flow can be checked without Clerk and Convex keys.

## Existing Content

Content created before product workspaces does not have a `productId`. Run the backfill mutation once for each user that has legacy content. It attaches old topics and blogs to the user's active product workspace. If the user has no product workspace yet, it creates an `Imported workspace`.

```bash
npx convex run migrations/backfillProductWorkspaceIds:backfillProductWorkspaceIds '{}' --identity '{"subject":"USER_ID"}'
```

Use the Clerk subject stored in existing `userId` fields for `USER_ID`.

## Relevant Code

- `convex/schema.ts`
- `convex/products/createProductWorkspace.ts`
- `convex/products/getProductWorkspaces.ts`
- `convex/products/setActiveProductWorkspace.ts`
- `convex/products/saveProductScan.ts`
- `convex/products/updateProductDetails.ts`
- `convex/products/updateBlogGenerationSettings.ts`
- `convex/products/updateBlogPublishingIntegration.ts`
- `convex/products/getBlogPublishingIntegration.ts`
- `convex/migrations/backfillProductWorkspaceIds.ts`
- `convex/workspaceSelections/saveWorkspaceSelection.ts`
- `convex/topics/createTopic.ts`
- `convex/topics/listTopics.ts`
- `convex/blogs/listBlogs.ts`
- `convex/blogs/upsertGeneratedBlog.ts`
- `src/features/workspace/hooks/useLiveWorkspaceSwitcher.ts`
- `src/features/workspace/hooks/useLiveWorkspace.ts`
- `src/features/workspace/hooks/useDemoWorkspace.ts`
- `src/features/workspace/components/WorkspaceSwitcher.tsx`
- `src/features/workspace/components/WorkspaceSelect.tsx`
- `src/features/workspace/components/WorkspaceCreateForm.tsx`
- `src/features/workspace/components/WorkspaceHeader.tsx`
- `src/features/workspace/components/BlogEditorHeader.tsx`
- `src/features/workspace/components/WorkspaceSettingsPanel.tsx`
- `src/features/workspace/components/ProductDetailsPanel.tsx`
- `src/features/workspace/components/BlogPublishingSetupGuide.tsx`

## Use Cases

- Write for more than one product without mixing topics or drafts.
- Switch from one client project to another while staying on the same dashboard page.
- Scan a different site for each workspace.
- Keep generated blogs and saved outputs attached to the product they were created for.
- Keep article style, image choices, and article extras separate per product.
- Publish each product to its own connected blog app.
- Create a blank workspace first, then fill in details when the site is ready.

## Source References

- Next.js App Router `useRouter` docs: `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-router.md`
- Next.js App Router `usePathname` docs: `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-pathname.md`
- Convex schema and indexes: `convex/schema.ts`

## File Tree

```text
convex/products/
convex/workspaceSelections/
convex/topics/
convex/blogs/
src/server/convex/references/
src/features/workspace/components/Workspace*
src/features/workspace/hooks/useLiveWorkspaceSwitcher.ts
src/features/workspace/hooks/useLiveWorkspace.ts
src/features/workspace/hooks/useDemoWorkspace.ts
src/features/workspace/types/ProductWorkspace.ts
src/features/workspace/types/BlogGenerationSettings.ts
src/features/workspace/types/WorkspaceSwitcherState.ts
```
