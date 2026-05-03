const request = require('supertest');
const app = require('../src/app');
const Judgment = require('../src/models/Judgment');
const Directive = require('../src/models/Directive');
const Task = require('../src/models/Task');

describe('Task API', () => {
  let token;
  let judgment;
  let directive;

  beforeEach(async () => {
    // Register and get token
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Test Admin',
      email: 'admin@test.gov.in',
      password: 'testpass123',
      role: 'admin',
      department: 'General',
    });
    token = reg.body.data.accessToken;

    // Create judgment and directive
    judgment = await Judgment.create({
      caseId: 'TEST/2024/001',
      fileUrl: '/tmp/test.pdf',
      uploadedBy: reg.body.data.user._id,
    });
    directive = await Directive.create({
      judgment: judgment._id,
      directiveText: 'Test directive',
      confidence: 0.9,
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          directive: directive._id,
          judgment: judgment._id,
          title: 'Test Task',
          dueDate: '2025-12-31',
        });
      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe('Test Task');
      expect(res.body.data.status).toBe('not_started');
    });
  });

  describe('GET /api/tasks', () => {
    it('should list tasks with pagination', async () => {
      await Task.create({
        directive: directive._id,
        judgment: judgment._id,
        title: 'Task 1',
        dueDate: new Date('2025-12-31'),
      });

      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.pagination).toBeDefined();
    });

    it('should filter by judgment', async () => {
      await Task.create({
        directive: directive._id,
        judgment: judgment._id,
        title: 'Task 1',
        dueDate: new Date('2025-12-31'),
      });

      const res = await request(app)
        .get(`/api/tasks?judgment=${judgment._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update task status', async () => {
      const task = await Task.create({
        directive: directive._id,
        judgment: judgment._id,
        title: 'Task 1',
        dueDate: new Date('2025-12-31'),
      });

      const res = await request(app)
        .put(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'in_progress' });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('in_progress');
    });
  });

  describe('PUT /api/tasks/:id/reassign', () => {
    it('should reassign task to different department', async () => {
      const task = await Task.create({
        directive: directive._id,
        judgment: judgment._id,
        title: 'Task 1',
        department: 'General',
        dueDate: new Date('2025-12-31'),
      });

      const res = await request(app)
        .put(`/api/tasks/${task._id}/reassign`)
        .set('Authorization', `Bearer ${token}`)
        .send({ department: 'Environment' });
      expect(res.status).toBe(200);
      expect(res.body.data.department).toBe('Environment');
    });
  });
});
