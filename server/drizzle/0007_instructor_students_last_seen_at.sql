ALTER TABLE "instructor_students"
  ADD COLUMN IF NOT EXISTS "last_seen_at" timestamp NOT NULL DEFAULT now();
