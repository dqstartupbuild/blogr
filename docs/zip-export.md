# Download an article ZIP

Choose **Download ZIP** from an article. Blogr packages the current editor draft as an MDX file, `metadata.json`, a README, and image files it can retrieve. Managed local images are read directly from the constrained `BLOGR_HOME/media` folder and referenced with ZIP-relative paths in the MDX. External images are fetched with the same public-image safety checks.

The ZIP is a portable article package, not a whole-workspace backup. Use **Download backup** in Settings to save projects, topics, articles, versions, settings, and managed images together. ZIP download works without an AI key or account.

Relevant code: `src/app/api/blogs/download/route.ts`, `src/server/download/buildBlogZip.ts`, and `src/local/server/buildLocalExport.ts`.
