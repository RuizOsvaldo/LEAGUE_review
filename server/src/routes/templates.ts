import { Router } from 'express';
import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import { reviewTemplates } from '../db/schema';
import { isActiveInstructor } from '../middleware/auth';

export const templatesRouter = Router();

templatesRouter.use(isActiveInstructor);

function formatTemplate(t: typeof reviewTemplates.$inferSelect) {
  return {
    id: t.id,
    name: t.name,
    subject: t.subject,
    body: t.body,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  };
}

// GET /api/templates
templatesRouter.get('/templates', async (req, res, next) => {
  try {
    const instructorId = req.session.user!.instructorId!;
    const rows = await db
      .select()
      .from(reviewTemplates)
      .where(eq(reviewTemplates.instructorId, instructorId));
    res.json(rows.map(formatTemplate));
  } catch (err) {
    next(err);
  }
});

// POST /api/templates
templatesRouter.post('/templates', async (req, res, next) => {
  try {
    const instructorId = req.session.user!.instructorId!;
    const { name, subject, body } = req.body as { name?: string; subject?: string; body?: string };

    if (!name || !subject || !body) {
      res.status(400).json({ error: 'name, subject, and body are required' });
      return;
    }

    const [tmpl] = await db
      .insert(reviewTemplates)
      .values({ instructorId, name, subject, body })
      .returning();

    res.status(201).json(formatTemplate(tmpl));
  } catch (err) {
    next(err);
  }
});

// PUT /api/templates/:id
templatesRouter.put('/templates/:id', async (req, res, next) => {
  try {
    const instructorId = req.session.user!.instructorId!;
    const id = parseInt(req.params.id, 10);

    const [existing] = await db
      .select()
      .from(reviewTemplates)
      .where(and(eq(reviewTemplates.id, id), eq(reviewTemplates.instructorId, instructorId)));

    if (!existing) {
      res.status(404).json({ error: 'Template not found' });
      return;
    }

    const { name, subject, body } = req.body as { name?: string; subject?: string; body?: string };
    const [updated] = await db
      .update(reviewTemplates)
      .set({
        ...(name !== undefined && { name }),
        ...(subject !== undefined && { subject }),
        ...(body !== undefined && { body }),
        updatedAt: new Date(),
      })
      .where(eq(reviewTemplates.id, id))
      .returning();

    res.json(formatTemplate(updated));
  } catch (err) {
    next(err);
  }
});

// DELETE /api/templates/:id
templatesRouter.delete('/templates/:id', async (req, res, next) => {
  try {
    const instructorId = req.session.user!.instructorId!;
    const id = parseInt(req.params.id, 10);

    const [existing] = await db
      .select()
      .from(reviewTemplates)
      .where(and(eq(reviewTemplates.id, id), eq(reviewTemplates.instructorId, instructorId)));

    if (!existing) {
      res.status(404).json({ error: 'Template not found' });
      return;
    }

    await db.delete(reviewTemplates).where(eq(reviewTemplates.id, id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
