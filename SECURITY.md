# Security Policy

## Supported Versions

Security fixes are handled for the current `main` branch and the latest tagged release, once releases exist.

## Reporting a Vulnerability

Please do not report security issues in public GitHub issues.

Use GitHub's private vulnerability reporting for this repository. On the repository's **Security** tab, select **Report a vulnerability**. Do not report security issues in public GitHub issues, discussions, or pull requests.

If private reporting is not available, contact the repository owner through an existing private, verified channel. Do not publish the vulnerability until a private reporting path is available.

Include this information in the private report:

- A short description of the issue.
- The affected route, feature, file, or deployment setting.
- Steps to reproduce with test data only.
- The impact you expect.
- Any safe mitigation you already tested.

## Scope

Reports are in scope when they affect Blogr's app code, local API routes, local storage and backups, generated content handling, or the publishing webhook.

Third-party provider issues should be reported to the provider unless Blogr's integration makes the issue worse.

## Secrets

Never commit `.env.local`, private keys, webhook tokens, or provider API keys.

Before making a fork public, run a secret scan across the current tree and git history.

## Disclosure

Give maintainers a reasonable chance to investigate and patch before sharing details publicly.
