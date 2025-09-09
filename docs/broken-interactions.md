# Broken Interactions Report

Date: 2025-09-08

This report captures current broken routes, type mismatches, and wiring issues found during the baseline build and scan. Items are grouped by area with notes on fixes applied and recommended next steps.

## Summary

- Build blocked by multiple Next.js 15 route type issues and Prisma schema mismatches.
- Several API routes export unsupported members or use parameters not matching Next 15 route handler types.
- A handful of UI pages referenced components without required props.
- Multiple backend routes assume Prisma models/fields that don’t exist in the current schema.

## Fixed Now

- Memories route handlers (dynamic): updated to Next.js 15 context signature with `params` as a Promise.
- Notifications subscribe: removed invalid named exports; moved to `src/lib/notifications/subscribers.ts` and re-wired imports.
- Server logging: normalized `logger.error` single-arg call in `server.ts`.
- Billing page: removed incorrectly used `PremiumModal` without props.
- Prisma seed: aligned `User` to use `password` and removed `role` field.
- Analytics route: fixed missing function name, and typed temporary arrays to avoid `never[]` issues.
- Admin monitoring route: fixed typing for metric promises and corrected `ritualSession` timestamp field (`started_at`).
- Auth login/register: aligned to `password` field; removed unsupported fields/updates.
- Conversations route: aligned create/find to current schema (no `user` relation); store `messages` into `content`.

## Known Issues (Pending)

- Cultural Preferences API: current schema (`CulturalPreference`) uses generic `preference/value` pairs but route expects per-user structured preferences. Temporarily stubbed DB operations; needs schema/route alignment.
- Family Activities API: references models/fields not present in schema (`parentId`, `childActivity`, `developmentRecord`). Needs either schema additions or route rewrite against existing models (e.g., `Activity`, `ActivityCompletion`).
- Misc APIs under `kids/**` and `family/**` may assume fields not present in `prisma/schema.prisma`; audit and align needed.

## E2E/QA

- Added Playwright click-crawl test at `tests/e2e/crawl.e2e.ts` capturing screenshots and errors into `artifacts/ui-crawl/<timestamp>/`.
- Gate: test asserts zero console errors on happy path.

## Next Steps

- Decide authoritative Prisma schema vs. API surface; align routes to models (or vice versa) behind feature flags.
- Add unit tests for route handlers adjusted above and expand e2e flows for Daily Sync, Tasks, Memories.
- Enable typecheck in CI after addressing remaining schema/route mismatches.
