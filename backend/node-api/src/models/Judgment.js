const mongoose = require('mongoose');

const judgmentSchema = new mongoose.Schema(
  {
    caseId: { type: String, required: true, unique: true, trim: true },
    courtName: { type: String, trim: true },
    filingDate: { type: Date },
    judgmentDate: { type: Date },
    judges: [{ type: String }],
    parties: {
      petitioner: { type: String },
      respondent: { type: String },
    },
    fileUrl: { type: String, required: true },
    originalFilename: { type: String },
    extractedText: { type: String },
    extractionStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    extractedAt: { type: Date },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

judgmentSchema.index({ extractionStatus: 1 });

module.exports = mongoose.model('Judgment', judgmentSchema);
