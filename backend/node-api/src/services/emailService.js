const nodemailer = require('nodemailer');

// Console transport for dev — logs email JSON to stdout
// Swap for real SMTP or SendGrid in production
const transport = nodemailer.createTransport({ jsonTransport: true });

async function sendAlertEmail(to, subject, html) {
  try {
    const info = await transport.sendMail({
      from: process.env.EMAIL_FROM || 'alerts@nyayasetu.gov.in',
      to,
      subject,
      html,
    });
    console.log('[EMAIL]', JSON.parse(info.message).subject, '→', to);
    return true;
  } catch (err) {
    console.error('[EMAIL ERROR]', err.message);
    return false;
  }
}

function deadlineReminderHtml(task, daysLeft) {
  const urgency = daysLeft <= 0 ? 'OVERDUE' : daysLeft <= 5 ? 'URGENT' : 'Reminder';
  return `
    <h2>NyayaSetu - Deadline ${urgency}</h2>
    <p><strong>Task:</strong> ${task.title}</p>
    <p><strong>Department:</strong> ${task.department || 'General'}</p>
    <p><strong>Due Date:</strong> ${task.dueDate?.toLocaleDateString('en-IN') || 'N/A'}</p>
    <p><strong>Days Remaining:</strong> ${daysLeft <= 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days`}</p>
    <p><strong>Status:</strong> ${task.status}</p>
    <hr>
    <p style="color:#666;font-size:12px">This is an automated alert from NyayaSetu Court Order Compliance Tracker.</p>
  `;
}

function escalationHtml(task, level) {
  const levelNames = ['', 'Department Head', 'Commissioner', 'Chief Secretary'];
  return `
    <h2>NyayaSetu - Escalation Alert (Level ${level})</h2>
    <p>A task has been escalated to <strong>${levelNames[level] || 'Administration'}</strong> level.</p>
    <p><strong>Task:</strong> ${task.title}</p>
    <p><strong>Department:</strong> ${task.department || 'General'}</p>
    <p><strong>Due Date:</strong> ${task.dueDate?.toLocaleDateString('en-IN') || 'N/A'}</p>
    <p><strong>Current Status:</strong> ${task.status}</p>
    <hr>
    <p style="color:#666;font-size:12px">This task requires immediate attention. Please take action.</p>
  `;
}

module.exports = { sendAlertEmail, deadlineReminderHtml, escalationHtml };
