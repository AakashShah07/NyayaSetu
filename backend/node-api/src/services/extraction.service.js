const Judgment = require('../models/Judgment');
const Directive = require('../models/Directive');
const Task = require('../models/Task');
const nlpBridge = require('../utils/nlpBridge');

function computePriority(dueDate) {
  const days = Math.ceil((dueDate - new Date()) / 86400000);
  if (days < 7) return 'critical';
  if (days < 30) return 'high';
  if (days < 90) return 'medium';
  return 'low';
}

async function runExtraction(judgmentId) {
  const judgment = await Judgment.findById(judgmentId);
  if (!judgment) throw Object.assign(new Error('Judgment not found'), { code: 'NOT_FOUND' });
  if (!judgment.fileUrl) throw Object.assign(new Error('No PDF file'), { code: 'NO_FILE' });

  judgment.extractionStatus = 'processing';
  judgment.extractionError = null;
  await judgment.save();

  try {
    const judgmentDateStr = judgment.judgmentDate
      ? judgment.judgmentDate.toISOString().split('T')[0]
      : null;
    const result = await nlpBridge.extractDirectives(judgment.fileUrl, judgmentDateStr);

    // Store extracted text
    judgment.extractedText = result.full_text;
    judgment.extractedAt = new Date();

    // Update metadata from NER (only if not already set)
    const meta = result.metadata || {};
    if (!judgment.courtName && meta.court_name?.value) {
      judgment.courtName = meta.court_name.value;
    }
    if (!judgment.judgmentDate && meta.judgment_date?.value) {
      judgment.judgmentDate = new Date(meta.judgment_date.value);
    }
    if (!judgment.filingDate && meta.filing_date?.value) {
      judgment.filingDate = new Date(meta.filing_date.value);
    }
    if ((!judgment.judges || judgment.judges.length === 0) && meta.judges?.length) {
      judgment.judges = meta.judges.map((j) => j.value);
    }
    if (!judgment.parties?.petitioner && meta.parties?.petitioner?.value) {
      judgment.parties = {
        petitioner: meta.parties.petitioner.value,
        respondent: meta.parties.respondent?.value || '',
      };
    }

    judgment.extractionStatus = 'completed';

    // Create Directive records
    const directives = result.directives || [];
    const createdDirectives = [];
    const createdTasks = [];

    for (const d of directives) {
      const directive = await Directive.create({
        judgment: judgment._id,
        directiveText: d.directive_text,
        mainAction: d.main_action,
        conditions: d.conditions || [],
        deadline: d.deadline ? new Date(d.deadline) : null,
        deadlineText: d.deadline_text,
        responsibleDepartment: d.responsible_department || 'General',
        responsibleEntity: d.responsible_entity,
        sourcePage: d.source_page,
        sourceText: d.source_text,
        confidence: d.confidence,
        reviewStatus: d.review_status || 'needs_review',
      });
      createdDirectives.push(directive);

      if (d.deadline) {
        const dueDate = new Date(d.deadline);
        const task = await Task.create({
          directive: directive._id,
          judgment: judgment._id,
          title: (d.main_action || d.directive_text).slice(0, 100),
          description: d.directive_text,
          department: d.responsible_department || 'General',
          dueDate,
          priority: computePriority(dueDate),
          status: 'not_started',
        });
        createdTasks.push(task);
      }
    }

    // Flag for admin review if any directive has low confidence + no deadline
    const needsReview = createdDirectives.some(
      (d) => d.confidence < 0.7 && !d.deadline
    );
    judgment.needsAdminReview = needsReview;
    await judgment.save();

    return {
      judgmentId: judgment._id,
      metadata: result.metadata,
      extractionInfo: result.extraction_info,
      directivesFound: createdDirectives.length,
      tasksCreated: createdTasks.length,
      needsReview: createdDirectives.filter((d) => d.reviewStatus === 'needs_review').length,
      directives: createdDirectives,
      tasks: createdTasks,
    };
  } catch (err) {
    // Classify error
    let errorCode = 'EXTRACTION_ERROR';
    if (err.code === 'ENOENT') errorCode = 'FILE_NOT_FOUND';
    else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) errorCode = 'NLP_TIMEOUT';
    else if (err.response?.status === 422) errorCode = 'INVALID_PDF';
    else if (err.response?.status >= 500) errorCode = 'NLP_SERVICE_ERROR';
    else if (err.code === 'ECONNREFUSED') errorCode = 'NLP_SERVICE_ERROR';

    judgment.extractionStatus = 'failed';
    judgment.extractionError = errorCode;
    await judgment.save();

    throw Object.assign(err, { extractionErrorCode: errorCode });
  }
}

module.exports = { runExtraction, computePriority };
