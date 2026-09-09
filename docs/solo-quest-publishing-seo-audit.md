# Solo Quest publishing and SEO audit

Date: September 9, 2026. Read-only audit of live Solo Quest, its production article record, the Solo Quest and Guppy repositories, and Blogr's integration prompt and receiver skill. No application code, database records, or deployments changed during this audit.

## Implementation status

The follow-up repair is implemented locally in Solo Quest and Blogr; the findings below describe the pre-repair live deployment. No deployment or article mutation was performed during implementation.

Solo Quest now renders feature images on article/index pages, emits article-specific metadata and safe BlogPosting JSON-LD, links the blog from navigation/footer, and serves dynamic sitemap, RSS, and llms discovery. Shared parsed Markdown heading logic fixes explicit IDs, duplicate title/TOC output, and the video-adjacent Finch heading. Original llms product guidance is preserved. Blogr's generated integration prompt and repository/installed skill references now explicitly require these behaviors and actual built-site acceptance checks.

Verification: 56 Solo Quest publishing tests, scoped ESLint, TypeScript, production build (Next 16.2.4), Blogr prompt test, Blogr typecheck, and skill validation passed. A local production server with public-query fixtures proved that adding an article after startup updates article/index/sitemap/feed/llms without rebuilding; changing a slug updates discovery and produces a 404 at the old slug; image-less metadata clears inherited social images; simulated query outages return 5xx from discovery routes. Desktop/mobile browser checks verified navigation, the mobile menu, article links, TOC jumps, and no horizontal overflow at 390px. The local image element and stable path are present; public production media returns 200, image/jpeg, 125981 bytes. Local image-byte loading could not be verified because local R2 settings are absent. Automatic approval review rejected retrieving the full production environment, so those secrets were not retrieved.

Deployment remains necessary for these local changes to reach the public site. Existing successfully published article/image data does not need republishing. The receiver schema/functions were not changed by this SEO repair.

## Outcome

Publication now succeeds, including feature-image delivery and durable storage. Solo Quest's article presentation and SEO integration are incomplete. The skill already requires several missing behaviors, but needs more explicit end-to-end acceptance checks and coverage for article social metadata, structured data, Markdown compatibility, and optional AI discovery.

Audited live article: https://www.soloquestxp.com/blog/best-gamified-habit-app-for-personal-goals

## Verified findings and priority

