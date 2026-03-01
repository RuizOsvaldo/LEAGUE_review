import { Router } from 'express';
import type { SessionUser } from '../types/session';

export const authRouter = Router();

const STUB_USERS: Record<string, SessionUser> = {
  admin: {
    id: 0,
    name: 'Test Admin',
    email: 'admin@test.local',
    isAdmin: true,
    isActiveInstructor: false,
  },
  instructor: {
    id: 1,
    name: 'Test Instructor',
    email: 'instructor@test.local',
    isAdmin: false,
    isActiveInstructor: true,
    instructorId: 1,
  },
  inactive: {
    id: 2,
    name: 'Pending User',
    email: 'pending@test.local',
    isAdmin: false,
    isActiveInstructor: false,
  },
};

// POST /api/auth/login
authRouter.post('/login', (req, res) => {
  const { role } = req.body as { role?: string };
  if (!role || !STUB_USERS[role]) {
    res.status(400).json({ error: 'Invalid role' });
    return;
  }
  req.session.user = STUB_USERS[role];
  res.json(req.session.user);
});

// POST /api/auth/logout
authRouter.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.json({ ok: true });
  });
});

// GET /api/auth/me
authRouter.get('/me', (req, res) => {
  if (!req.session.user) {
    res.status(401).json({ error: 'Unauthenticated' });
    return;
  }
  res.json(req.session.user);
});
