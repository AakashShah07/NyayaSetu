const request = require('supertest');
const app = require('../src/app');
const Notification = require('../src/models/Notification');

describe('Notification API', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'notify@test.gov.in',
      password: 'testpass123',
      role: 'admin',
      department: 'General',
    });
    token = reg.body.data.accessToken;
    userId = reg.body.data.user._id;
  });

  describe('GET /api/notifications', () => {
    it('should return empty list initially', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    it('should return user notifications', async () => {
      await Notification.create({
        recipient: userId,
        type: 'deadline_reminder',
        title: 'Test Alert',
        priority: 'high',
      });

      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].title).toBe('Test Alert');
    });

    it('should filter by read status', async () => {
      await Notification.create({ recipient: userId, type: 'system', title: 'Unread', read: false });
      await Notification.create({ recipient: userId, type: 'system', title: 'Read', read: true });

      const res = await request(app)
        .get('/api/notifications?read=false')
        .set('Authorization', `Bearer ${token}`);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].title).toBe('Unread');
    });
  });

  describe('GET /api/notifications/unread-count', () => {
    it('should return correct unread count', async () => {
      await Notification.create({ recipient: userId, type: 'system', title: 'A', read: false });
      await Notification.create({ recipient: userId, type: 'system', title: 'B', read: false });
      await Notification.create({ recipient: userId, type: 'system', title: 'C', read: true });

      const res = await request(app)
        .get('/api/notifications/unread-count')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.count).toBe(2);
    });
  });

  describe('PUT /api/notifications/:id/read', () => {
    it('should mark notification as read', async () => {
      const notif = await Notification.create({
        recipient: userId, type: 'system', title: 'To Read',
      });

      const res = await request(app)
        .put(`/api/notifications/${notif._id}/read`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.read).toBe(true);
    });
  });

  describe('PUT /api/notifications/read-all', () => {
    it('should mark all as read', async () => {
      await Notification.create({ recipient: userId, type: 'system', title: 'A' });
      await Notification.create({ recipient: userId, type: 'system', title: 'B' });

      const res = await request(app)
        .put('/api/notifications/read-all')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);

      const count = await Notification.countDocuments({ recipient: userId, read: false });
      expect(count).toBe(0);
    });
  });

  describe('PUT /api/notifications/:id/dismiss', () => {
    it('should dismiss notification', async () => {
      const notif = await Notification.create({
        recipient: userId, type: 'system', title: 'Dismiss Me',
      });

      const res = await request(app)
        .put(`/api/notifications/${notif._id}/dismiss`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.dismissed).toBe(true);
    });
  });

  describe('PUT /api/notifications/:id/snooze', () => {
    it('should snooze notification', async () => {
      const notif = await Notification.create({
        recipient: userId, type: 'system', title: 'Snooze Me',
      });
      const until = new Date(Date.now() + 86400000).toISOString();

      const res = await request(app)
        .put(`/api/notifications/${notif._id}/snooze`)
        .set('Authorization', `Bearer ${token}`)
        .send({ until });
      expect(res.status).toBe(200);
      expect(res.body.data.snoozedUntil).toBeTruthy();
    });
  });
});
