const cron = require('node-cron');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const { sendAlertEmail, deadlineReminderHtml } = require('./emailService');
const { escalateTask } = require('./escalationService');

const ALERT_RULES = [
  { daysThreshold: 30, priority: 'low', channel: 'dashboard' },
  { daysThreshold: 10, priority: 'medium', channel: 'dashboard' },
  { daysThreshold: 5, priority: 'high', channel: 'both' },
  { daysThreshold: 0, priority: 'critical', channel: 'both', escalate: true },
];

const ONE_DAY_MS = 86400000;

async function checkDeadlines() {
  console.log('[ALERT SCHEDULER] Running deadline check...');

  const tasks = await Task.find({
    status: { $nin: ['completed', 'archived'] },
    dueDate: { $ne: null },
  }).populate('assignedTo', 'name email');

  let alertsCreated = 0;

  for (const task of tasks) {
    // Skip if already alerted in the last 24h
    if (task.lastAlertAt && Date.now() - task.lastAlertAt.getTime() < ONE_DAY_MS) {
      continue;
    }

    const daysLeft = Math.ceil((task.dueDate - new Date()) / ONE_DAY_MS);

    // Find the most urgent matching rule
    const rule = ALERT_RULES.find((r) => daysLeft <= r.daysThreshold);
    if (!rule) continue;

    // Mark overdue if past deadline
    if (daysLeft < 0 && task.status !== 'overdue') {
      task.status = 'overdue';
    }

    // Create notification for assigned user (or skip if unassigned)
    const recipientId = task.assignedTo?._id;
    if (recipientId) {
      await Notification.create({
        recipient: recipientId,
        type: 'deadline_reminder',
        title: daysLeft <= 0
          ? `OVERDUE: ${task.title}`
          : `Deadline in ${daysLeft} days: ${task.title}`,
        message: `Task "${task.title}" is ${daysLeft <= 0 ? `${Math.abs(daysLeft)} days overdue` : `due in ${daysLeft} days`}. Department: ${task.department || 'General'}.`,
        task: task._id,
        judgment: task.judgment,
        priority: rule.priority,
        channel: rule.channel,
      });
      alertsCreated++;

      // Send email if channel includes email
      if (rule.channel === 'both' || rule.channel === 'email') {
        const emailSent = await sendAlertEmail(
          task.assignedTo.email,
          `[NyayaSetu] Deadline ${daysLeft <= 0 ? 'OVERDUE' : 'Alert'}: ${task.title}`,
          deadlineReminderHtml(task, daysLeft)
        );
        if (emailSent) {
          // Mark the notification as email sent
          await Notification.findOneAndUpdate(
            { task: task._id, recipient: recipientId, type: 'deadline_reminder' },
            { emailSent: true },
            { sort: { createdAt: -1 } }
          );
        }
      }
    }

    // Escalate if rule requires it
    if (rule.escalate) {
      await escalateTask(task);
    } else if (daysLeft < 0) {
      // Further escalate overdue tasks that are already escalated
      if (task.escalationLevel > 0 && task.escalationLevel < 3) {
        await escalateTask(task);
      } else if (task.escalationLevel === 0) {
        await escalateTask(task);
      }
    }

    task.lastAlertAt = new Date();
    await task.save();
  }

  console.log(`[ALERT SCHEDULER] Check complete. ${alertsCreated} alerts created.`);
  return alertsCreated;
}

function start() {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', checkDeadlines);
  console.log('[ALERT SCHEDULER] Started — runs every hour.');
}

module.exports = { start, checkDeadlines };
