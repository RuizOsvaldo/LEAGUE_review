import request from 'supertest';
import app from '../../server/src/index';

describe('GET /api/instructor/dashboard', () => {
  it('returns 401 without a session', async () => {
    const res = await request(app).get('/api/instructor/dashboard');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthenticated' });
  });

  it('returns 403 for admin role (not an active instructor)', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ role: 'admin' });
    const res = await agent.get('/api/instructor/dashboard');
    expect(res.status).toBe(403);
    expect(res.body).toEqual({ error: 'Forbidden' });
  });

  it('returns 403 for inactive user', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ role: 'inactive' });
    const res = await agent.get('/api/instructor/dashboard');
    expect(res.status).toBe(403);
  });

  it('returns dashboard counts for active instructor', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ role: 'instructor' });
    const res = await agent.get('/api/instructor/dashboard');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      month: expect.stringMatching(/^\d{4}-\d{2}$/),
      totalStudents: expect.any(Number),
      pending: expect.any(Number),
      draft: expect.any(Number),
      sent: expect.any(Number),
    });
  });

  it('uses provided month query parameter', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ role: 'instructor' });
    const res = await agent.get('/api/instructor/dashboard?month=2025-06');
    expect(res.status).toBe(200);
    expect(res.body.month).toBe('2025-06');
  });

  it('defaults to current month when month param is absent', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ role: 'instructor' });
    const res = await agent.get('/api/instructor/dashboard');
    expect(res.status).toBe(200);
    const currentMonth = new Date().toISOString().slice(0, 7);
    expect(res.body.month).toBe(currentMonth);
  });
});
