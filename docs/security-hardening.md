# Security Hardening

## What It Does

The app keeps server details out of public API error responses and avoids using the Next.js image optimizer as a broad remote image proxy.

Form validation and sign-in errors still return useful messages. Other server failures return a plain retry message to the browser, while the original error is logged on the server.

## How It Works

`getPublicErrorMessage` only exposes messages from `AuthError`, `PublicError`, and `ZodError`. All other errors use the same safe fallback message.

Each API route passes caught errors to `logRouteError` before returning the public response. Expected user-facing errors are not logged. Unexpected errors are logged so debugging details stay available on the server without sending provider errors, stack traces, tokens, URLs, or internal setup details to the browser.

`next.config.ts` does not configure a global remote image allow-list. The app's current `next/image` usage for generated article images is unoptimized, so external image URLs do not need to pass through the Next.js image optimizer.

## Use Cases

- Keep third-party API failure details out of browser responses.
- Preserve useful validation and sign-in messages.
- Avoid turning the deployed app into a general remote image optimizer endpoint.
- Keep server logs useful for self-hosted debugging.

## Relevant Code

- `next.config.ts`
- `src/server/http/PublicError.ts`
- `src/server/http/getPublicErrorMessage.ts`
- `src/server/http/logRouteError.ts`
- `src/app/api/blogs/generate/route.ts`
- `src/app/api/blogs/publish/route.ts`
- `src/app/api/blogs/download/route.ts`
- `src/app/api/blogs/[blogId]/route.ts`
- `src/app/api/blogs/[blogId]/download/route.ts`
- `src/app/api/blogs/[blogId]/regenerate-image/route.ts`
- `src/app/api/product/scan/route.ts`
- `src/app/api/product/links/refresh/route.ts`
- `src/app/api/topics/discover/route.ts`

## File Tree

```text
next.config.ts
src/server/http/
src/app/api/
```
