const User = require('../models/User');
const Notification = require('../models/Notification');
const StatusUpdate = require('../models/StatusUpdate');
const { sendAlertEmail, escalationHtml } = require('./emailService');

const LEVEL_NAMES = ['none', 'department_head', 'commissioner', 'chief_secretary'];

async function escalateTask(task) {
  const nextLevel = Math.min((task.escalationLevel || 0) + 1, 3);
  const prevLevel = task.escalationLevel || 0;

  task.escalationLevel = nextLevel;
  await task.save();

  // Find recipients based on escalation level
  let recipients = [];
  if (nextLevel === 1) {
    // Notify department heads of the task's department
    recipients = await User.find({
      role: 'department_head',
      department: task.department,
      isActive: true,
    });
  } else {
    // Level 2+ → notify all admins
    recipients = await User.find({ role: 'admin', isActive: true });
  }

  // Create notifications for each recipient
  for (const user of recipients) {
    await Notification.create({
      recipient: user._id,
      type: 'escalation',
      title: `Task Escalated (Level ${nextLevel})`,
      message: `"${task.title}" has been escalated to ${LEVEL_NAMES[nextLevel]} level.`,
      task: task._id,
      judgment: task.judgment,
      priority: 'critical',
      channel: 'both',
    });

    // Send escalation email
    await sendAlertEmail(
      user.email,
      `[ESCALATION] Task Requires Attention: ${task.title}`,
      escalationHtml(task, nextLevel)
    );
  }

  // Create audit trail
  await StatusUpdate.create({
    task: task._id,
    previousStatus: task.status,
    newStatus: task.status,
    updatedBy: recipients[0]?._id || task.assignedTo,
    notes: `Auto-escalated from level ${prevLevel} to level ${nextLevel} (${LEVEL_NAMES[nextLevel]})`,
  });

  return nextLevel;
}

async function deescalateTask(task) {
  if (task.escalationLevel > 0) {
    task.escalationLevel = 0;
    await task.save();
  }
}

module.exports = { escalateTask, deescalateTask, LEVEL_NAMES };
