const Judgment = require('../models/Judgment');
const Directive = require('../models/Directive');
const Task = require('../models/Task');
const extractionQueue = require('../services/extractionQueue');
const { success, error } = require('../utils/apiResponse');

const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sort = req.query.sort || '-createdAt';
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.extractionStatus = req.query.status;

    const [judgments, total] = await Promise.all([
      Judgment.find(filter).sort(sort).skip(skip).limit(limit).populate('uploadedBy', 'name email'),
      Judgment.countDocuments(filter),
    ]);

    return success(res, judgments, 'Judgments retrieved', 200, {
      page, limit, total, pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const judgment = await Judgment.findById(req.params.id).populate('uploadedBy', 'name email');
    if (!judgment) return error(res, 'Judgment not found', 404);
    return success(res, judgment);
  } catch (err) {
    next(err);
  }
};

const upload = async (req, res, next) => {
  try {
    if (!req.file) return error(res, 'PDF file is required', 400);

    const { caseId, courtName, judgmentDate } = req.body;
    if (!caseId) return error(res, 'Case ID is required', 400);

    const judgment = await Judgment.create({
      caseId,
      courtName,
      judgmentDate,
      fileUrl: req.file.path,
      originalFilename: req.file.originalname,
      uploadedBy: req.user.userId,
    });

    return success(res, judgment, 'Judgment uploaded', 201);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const judgment = await Judgment.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!judgment) return error(res, 'Judgment not found', 404);
    return success(res, judgment, 'Judgment updated');
  } catch (err) {
    next(err);
  }
};

const bulkUpload = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return error(res, 'At least one PDF file is required', 400);
    }

    const caseIds = req.body.caseIds;
    const parsedIds = Array.isArray(caseIds) ? caseIds : caseIds ? [caseIds] : [];

    const created = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const caseId = parsedIds[i] || `BULK-${Date.now()}-${i + 1}`;

      const judgment = await Judgment.create({
        caseId,
        fileUrl: file.path,
        originalFilename: file.originalname,
        uploadedBy: req.user.userId,
      });
      created.push(judgment);
      extractionQueue.enqueue(judgment._id.toString());
    }

    return success(res, {
      uploaded: created.length,
      judgments: created,
      queueStatus: extractionQueue.getStatus(),
    }, `${created.length} judgments uploaded and queued for extraction`, 201);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const judgment = await Judgment.findById(req.params.id);
    if (!judgment) return error(res, 'Judgment not found', 404);

    // Cascade delete directives and tasks
    const directives = await Directive.find({ judgment: judgment._id });
    const directiveIds = directives.map((d) => d._id);
    await Task.deleteMany({ directive: { $in: directiveIds } });
    await Directive.deleteMany({ judgment: judgment._id });
    await Judgment.findByIdAndDelete(req.params.id);

    return success(res, null, 'Judgment and associated records deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, upload, bulkUpload, update, remove };
