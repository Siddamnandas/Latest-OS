-- 1) MessageAuthor enum
DO $$ BEGIN
  CREATE TYPE "MessageAuthor" AS ENUM ('COACH','PARTNER_A','PARTNER_B','SYSTEM');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2) Child table
CREATE TABLE IF NOT EXISTS "Child" (
  "id" TEXT PRIMARY KEY,
  "coupleId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "birthdate" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$ BEGIN
  ALTER TABLE "Child"
    ADD CONSTRAINT "Child_coupleId_fkey"
    FOREIGN KEY ("coupleId") REFERENCES "Couple"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS "Child_coupleId_idx" ON "Child" ("coupleId");

-- 3) Message table
CREATE TABLE IF NOT EXISTS "Message" (
  "id" TEXT PRIMARY KEY,
  "coupleId" TEXT NOT NULL,
  "author" "MessageAuthor" NOT NULL,
  "body" TEXT NOT NULL,
  "sentAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$ BEGIN
  ALTER TABLE "Message"
    ADD CONSTRAINT "Message_coupleId_fkey"
    FOREIGN KEY ("coupleId") REFERENCES "Couple"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS "Message_coupleId_sentAt_idx" ON "Message" ("coupleId","sentAt");

-- 4) Milestone table
CREATE TABLE IF NOT EXISTS "Milestone" (
  "id" TEXT PRIMARY KEY,
  "coupleId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "notes" TEXT,
  "achievedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$ BEGIN
  ALTER TABLE "Milestone"
    ADD CONSTRAINT "Milestone_coupleId_fkey"
    FOREIGN KEY ("coupleId") REFERENCES "Couple"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS "Milestone_coupleId_achievedAt_idx" ON "Milestone" ("coupleId","achievedAt");

-- 5) Tag table
CREATE TABLE IF NOT EXISTS "Tag" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "type" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6) CoupleMoodTag join table
CREATE TABLE IF NOT EXISTS "CoupleMoodTag" (
  "coupleId" TEXT NOT NULL,
  "tagId" TEXT NOT NULL,
  CONSTRAINT "CoupleMoodTag_pkey" PRIMARY KEY ("coupleId","tagId")
);

DO $$ BEGIN
  ALTER TABLE "CoupleMoodTag"
    ADD CONSTRAINT "CoupleMoodTag_coupleId_fkey"
    FOREIGN KEY ("coupleId") REFERENCES "Couple"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "CoupleMoodTag"
    ADD CONSTRAINT "CoupleMoodTag_tagId_fkey"
    FOREIGN KEY ("tagId") REFERENCES "Tag"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 7) Trigger for updatedAt fields
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS child_set_updated_at ON "Child";
CREATE TRIGGER child_set_updated_at
BEFORE UPDATE ON "Child"
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS milestone_set_updated_at ON "Milestone";
CREATE TRIGGER milestone_set_updated_at
BEFORE UPDATE ON "Milestone"
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
