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

The prompts ask for realistic editorial images with no readable text, fake UI
text, captions, watermarks, random symbols, or unrelated objects.

## Relevant Code

- `src/app/globals.css`
- `src/features/workspace/components/*`
- `src/features/auth/components/*`
- `src/server/blog/buildImagePrompts.ts`
- `src/server/blog/buildBlogImagePrompt.ts`
- `src/server/blog/buildProductVisualContext.ts`
