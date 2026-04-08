CREATE TABLE "student_attendance" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"instructor_id" integer NOT NULL,
	"attended_at" timestamp with time zone NOT NULL,
	"event_occurrence_id" text NOT NULL,
	CONSTRAINT "student_attendance_student_id_instructor_id_event_occurrence_id_unique" UNIQUE("student_id","instructor_id","event_occurrence_id")
);
--> statement-breakpoint
ALTER TABLE "student_attendance" ADD CONSTRAINT "student_attendance_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_attendance" ADD CONSTRAINT "student_attendance_instructor_id_instructors_id_fk" FOREIGN KEY ("instructor_id") REFERENCES "public"."instructors"("id") ON DELETE no action ON UPDATE no action;