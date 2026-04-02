import { Router } from 'express';
import { eq, and, count, sql } from 'drizzle-orm';
import { db } from '../db';
import { monthlyReviews, instructorStudents, students } from '../db/schema';
import { isActiveInstructor } from '../middleware/auth';

export const instructorRouter = Router();

// GET /api/instructor/dashboard?month=YYYY-MM
instructorRouter.get('/instructor/dashboard', isActiveInstructor, async (req, res, next) => {
  try {
    const instructorId = req.session.user!.instructorId!;

    // Default to current month if not provided
    const monthParam = req.query.month as string | undefined;
    const month =
      monthParam && /^\d{4}-\d{2}$/.test(monthParam)
        ? monthParam
        : new Date().toISOString().slice(0, 7);

    // Count reviews by status for this instructor and month
    const statusCounts = await db
      .select({
        status: monthlyReviews.status,
        count: count(),
      })
      .from(monthlyReviews)
      .where(and(eq(monthlyReviews.instructorId, instructorId), eq(monthlyReviews.month, month)))
      .groupBy(monthlyReviews.status);

    const counts = { pending: 0, draft: 0, sent: 0 };
    for (const row of statusCounts) {
      counts[row.status] = Number(row.count);
    }

    // Count assigned students
    const [studentCountRow] = await db
      .select({ count: count() })
      .from(instructorStudents)
      .where(eq(instructorStudents.instructorId, instructorId));

    res.json({
      month,
      totalStudents: Number(studentCountRow?.count ?? 0),
      pending: counts.pending,
      draft: counts.draft,
      sent: counts.sent,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/instructor/students — list all students assigned to this instructor
instructorRouter.get('/instructor/students', isActiveInstructor, async (req, res, next) => {
  try {
    const instructorId = req.session.user!.instructorId!;

    const rows = await db
      .select({
        id: students.id,
        name: students.name,
        githubUsername: students.githubUsername,
        assignedAt: instructorStudents.assignedAt,
      })
      .from(instructorStudents)
      .innerJoin(students, eq(instructorStudents.studentId, students.id))
      .where(eq(instructorStudents.instructorId, instructorId))
      .orderBy(students.name);

    res.json(rows);
  } catch (err) {
    next(err);
  }
});
