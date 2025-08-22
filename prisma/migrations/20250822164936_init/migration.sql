-- CreateTable
CREATE TABLE "public"."couples" (
    "id" TEXT NOT NULL,
    "partner_a_name" TEXT NOT NULL,
    "partner_b_name" TEXT NOT NULL,
    "anniversary_date" TIMESTAMP(3),
    "city" TEXT NOT NULL DEFAULT 'Hyderabad',
    "region" TEXT NOT NULL DEFAULT 'north-india',
    "language" TEXT NOT NULL DEFAULT 'hindi',
    "children" TEXT NOT NULL DEFAULT '[]',
    "premium_until" TIMESTAMP(3),
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "subscription_status" TEXT DEFAULT 'inactive',
    "encryption_key" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "couples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sync_entries" (
    "id" TEXT NOT NULL,
    "couple_id" TEXT NOT NULL,
    "partner" TEXT NOT NULL,
    "mood_score" INTEGER NOT NULL,
    "energy_level" INTEGER NOT NULL,
    "mood_tags" TEXT NOT NULL DEFAULT '[]',
    "context_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sync_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tasks" (
    "id" TEXT NOT NULL,
    "couple_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assigned_to" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "category" TEXT NOT NULL,
    "ai_reasoning" TEXT,
    "due_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ritual_sessions" (
    "id" TEXT NOT NULL,
    "couple_id" TEXT NOT NULL,
    "ritual_type" TEXT NOT NULL,
    "archetype" TEXT NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "completion_data" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "ritual_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."rasa_balance" (
    "id" TEXT NOT NULL,
    "couple_id" TEXT NOT NULL,
    "play_percentage" DOUBLE PRECISION NOT NULL,
    "duty_percentage" DOUBLE PRECISION NOT NULL,
    "balance_percentage" DOUBLE PRECISION NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rasa_balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."children" (
    "id" TEXT NOT NULL,
    "couple_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "preferences" TEXT NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "children_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."family_activities" (
    "id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,
    "activity_type" TEXT NOT NULL,
    "activity_theme" TEXT,
    "completion_data" TEXT,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "family_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reward_transactions" (
    "id" TEXT NOT NULL,
    "couple_id" TEXT NOT NULL,
    "coins_earned" INTEGER NOT NULL,
    "coins_spent" INTEGER NOT NULL DEFAULT 0,
    "activity" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reward_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."memories" (
    "id" TEXT NOT NULL,
    "couple_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "sentiment" TEXT NOT NULL,
    "partners" TEXT NOT NULL DEFAULT '[]',
    "is_private" BOOLEAN NOT NULL DEFAULT false,
    "memory_type" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "memories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."meal_plans" (
    "id" TEXT NOT NULL,
    "couple_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meal_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."grocery_lists" (
    "id" TEXT NOT NULL,
    "couple_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grocery_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ai_suggestions" (
    "id" TEXT NOT NULL,
    "couple_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "couple_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "totp_enabled" BOOLEAN NOT NULL DEFAULT false,
    "totp_secret" TEXT,
    "totp_recovery_codes" TEXT NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."conversations" (
    "id" TEXT NOT NULL,
    "couple_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."voice_sessions" (
    "id" TEXT NOT NULL,
    "couple_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "voice_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."analytics" (
    "id" TEXT NOT NULL,
    "couple_id" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cultural_preferences" (
    "id" TEXT NOT NULL,
    "couple_id" TEXT NOT NULL,
    "preference" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cultural_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."shared_goals" (
    "id" TEXT NOT NULL,
    "couple_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "target_date" TIMESTAMP(3),
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shared_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "couple_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rasa_balance_couple_id_key" ON "public"."rasa_balance"("couple_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- AddForeignKey
ALTER TABLE "public"."sync_entries" ADD CONSTRAINT "sync_entries_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ritual_sessions" ADD CONSTRAINT "ritual_sessions_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rasa_balance" ADD CONSTRAINT "rasa_balance_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."children" ADD CONSTRAINT "children_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."family_activities" ADD CONSTRAINT "family_activities_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reward_transactions" ADD CONSTRAINT "reward_transactions_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."memories" ADD CONSTRAINT "memories_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."meal_plans" ADD CONSTRAINT "meal_plans_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."grocery_lists" ADD CONSTRAINT "grocery_lists_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ai_suggestions" ADD CONSTRAINT "ai_suggestions_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversations" ADD CONSTRAINT "conversations_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."voice_sessions" ADD CONSTRAINT "voice_sessions_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."analytics" ADD CONSTRAINT "analytics_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cultural_preferences" ADD CONSTRAINT "cultural_preferences_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."shared_goals" ADD CONSTRAINT "shared_goals_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "public"."couples"("id") ON DELETE CASCADE ON UPDATE CASCADE;
