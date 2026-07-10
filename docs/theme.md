# Theme

## What It Does

The application uses a strict light theme with only pure white and pure black.

## Color Rule

Only these colors are allowed in the app theme:

- `#ffffff`
- `#000000`

UI backgrounds are white, text and borders are black, primary actions are black with white text, and secondary actions are white with black text.

## Blog Images

The app UI stays black and white. Generated blog image prompts are different:
they use the scanned product context, audience, niche, and brand colors so the
images feel tied to the user's product instead of generic.

The image set has one feature image plus supporting images for the body. The
article is written first, then an image-planning reviewer chooses useful
sections and writes section-specific prompts. The prompts ask for realistic
editorial images with no readable text, fake UI text, captions, watermarks,
random symbols, or unrelated objects unless the chosen image style explicitly
allows text.

Each generated image keeps the section heading selected by the planner. Body
images are inserted directly under those headings. If a heading cannot be
matched, the fallback placement spreads images across the full article instead
of filling the first few sections.

## Relevant Code

- `src/app/globals.css`
- `src/features/workspace/components/*`
- `src/features/auth/components/*`
- `src/server/blog/planBlogImagePrompts.ts`
- `src/server/blog/buildImagePlannerPrompt.ts`
- `src/server/blog/buildProductVisualContext.ts`
- `src/server/blog/normalizeBlogMdxImages.ts`
- `src/server/blog/insertMissingSupportingImages.ts`
