# Scan a product website

Open a project's Settings page, enter its website and niche, then run the scan. Blogr saves the product profile, links, colors, and usable images in the local workspace. The profile helps later article generation. You can edit the saved details by hand.

Scanning needs the optional `FIRECRAWL_API_KEY` and network access. The scan route checks that the project still exists and has not changed before it commits the result. Downloaded images are stored under `BLOGR_HOME/media` and served through the local media API. Image downloads reject private network destinations and oversized or unsupported files.

The interface first saves the entered site, so a scan failure does not erase the site you entered. The active project controls which profile is shown and changed. See [Local Blogger application](local-application.md) for storage, backup, and recovery.

Relevant code: `src/app/api/product/scan/route.ts`, `src/server/product/scanAndStoreProductWebsite.ts`, `src/local/server/actions/saveProductScan.ts`, and `src/local/server/storeLocalImage.ts`.
