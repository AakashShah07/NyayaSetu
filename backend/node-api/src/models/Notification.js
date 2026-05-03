const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['deadline_reminder', 'escalation', 'status_change', 'assignment', 'system'],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    judgment: { type: mongoose.Schema.Types.ObjectId, ref: 'Judgment' },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low',
    },
    channel: {
      type: String,
      enum: ['dashboard', 'email', 'both'],
      default: 'dashboard',
    },
    read: { type: Boolean, default: false },
    dismissed: { type: Boolean, default: false },
    snoozedUntil: { type: Date },
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, read: 1 });
notificationSchema.index({ task: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