| Priority | Finding | Evidence | Required correction |
| --- | --- | --- | --- |
| High | Feature image is stored but never displayed | Production `blogArticles` has `imageKey` and a same-origin `imageUrl`; that URL returns 200, image/jpeg, 125981 bytes. Rendered article contains only mascot images. | Render the durable feature image on the article page with meaningful alt text, explicit dimensions/aspect ratio, and responsive sizing. Decide index thumbnail treatment explicitly. |
| High | Sitemap omits the published article | `/sitemap.xml` contains six core URLs, while `/feed.xml` and `/blog` include the article. Sitemap static-page lastmod timestamps predate publication. | Establish and verify explicit sitemap freshness after publishing and updating. Include `/blog`. Observe query failures rather than silently emitting an incomplete successful sitemap. |
| High | Social previews describe the homepage | Browser DOM has homepage og:title, og:description, og:url, og:type=website, and logo image; Twitter also inherits homepage values. | Emit article-specific Open Graph/Twitter metadata, absolute canonical and image URLs, type=article, and relevant publication/update dates. |
| High | Blog cannot be discovered from main site links | No `/blog` link in live homepage or the six core pages' shared navigation/footer. Article index is reachable directly. | Add a crawlable blog link within the existing navigation/footer system. |
| Medium | No article canonical | Browser DOM has no canonical; core site pages do have correct self-canonicals. | Add an absolute self-canonical to each article and the blog index. Preserve the canonical site origin across deployments. |
| Medium | No article structured data | Rendered browser DOM contains no JSON-LD on the article. | Add accurate BlogPosting data with headline, image, URL, publication/modification dates, and genuine author/publisher information. Do not invent an author from Blogr's source label. |
| Medium | Duplicate H1 and duplicate TOC | Page renders article.title as H1 and the Markdown contains another H1. Both generated and body TOCs appear. | Define ownership of title/TOC rendering; remove only a redundant leading body title/TOC using a deliberate parser policy. |
| Medium | Broken section anchors and missing heading | Live DOM has seven unresolved fragment links. `{#solo-quest-xp}` and similar text is visibly printed; the Finch H2 is absent following an iframe. | Support the sender's explicit heading-ID syntax safely, share one parsed heading/ID model across body and TOC, and preserve Markdown headings after allowed HTML/video blocks. |
| Medium | Blog index inherits generic metadata | `app/blog/page.tsx` defines no metadata. | Add index-specific title, description, canonical, and intentional social metadata. |
| Medium | Feed is incomplete RSS | Feed contains the new article but lacks the required channel description. `pubDate` uses updatedAt, changing publication dates on edits. | Add channel description; use original createdAt for pubDate. Add stable item GUIDs and feed autodiscovery. Categories/media are optional enhancements. |
| Medium | Backend failures can masquerade as missing content | `getPublicArticle` catches every error and returns null; `getPublicSummaries` catches every error and returns []. | Distinguish a real missing post from data-access failures; log safe errors and avoid caching transient failures as 404 or empty discovery output. |
| Lower | No visible article publication/update date or attribution | Neither is rendered by article page. | Add truthful dates and genuine author/editorial attribution where available, consistent with metadata. |
| Optional | llms.txt excludes the blog | Live file is static product guidance without `/blog`, feed, or article links. | If maintaining agent discovery, link to the blog/feed and optionally generate a bounded current article list. Preserve existing product guidance. |

## Feature-image chain

Blogr sends `image_url`. Solo's `lib/blog/handle-blog-publish-request.ts` copies it and sends `imageKey`/`imageUrl` to Convex. The production record confirms those fields were saved for the published article. The stable URL works publicly. `app/blog/[slug]/page.tsx` never reads `article.imageUrl`; it renders title, description, TOC, and body only. Frontmatter is stripped before body rendering, so a frontmatter featureImage is not an alternative visible image.

This is a receiver UI omission, not another transport or R2 failure.

## Sitemap diagnosis and limits

`app/sitemap.ts` already merges `getPublicSummaries()` and `createBlogSitemapEntries()`. `lib/blog/revalidate-blog-routes.ts` already calls `revalidatePath('/sitemap.xml')`. Therefore the problem is not simply that nobody added blog entries to the function.

The live response was a cache HIT containing only six core pages with timestamp 2026-09-09T15:49:54.644Z. The article was created at 2026-09-09T15:50:27.653Z. RSS contains the article. This is strong evidence of stale or incomplete generated sitemap output. The sitemap has no explicit dynamic or timed revalidation setting, and its query helper silently returns [] on any error. Next metadata sitemap routes are cached by default unless dynamic behavior is requested.

These observations do not by themselves prove why the existing invalidation failed in that deployed request. Verify the deployed route and regeneration behavior, with safe logs, before attributing it solely to cache configuration. A request-time sitemap or a tested bounded revalidation strategy should avoid reliance on an unverified implicit default. Static core pages also use new Date() for lastmod, reflecting generation rather than genuine content modification; use meaningful dates or omit them.

## Markdown compatibility

The receiver generates heading IDs from literal heading text, while the sender includes `{#custom-id}` syntax and links to those custom IDs. The attributes remain visible and change generated IDs, breaking the body TOC. Separately, a multiline iframe immediately followed by a Markdown heading without a blank line reproduces the missing-heading behavior in the existing react-markdown/rehypeRaw pipeline. Use safe parser normalization; do not solve this by enabling arbitrary executable MDX.

## Guppy comparison

