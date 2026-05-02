const mongoose = require('mongoose');

const statusUpdateSchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    previousStatus: { type: String },
    newStatus: { type: String, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notes: { type: String },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
      },
    ],
  },
  { timestamps: true }
);

statusUpdateSchema.index({ task: 1 });
statusUpdateSchema.index({ createdAt: -1 });

module.exports = mongoose.model('StatusUpdate', statusUpdateSchema);
