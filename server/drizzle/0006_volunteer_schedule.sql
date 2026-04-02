CREATE TABLE "volunteer_schedule" (
	"volunteer_name" text PRIMARY KEY NOT NULL,
	"is_scheduled" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
