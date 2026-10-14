# Settings

Settings are split into sections. On wide screens they're listed on the left, and on phones they're tabs. Each section has its own address, like `/settings#writing`, so reload and back keep your place. Unsaved edits survive switching sections but aren't saved until you press that section's save button. On long forms the save button stays at the bottom of the screen.

- **Overview** shows all your saved settings at a glance and flags missing product basics or empty site links.
- **Product**: **Scan your site** (needs `FIRECRAWL_API_KEY`) fills in product details, links, colors, and images. You can edit everything by hand: basics, features, prices, offers, app links, and brand colors used in generated images.
- **Writing**: article style, global writing rules, internal links per article, up to 5 partner or affiliate links the writer may use when they help, image style and count, and extras (table of contents, YouTube video, call to action, infographics, similar products, first person).
- **Site links**: choose which scanned pages the writer may link to, and refresh them from your site.
- **Publishing**: connect your blog ([publishing](publishing.md)).
- **Calendar**: the queue days used by Quick fill and AI fill.
- **Backups**: back up, restore, or delete ([workspaces and backups](workspaces-and-backups.md)).

Each form checks that the workspace hasn't changed in another tab before saving, and keeps your edits if it has.

Relevant code: `src/features/workspace/components/SettingsPanel.tsx`, `src/features/workspace/constants/settingsSections.ts`, `src/features/workspace/hooks/useSettingsSection.ts`, and `src/app/api/product/`.