Guppy explicitly renders ContentFeatureImage from its runtime post image. Its `lib/content/seo.ts` supplies canonical, SEO title/description, Open Graph/Twitter fields and BlogPosting JSON-LD. Sitemap and RSS merge runtime posts, and publication revalidates their paths.

Guppy is a useful reference, not a complete specification: its llms.txt is also static and does not enumerate new posts. Some older related-content, taxonomy and recent-post helpers in `lib/content/queries.ts` still use static content loaders and can omit runtime posts. Do not copy those omissions into Solo Quest.

## Existing instructions versus gaps

Already required by Blogr's prompt/skill: durable image copying and stable feature-image routes; separate SEO title and description; canonical metadata (skill); sitemap/feed inclusion; discovery integration; unique heading IDs; cache invalidation. Solo's missing presentation and incomplete discovery therefore violate or fail to finish existing expectations.

Make these explicit in the prompt and acceptance suite:

- A non-empty image_url must produce a visible article feature image and article social/structured-data image, not only a stored R2 object.
- Verify article SEO title, description, canonical, Open Graph, Twitter and BlogPosting output together from the same canonical record.
- Publish after the app is already running, then verify article, image URL, index, sitemap, and valid feed without rebuilding. Repeat for update and slug change.
- Assert actual DOM heading IDs and all fragment-link targets, including explicit IDs, duplicate titles, and a video immediately before a heading.
- Test that transient Convex errors do not become successful empty discovery responses or false permanent missing pages.
- Include existing llms.txt and Markdown representations when relevant, without promising Google ranking benefits.
- Keep repo-backed and database-backed posts consistent across all existing discovery surfaces.

## Relevant files

Solo Quest web root: `/Users/starship/GitHub/solo-quest-app/solo-quest-web/`

- `app/blog/[slug]/page.tsx`, `app/blog/page.tsx`
- `app/sitemap.ts`, `app/robots.ts`, `app/feed.xml/route.ts`, `public/llms.txt`
- `lib/blog/get-public-article.ts`, `lib/blog/get-public-summaries.ts`
- `lib/blog/handle-blog-publish-request.ts`, `lib/blog/revalidate-blog-routes.ts`
- `lib/blog/create-rss-feed.ts`, `lib/blog/heading-id.ts`, `lib/blog/extract-table-of-contents.ts`
- `components/blog/BlogMarkdown.tsx`

Guppy web root: `/Users/starship/GitHub/guppy/guppy-web/`

- `app/(content)/blog/[slug]/page.tsx`, `lib/content/seo.ts`
- `lib/blog-publisher/to-runtime-blog-post.ts`, `lib/content/queries.ts`
- `app/sitemap.ts`, `app/feed.xml/route.ts`

Blogr: `src/features/workspace/utils/buildBlogPublishingIntegrationPrompt.ts`, `codex-skills/blogr-publishing-receiver/references/next-app-router.md`, `references/mdx-rendering.md`, `references/acceptance.md`.

## What is already working

Live article and blog index return 200. The article uses its separate SEO title and meta description. Robots permits crawling and references the correct sitemap. Core pages return 200 with self-canonicals. Bare-domain HTTP/HTTPS redirects ultimately resolve to canonical HTTPS www. Production image storage and public image serving work. RSS and blog index can see the published article.

## Coverage limits

This audit verifies implementation and live discoverability, not actual search-engine index status, rankings, backlinks, Search Console sitemap submission, or field Core Web Vitals. No authenticated Search Console data or field performance report was inspected. No whole-site competitor/content fact-check was performed. Missing article schema is confirmed from rendered DOM; absence of schema on other core pages is not treated as a defect.

## Sources

- [Next sitemap caching behavior](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Google article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google publication dates](https://developers.google.com/search/docs/appearance/publication-dates)
- [RSS required channel elements](https://www.rssboard.org/rss-specification)
- [Google guidance on AI search and llms.txt](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide): Google does not use llms.txt for ranking or inclusion; it may still be maintained for other consumers.
