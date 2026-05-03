const Judgment = require('../models/Judgment');
const Directive = require('../models/Directive');
const Task = require('../models/Task');
const nlpBridge = require('../utils/nlpBridge');
const { success, error } = require('../utils/apiResponse');

const health = async (req, res, next) => {
  try {
    const nlpHealth = await nlpBridge.checkHealth();
    return success(res, nlpHealth, 'NLP service is healthy');
  } catch (err) {
    return error(res, 'NLP service is unavailable', 503);
  }
};

const extract = async (req, res, next) => {
  try {
    const judgment = await Judgment.findById(req.params.judgmentId);
    if (!judgment) return error(res, 'Judgment not found', 404);

    judgment.extractionStatus = 'processing';
    await judgment.save();

    try {
      const textResult = await nlpBridge.extractText(judgment.fileUrl);
      judgment.extractedText = textResult.text;

      const entities = await nlpBridge.extractEntities(textResult.text);

      judgment.extractionStatus = 'completed';
      judgment.extractedAt = new Date();
      await judgment.save();

      return success(res, { text: textResult.text, entities }, 'Extraction completed');
    } catch (extractionError) {
      judgment.extractionStatus = 'failed';
      await judgment.save();
      return error(res, `Extraction failed: ${extractionError.message}`, 500);
    }
  } catch (err) {
    next(err);
  }
};

const extractDirectives = async (req, res, next) => {
  try {
    const judgment = await Judgment.findById(req.params.judgmentId);
    if (!judgment) return error(res, 'Judgment not found', 404);
    if (!judgment.fileUrl) return error(res, 'No PDF file attached to this judgment', 400);

    judgment.extractionStatus = 'processing';
    await judgment.save();

    try {
      // Call Python NLP pipeline
      const judgmentDateStr = judgment.judgmentDate
        ? judgment.judgmentDate.toISOString().split('T')[0]
        : null;
      const result = await nlpBridge.extractDirectives(judgment.fileUrl, judgmentDateStr);

      // Store extracted text
      judgment.extractedText = result.full_text;
      judgment.extractedAt = new Date();

      // Update judgment metadata from NER (only if not already set)
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
      await judgment.save();

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

        // Auto-create Task for directives with deadlines
        if (d.deadline) {
          const dueDate = new Date(d.deadline);
          const task = await Task.create({
            directive: directive._id,
            judgment: judgment._id,
            title: (d.main_action || d.directive_text).slice(0, 100),
            description: d.directive_text,
            department: d.responsible_department || 'General',
            dueDate,
            priority: _computePriority(dueDate),
            status: 'not_started',
          });
          createdTasks.push(task);
        }
      }

      return success(res, {
        judgmentId: judgment._id,
        metadata: result.metadata,
        extractionInfo: result.extraction_info,
        directivesFound: createdDirectives.length,
        tasksCreated: createdTasks.length,
        needsReview: createdDirectives.filter((d) => d.reviewStatus === 'needs_review').length,
        directives: createdDirectives,
        tasks: createdTasks,
      }, 'Directive extraction completed');
    } catch (extractionError) {
      judgment.extractionStatus = 'failed';
      await judgment.save();
      return error(res, `Directive extraction failed: ${extractionError.message}`, 500);
    }
  } catch (err) {
    next(err);
  }
};

function _computePriority(dueDate) {
  const now = new Date();
  const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
  if (daysUntilDue < 7) return 'critical';
  if (daysUntilDue < 30) return 'high';
  if (daysUntilDue < 90) return 'medium';
  return 'low';
}

module.exports = { health, extract, extractDirectives };
