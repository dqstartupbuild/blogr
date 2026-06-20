# Theme

## What It Does

The application uses a strict light theme with only pure white and pure black.

## Color Rule

Only these colors are allowed in the app theme:

- `#ffffff`
- `#000000`

UI backgrounds are white, text and borders are black, primary actions are black with white text, and secondary actions are white with black text.

## Images

Generated image prompts ask for pure black and pure white only. Demo content does not show colorful preview images.

## Relevant Code

- `src/app/globals.css`
- `src/features/workspace/components/*`
- `src/features/auth/components/*`
- `src/server/blog/buildImagePrompts.ts`
