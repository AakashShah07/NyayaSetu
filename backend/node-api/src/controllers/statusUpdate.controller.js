const StatusUpdate = require('../models/StatusUpdate');
const Task = require('../models/Task');
const { success, error } = require('../utils/apiResponse');

const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.task) filter.task = req.query.task;

    const [updates, total] = await Promise.all([
      StatusUpdate.find(filter).sort('-createdAt').skip(skip).limit(limit)
        .populate('updatedBy', 'name email')
        .populate('task', 'title status'),
      StatusUpdate.countDocuments(filter),
    ]);

    return success(res, updates, 'Status updates retrieved', 200, {
      page, limit, total, pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const task = await Task.findById(req.body.task);
    if (!task) return error(res, 'Task not found', 404);

    const previousStatus = task.status;
    task.status = req.body.newStatus;
    if (req.body.newStatus === 'completed') task.completedAt = new Date();
    await task.save();

    const statusUpdate = await StatusUpdate.create({
      task: task._id,
      previousStatus,
      newStatus: req.body.newStatus,
      updatedBy: req.user.userId,
      notes: req.body.notes,
    });

    return success(res, statusUpdate, 'Status updated', 201);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, create };
