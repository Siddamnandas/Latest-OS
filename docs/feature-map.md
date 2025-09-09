# Feature Map

Date: 2025-09-08

This document inventories primary UI components, routes, and core features present in the repository. It will be refined as we expand automated coverage and wire up missing behaviors.

## App Routes (API)

- Memories: `src/app/api/memories/route.ts`, `src/app/api/memories/[id]/route.ts`
- Notifications: `src/app/api/notifications/route.ts`, `push/route.ts`, `subscribe/route.ts`
- Analytics: `src/app/api/analytics/route.ts`
- Achievements: `src/app/api/achievements/route.ts`
- Auth: `src/app/api/auth/login/route.ts`, `src/app/api/auth/register/route.ts`, `src/app/api/auth/me/route.ts`
- Admin monitoring: `src/app/api/admin/monitoring/route.ts`
- Conversations: `src/app/api/conversations/route.ts`
- Cultural preferences: `src/app/api/cultural/preferences/route.ts`
- Family/kids: multiple under `src/app/api/kids/**`, `src/app/api/family/**`
- Tasks, Goals, Milestones: `src/app/api/tasks/**`, `src/app/api/goals/**`, `src/app/api/milestones/**`
- Offline/sync: `src/app/api/offline/**`, `src/app/api/sync/**`

Note: Several routes contain placeholder logic or are partially implemented vs current Prisma schema.

## UI Components (selected)

- Daily Sync: `src/components/DailySyncCard.tsx`, `src/components/DailySyncModal.tsx`
- Contextual Nudge: `src/components/ContextualNudgeCard.tsx`
- Memory: `src/components/MemoryJukebox.tsx`, `src/components/MemoryRecordingModal.tsx`
- Task management: `src/components/TaskManagement.tsx`, `src/components/LiveTaskManagement.tsx`, `src/components/SwipeableTaskCard.tsx`
- Kids: `src/components/KidsDashboard.tsx`, `src/components/LiveKidsActivities.tsx`
- Navigation: `src/components/BottomNavigation.tsx`, `src/components/FloatingActionButton.tsx`, `src/components/ConnectionStatus.tsx`
- Gamification: `src/hooks/useGamification.tsx`, `src/components/BalanceCompass.tsx`
- Privacy/Consent: `src/components/PrivacyConsentModal.tsx`
- Onboarding: `src/components/OnboardingFlow.tsx`
- Micro-Offers: `src/components/MicroOfferSystem.tsx`

## Pages (selected)

- Home: `src/app/page.tsx`
- Billing: `src/app/(dashboard)/billing/page.tsx`
- Layout: `src/app/layout.tsx`

## Supporting Libs

- Socket: `src/lib/socket.ts`, custom server: `server.ts`
- Logger: `src/lib/logger.ts`
- Database: `src/lib/db.ts`, Prisma schema: `prisma/schema.prisma`
- Performance: `src/lib/performance.ts`

## E2E Tests

- Click-crawl: `tests/e2e/crawl.e2e.ts` (artifacts in `artifacts/ui-crawl/<timestamp>/`)
