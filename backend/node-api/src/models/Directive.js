const mongoose = require('mongoose');

const directiveSchema = new mongoose.Schema(
  {
    judgment: { type: mongoose.Schema.Types.ObjectId, ref: 'Judgment', required: true },
    directiveText: { type: String, required: true },
    mainAction: { type: String },
    conditions: [{ type: String }],
    deadline: { type: Date },
    deadlineText: { type: String },
    responsibleDepartment: { type: String },
    responsibleEntity: { type: String },
    sourcePage: { type: Number },
    sourceText: { type: String },
    confidence: { type: Number, min: 0, max: 1 },
    reviewStatus: {
      type: String,
      enum: ['auto_accepted', 'needs_review', 'manually_verified'],
      default: 'auto_accepted',
    },
  },
  { timestamps: true }
);

directiveSchema.index({ judgment: 1 });
directiveSchema.index({ deadline: 1 });
directiveSchema.index({ responsibleDepartment: 1 });

module.exports = mongoose.model('Directive', directiveSchema);
