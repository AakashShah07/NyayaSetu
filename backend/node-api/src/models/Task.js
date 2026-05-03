const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    directive: { type: mongoose.Schema.Types.ObjectId, ref: 'Directive', required: true },
    judgment: { type: mongoose.Schema.Types.ObjectId, ref: 'Judgment', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    department: { type: String },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed', 'overdue', 'archived'],
      default: 'not_started',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    dueDate: { type: Date, required: true },
    completedAt: { type: Date },
    evidenceFiles: [
      {
        fileName: String,
        fileUrl: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    notes: { type: String },
    escalationLevel: { type: Number, default: 0 },
    lastAlertAt: { type: Date },
  },
  { timestamps: true }
);

taskSchema.index({ status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ department: 1 });

module.exports = mongoose.model('Task', taskSchema);
