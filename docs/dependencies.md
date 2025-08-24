# Dependency Management

This document describes how we keep dependencies up to date and track notable changes.

## Upgrade Procedure

1. Review Dependabot pull requests or run `npm outdated` to identify packages to update.
2. Update dependencies with `npm install` or by merging the automated pull request.
3. Run `npm test` and `npm run lint` to ensure the project remains healthy.
4. Scan for vulnerabilities:
   ```bash
   npm audit --audit-level=high
   ```
5. Commit changes and update the release notes below.

## Release Notes

Record significant dependency upgrades and any required follow-up actions.

- *2024-08-23*: Initial dependency management guidelines added.
