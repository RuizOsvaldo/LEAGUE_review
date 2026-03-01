import request from 'supertest';
import app from '../../server/src/index';

describe('POST /api/auth/login', () => {
  it('logs in as admin and returns correct user shape', async () => {
    const res = await request(app).post('/api/auth/login').send({ role: 'admin' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: 0,
      name: 'Test Admin',
      email: 'admin@test.local',
      isAdmin: true,
      isActiveInstructor: false,
    });
  });

  it('logs in as instructor and returns correct user shape', async () => {
    const res = await request(app).post('/api/auth/login').send({ role: 'instructor' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: 1,
      isAdmin: false,
      isActiveInstructor: true,
      instructorId: 1,
    });
  });

  it('logs in as inactive and returns correct user shape', async () => {
    const res = await request(app).post('/api/auth/login').send({ role: 'inactive' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: 2,
      isAdmin: false,
      isActiveInstructor: false,
    });
  });

  it('returns 400 for an invalid role', async () => {
    const res = await request(app).post('/api/auth/login').send({ role: 'superuser' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid role' });
  });

  it('returns 400 when role is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid role' });
  });
});

describe('GET /api/auth/me', () => {
  it('returns 401 without a session', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthenticated' });
  });

  it('returns user after login (cookie-based session)', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ role: 'admin' });
    const res = await agent.get('/api/auth/me');
    expect(res.status).toBe(200);
    expect(res.body.isAdmin).toBe(true);
  });
});

describe('POST /api/auth/logout', () => {
  it('destroys session; subsequent GET /me returns 401', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ role: 'instructor' });
    const logout = await agent.post('/api/auth/logout');
    expect(logout.status).toBe(200);
    expect(logout.body).toEqual({ ok: true });
    const me = await agent.get('/api/auth/me');
    expect(me.status).toBe(401);
  });
});
