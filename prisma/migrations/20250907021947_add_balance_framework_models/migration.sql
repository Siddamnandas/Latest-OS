/*
  Warnings:

  - You are about to drop the column `version` on the `couples` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `memories` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `totp_enabled` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `totp_recovery_codes` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `totp_secret` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."couples" DROP COLUMN "version",
ALTER COLUMN "subscription_status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."memories" DROP COLUMN "version";

-- AlterTable
ALTER TABLE "public"."tasks" DROP COLUMN "version";

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "password_hash",
DROP COLUMN "role",
DROP COLUMN "totp_enabled",
DROP COLUMN "totp_recovery_codes",
DROP COLUMN "totp_secret";

-- CreateTable
CREATE TABLE "public"."child_profiles" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "avatar" TEXT,
    "preferences" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "child_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."child_progress" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "totalActivitiesCompleted" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "kindnessPoints" INTEGER NOT NULL DEFAULT 0,
    "creativityScore" INTEGER NOT NULL DEFAULT 0,
    "emotionalIntelligenceLevel" INTEGER NOT NULL DEFAULT 1,
    "skillsAcquired" TEXT NOT NULL DEFAULT '[]',
    "learningPath" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "child_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."child_achievements" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requirements" TEXT NOT NULL DEFAULT '[]',

    CONSTRAINT "child_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."child_goals" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "target" INTEGER NOT NULL,
    "current" INTEGER NOT NULL DEFAULT 0,
    "deadline" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "child_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."activities" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "ageMin" INTEGER NOT NULL,
    "ageMax" INTEGER NOT NULL,
    "estimatedDuration" INTEGER NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "instructions" TEXT NOT NULL DEFAULT '[]',
    "materials" TEXT NOT NULL DEFAULT '[]',
    "learningObjectives" TEXT NOT NULL DEFAULT '[]',
    "parentGuidance" TEXT,
    "safetyNotes" TEXT NOT NULL DEFAULT '[]',
    "accessibility" TEXT NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."activity_completions" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER,
    "answers" TEXT NOT NULL DEFAULT '{}',
    "reflection" TEXT,
    "parentFeedback" TEXT,
    "media" TEXT NOT NULL DEFAULT '[]',
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."balance_assessments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "assessmentDate" TEXT NOT NULL,
    "answers" TEXT NOT NULL,
    "krishnaScore" DOUBLE PRECISION NOT NULL,
    "ramScore" DOUBLE PRECISION NOT NULL,
    "shivaScore" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "balance_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."balance_tasks" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "assignedTo" TEXT NOT NULL,
    "archetype" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "pointsValue" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "category" TEXT NOT NULL,

    CONSTRAINT "balance_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."balance_milestones" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "achievementType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bonusPoints" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "balance_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "child_progress_childId_key" ON "public"."child_progress"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "child_achievements_childId_achievementId_key" ON "public"."child_achievements"("childId", "achievementId");

-- AddForeignKey
ALTER TABLE "public"."child_progress" ADD CONSTRAINT "child_progress_childId_fkey" FOREIGN KEY ("childId") REFERENCES "public"."child_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."child_achievements" ADD CONSTRAINT "child_achievements_childId_fkey" FOREIGN KEY ("childId") REFERENCES "public"."child_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."child_goals" ADD CONSTRAINT "child_goals_childId_fkey" FOREIGN KEY ("childId") REFERENCES "public"."child_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activity_completions" ADD CONSTRAINT "activity_completions_childId_fkey" FOREIGN KEY ("childId") REFERENCES "public"."child_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activity_completions" ADD CONSTRAINT "activity_completions_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "public"."activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."balance_assessments" ADD CONSTRAINT "balance_assessments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."balance_assessments" ADD CONSTRAINT "balance_assessments_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "public"."couples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."balance_tasks" ADD CONSTRAINT "balance_tasks_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "public"."couples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."balance_milestones" ADD CONSTRAINT "balance_milestones_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "public"."couples"("id") ON DELETE CASCADE ON UPDATE CASCADE;
