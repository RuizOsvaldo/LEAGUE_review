CREATE TABLE IF NOT EXISTS "volunteer_event_schedule" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_occurrence_id" text NOT NULL,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL,
	"instructors" json NOT NULL,
	"volunteers" json NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "volunteer_event_schedule_event_occurrence_id_unique" UNIQUE("event_occurrence_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "volunteer_schedule" (
	"volunteer_name" text PRIMARY KEY NOT NULL,
	"is_scheduled" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "instructor_students" ADD COLUMN IF NOT EXISTS "last_seen_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "service_feedback" ADD COLUMN IF NOT EXISTS "suggestion" text;
