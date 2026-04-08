CREATE TABLE "volunteer_event_schedule" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_occurrence_id" text NOT NULL UNIQUE,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL,
	"instructors" json NOT NULL,
	"volunteers" json NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
