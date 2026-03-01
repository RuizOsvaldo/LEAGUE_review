import request from 'supertest';
import express, { Request, Response } from 'express';
import session from 'express-session';
import { isAuthenticated, isAdmin, isActiveInstructor } from '../../server/src/middleware/auth';

// Build a minimal app for middleware testing (no DB, MemoryStore)
function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(
    session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  // Login helper — sets session.user from body
  app.post('/test/login', (req: Request, res: Response) => {
    req.session.user = req.body;
    res.json({ ok: true });
  });

  // Protected routes
  app.get('/test/auth', isAuthenticated, (_req: Request, res: Response) => res.json({ ok: true }));
  app.get('/test/admin', isAdmin, (_req: Request, res: Response) => res.json({ ok: true }));
  app.get('/test/instructor', isActiveInstructor, (_req: Request, res: Response) => res.json({ ok: true }));

  return app;
}

const ADMIN = { id: 0, name: 'Admin', email: 'a@t', isAdmin: true, isActiveInstructor: false };
const INSTRUCTOR = { id: 1, name: 'Instr', email: 'i@t', isAdmin: false, isActiveInstructor: true, instructorId: 1 };
const INACTIVE = { id: 2, name: 'Pend', email: 'p@t', isAdmin: false, isActiveInstructor: false };

describe('isAuthenticated middleware', () => {
  const app = buildApp();

  it('returns 401 with no session', async () => {
    const res = await request(app).get('/test/auth');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthenticated' });
  });

  it('passes for any authenticated user', async () => {
    const agent = request.agent(app);
    await agent.post('/test/login').send(ADMIN);
    const res = await agent.get('/test/auth');
    expect(res.status).toBe(200);
  });
});

describe('isAdmin middleware', () => {
  it('returns 401 with no session', async () => {
    const app = buildApp();
    const res = await request(app).get('/test/admin');
    expect(res.status).toBe(401);
  });

  it('passes for admin user', async () => {
    const app = buildApp();
    const agent = request.agent(app);
    await agent.post('/test/login').send(ADMIN);
    const res = await agent.get('/test/admin');
    expect(res.status).toBe(200);
  });

  it('returns 403 for active instructor', async () => {
    const app = buildApp();
    const agent = request.agent(app);
    await agent.post('/test/login').send(INSTRUCTOR);
    const res = await agent.get('/test/admin');
    expect(res.status).toBe(403);
    expect(res.body).toEqual({ error: 'Forbidden' });
  });

  it('returns 403 for inactive user', async () => {
    const app = buildApp();
    const agent = request.agent(app);
    await agent.post('/test/login').send(INACTIVE);
    const res = await agent.get('/test/admin');
    expect(res.status).toBe(403);
  });
});

describe('isActiveInstructor middleware', () => {
  it('returns 401 with no session', async () => {
    const app = buildApp();
    const res = await request(app).get('/test/instructor');
    expect(res.status).toBe(401);
  });

  it('passes for active instructor', async () => {
    const app = buildApp();
    const agent = request.agent(app);
    await agent.post('/test/login').send(INSTRUCTOR);
    const res = await agent.get('/test/instructor');
    expect(res.status).toBe(200);
  });

  it('returns 403 for admin (not an active instructor)', async () => {
    const app = buildApp();
    const agent = request.agent(app);
    await agent.post('/test/login').send(ADMIN);
    const res = await agent.get('/test/instructor');
    expect(res.status).toBe(403);
    expect(res.body).toEqual({ error: 'Forbidden' });
  });

  it('returns 403 for inactive user', async () => {
    const app = buildApp();
    const agent = request.agent(app);
    await agent.post('/test/login').send(INACTIVE);
    const res = await agent.get('/test/instructor');
    expect(res.status).toBe(403);
  });
});
