const Judgment = require('../models/Judgment');
const Directive = require('../models/Directive');
const Task = require('../models/Task');
const nlpBridge = require('../utils/nlpBridge');
const { runExtraction } = require('../services/extraction.service');
const extractionQueue = require('../services/extractionQueue');
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
    const result = await runExtraction(req.params.judgmentId);
    return success(res, result, 'Directive extraction completed');
  } catch (err) {
    if (err.code === 'NOT_FOUND') return error(res, 'Judgment not found', 404);
    if (err.code === 'NO_FILE') return error(res, 'No PDF file attached', 400);
    return error(res, `Directive extraction failed: ${err.message}`, 500);
  }
};

const extractDirectivesFromText = async (req, res, next) => {
  try {
    const judgment = await Judgment.findById(req.params.judgmentId);
    if (!judgment) return error(res, 'Judgment not found', 404);

    const { text } = req.body;
    if (!text) return error(res, 'Text is required', 400);

    judgment.extractionStatus = 'processing';
    await judgment.save();

    try {
      const judgmentDateStr = judgment.judgmentDate
        ? judgment.judgmentDate.toISOString().split('T')[0]
        : null;
      const result = await nlpBridge.extractDirectivesFromText(text, judgmentDateStr);

      judgment.extractedText = text;
      judgment.extractedAt = new Date();
      judgment.extractionStatus = 'completed';
      judgment.extractionError = null;

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
          const { computePriority } = require('../services/extraction.service');
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

      await judgment.save();

      return success(res, {
        judgmentId: judgment._id,
        directivesFound: createdDirectives.length,
        tasksCreated: createdTasks.length,
        directives: createdDirectives,
        tasks: createdTasks,
      }, 'Extraction from text completed');
    } catch (extractionError) {
      judgment.extractionStatus = 'failed';
      judgment.extractionError = 'EXTRACTION_ERROR';
      await judgment.save();
      return error(res, `Extraction failed: ${extractionError.message}`, 500);
    }
  } catch (err) {
    next(err);
  }
};

const queueStatus = async (req, res, next) => {
  try {
    const status = extractionQueue.getStatus();
    const jobs = extractionQueue.getJobs(20);
    return success(res, { ...status, jobs }, 'Queue status retrieved');
  } catch (err) {
    next(err);
  }
};

const systemStats = async (req, res, next) => {
  try {
    const [judgmentCount, directiveCount, taskCount, pendingExtractions, failedExtractions, needsReviewCount] =
      await Promise.all([
        Judgment.countDocuments(),
        Directive.countDocuments(),
        Task.countDocuments(),
        Judgment.countDocuments({ extractionStatus: 'pending' }),
        Judgment.countDocuments({ extractionStatus: 'failed' }),
        Judgment.countDocuments({ needsAdminReview: true }),
      ]);

    let nlpHealthy = false;
    try {
      await nlpBridge.checkHealth();
      nlpHealthy = true;
    } catch { /* ignore */ }

    const queue = extractionQueue.getStatus();

    return success(res, {
      counts: { judgments: judgmentCount, directives: directiveCount, tasks: taskCount },
      extraction: { pending: pendingExtractions, failed: failedExtractions, needsReview: needsReviewCount },
      nlpService: { healthy: nlpHealthy },
      queue,
    }, 'System stats retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  health, extract, extractDirectives, extractDirectivesFromText,
  queueStatus, systemStats,
};
