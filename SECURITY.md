# Security Policy

## Supported Versions

Security fixes are handled for the current `main` branch and the latest tagged release, once releases exist.

## Reporting a Vulnerability

Please do not report security issues in public GitHub issues.

Use GitHub's private vulnerability reporting for this repository when it is available. If private reporting is not enabled, open a public issue that only asks for a private contact path. Do not include exploit details, secrets, tokens, user data, logs, screenshots, or reproduction steps in that public issue.

Include this information in the private report:

- A short description of the issue.
- The affected route, feature, file, or deployment setting.
- Steps to reproduce with test data only.
- The impact you expect.
- Any safe mitigation you already tested.

## Scope

Reports are in scope when they affect Blogr's app code, API routes, Convex functions, auth flow, storage flow, generated content handling, or documented deployment setup.

Third-party provider issues should be reported to the provider unless Blogr's integration makes the issue worse.

## Secrets

Never commit `.env.local`, private keys, service tokens, Vercel project metadata, Convex deployment secrets, R2 credentials, or provider API keys.

Before making a fork public, run a secret scan across the current tree and git history.

## Disclosure

Give maintainers a reasonable chance to investigate and patch before sharing details publicly.
