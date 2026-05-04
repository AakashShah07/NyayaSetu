const AuditLog = require('../models/AuditLog');
const { success } = require('../utils/apiResponse');

// GET /api/audit-logs
const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.entity) filter.entity = req.query.entity;
    if (req.query.action) filter.action = req.query.action;
    if (req.query.user) filter.user = req.query.user;
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate);
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(filter).sort('-createdAt').skip(skip).limit(limit).populate('user', 'name email'),
      AuditLog.countDocuments(filter),
    ]);

    return success(res, logs, 'Audit logs retrieved', 200, {
      page, limit, total, pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/audit-logs/entity/:entity/:entityId
const getByEntity = async (req, res, next) => {
  try {
    const { entity, entityId } = req.params;
    const logs = await AuditLog.find({ entity, entityId })
      .sort('-createdAt')
      .populate('user', 'name email');
    return success(res, logs, 'Entity audit trail');
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getByEntity };
