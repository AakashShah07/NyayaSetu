const { checkDeadlines } = require('../src/services/alertScheduler');
const Task = require('../src/models/Task');
const User = require('../src/models/User');
const Directive = require('../src/models/Directive');
const Judgment = require('../src/models/Judgment');
const Notification = require('../src/models/Notification');

// Mock email service to prevent actual sending
jest.mock('../src/services/emailService', () => ({
  sendAlertEmail: jest.fn().mockResolvedValue(true),
  deadlineReminderHtml: jest.fn().mockReturnValue('<p>Test</p>'),
  escalationHtml: jest.fn().mockReturnValue('<p>Escalation</p>'),
}));

describe('Alert Scheduler', () => {
  let user, judgment, directive;

  beforeEach(async () => {
    user = await User.create({
      name: 'Officer', email: 'officer@test.gov.in', password: 'test12345',
      role: 'officer', department: 'Environment',
    });
    judgment = await Judgment.create({
      caseId: 'ALERT/2024/001', fileUrl: '/tmp/test.pdf', uploadedBy: user._id,
    });
    directive = await Directive.create({
      judgment: judgment._id, directiveText: 'Test directive', confidence: 0.9,
    });
  });

  it('should create low priority alert for task due in 25 days', async () => {
    await Task.create({
      directive: directive._id, judgment: judgment._id,
      title: '25-day task', department: 'Environment',
      assignedTo: user._id, dueDate: new Date(Date.now() + 25 * 86400000),
    });

    const count = await checkDeadlines();
    expect(count).toBe(1);

    const notifications = await Notification.find({ recipient: user._id });
    expect(notifications.length).toBe(1);
    expect(notifications[0].priority).toBe('low');
    expect(notifications[0].type).toBe('deadline_reminder');
  });

  it('should create high priority alert for task due in 4 days', async () => {
    await Task.create({
      directive: directive._id, judgment: judgment._id,
      title: '4-day task', department: 'Environment',
      assignedTo: user._id, dueDate: new Date(Date.now() + 4 * 86400000),
    });

    await checkDeadlines();

    const notifications = await Notification.find({ recipient: user._id });
    expect(notifications.length).toBe(1);
    expect(notifications[0].priority).toBe('high');
    expect(notifications[0].channel).toBe('both');
  });

  it('should mark overdue tasks and create critical alert', async () => {
    const task = await Task.create({
      directive: directive._id, judgment: judgment._id,
      title: 'Overdue task', department: 'Environment',
      assignedTo: user._id, dueDate: new Date(Date.now() - 2 * 86400000),
    });

    await checkDeadlines();

    const updated = await Task.findById(task._id);
    expect(updated.status).toBe('overdue');
    expect(updated.escalationLevel).toBeGreaterThan(0);
  });

  it('should skip completed tasks', async () => {
    await Task.create({
      directive: directive._id, judgment: judgment._id,
      title: 'Completed task', department: 'Environment',
      assignedTo: user._id, dueDate: new Date(Date.now() + 3 * 86400000),
      status: 'completed',
    });

    const count = await checkDeadlines();
    expect(count).toBe(0);
  });

  it('should not duplicate alerts within 24h', async () => {
    await Task.create({
      directive: directive._id, judgment: judgment._id,
      title: 'Already alerted', department: 'Environment',
      assignedTo: user._id, dueDate: new Date(Date.now() + 8 * 86400000),
      lastAlertAt: new Date(), // Already alerted
    });

    const count = await checkDeadlines();
    expect(count).toBe(0);
  });
});
